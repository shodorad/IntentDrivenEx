# ClearPath AI — Intent Engine Rewrite
## Implementation Plan for Claude Code

> **Purpose:** Fix all broken conversation flows in the Maria persona (and establish a scalable pattern for all other personas) by replacing the fragile first-message routing with an explicit Intent State engine. Remove the Claude API dependency entirely. Every response will be served from deterministic demo scripts.
>
> **Do not deviate from the step order.** Each step produces a testable, stable state before the next step begins.

---

## Background: What Is Broken and Why

The current system has two response engines:

- **Engine 1 (API):** Calls the real Claude API via `callAPI()`. Used when API is available.
- **Engine 2 (Demo):** `generateDemoResponse()` in `demoResponses.js`. Used as fallback when API fails.

**Decision:** Remove Engine 1 entirely. Engine 2 becomes the only engine. All responses are deterministic and self-contained in the app.

### Root Cause of Flow Bugs

`getMariaTurnResponse()` (and all other persona turn handlers) determine which conversational path to follow by reading `userMsgs[0]` — the very first message the user ever sent. This means the entry pill "poisons" all downstream routing. If user entered via "Quick Refill — $15", every pill they tap afterward routes through the refill path, regardless of what they actually clicked.

### What the Fix Does

Replace the first-message routing variable with an explicit `activeIntent` state variable that:
- Gets set the moment a pill is clicked (not inferred from message text)
- Updates immediately when the user pivots to a new intent
- Is read by turn handlers instead of the first message
- Resets cleanly when flows complete or user returns home

---

## Architecture After This Change

```
User clicks pill
       │
       ▼
{ label: "Why am I running out?", intent: "diagnose_usage" }
       │
       ├── dispatch SET_INTENT("diagnose_usage")   ← sets activeIntent in state
       │
       └── sendMessage("Why am I running out?")
                │
                ▼
         generateDemoResponse(messages, persona, activeIntent, intentTurn)
                │
                ├── reads activeIntent = "diagnose_usage"
                ├── reads intentTurn = 0 (first response for this intent)
                └── routes to the correct script node → returns response
```

When user types free text (no pill):
```
User types "yeah go ahead"
       │
       ▼
activeIntent is still "quick_refill" (unchanged)
       │
       └── generateDemoResponse sees same intent, same turn count
           → returns the natural continuation of the current flow
```

---

## New Data Structures

### Pill Object Format (replaces plain strings)

Every pill in `demoResponses.js` changes from a plain string to an object:

```js
// BEFORE
['Yes — do it', 'Show other options', 'Cancel']

// AFTER
[
  { label: 'Yes — do it',       intent: 'confirm_refill' },
  { label: 'Show other options', intent: 'show_options'   },
  { label: 'Cancel',             intent: 'cancel'         },
]
```

`parseResponse.js` already parses ACTION_PILLS as JSON, so it handles objects automatically. No change needed to the tag format.

### New ChatContext State Fields

```js
activeIntent: null,   // string | null — current intent driving the conversation
intentTurn:   0,      // int — how many user messages sent within current intent
```

### Intent Values (Maria — us-001)

| Intent String         | Triggered By                        |
|-----------------------|-------------------------------------|
| `diagnose_usage`      | "Why am I running out?" pill        |
| `quick_refill`        | "Quick Refill — $15" pill           |
| `add_data`            | "Add 5 GB of data — $10" pill       |
| `plan_change`         | "Change my plan" pill               |
| `browse_plans`        | "Show me all plans" explore pill    |
| `browse_phones`       | "Show me the latest phones" pill    |
| `browse_deals`        | "Show me current deals" pill        |
| `browse_rewards`      | "My rewards & points" pill          |
| `confirm_refill`      | "Yes — do it" / "Confirm" pills     |
| `show_options`        | "Show other options" pill           |
| `diagnose_confirm`    | "Let's do it" pill (inside diag)   |
| `upgrade_now`         | "Start now — ~$7 today" pill        |
| `upgrade_at_renewal`  | "Switch on Apr 9 — free" pill       |
| `keep_plan`           | "Stay on my current plan" pill      |
| `try_free_fixes`      | "I'll try those" pill               |
| `cancel`              | "Cancel" / "No thanks" pills        |
| `done`                | "I'm done for now" / "Go back home" |

---

## STEP 1 — Remove the Claude API Call

**File:** `src/hooks/useChat.js`

**Goal:** Make `generateDemoResponse` the only response engine. No network calls, no try/catch around API.

### Change in `sendMessage` function

**REMOVE this entire try/catch block:**
```js
let responseText;
try {
  responseText = await callAPI(apiMessages, getSystemPrompt(persona));
} catch {
  responseText = generateDemoResponse(apiMessages, persona);
}
```

**REPLACE with:**
```js
const responseText = generateDemoResponse(apiMessages, persona, state.activeIntent, state.intentTurn);
```

Also **remove these imports** from the top of the file (they are no longer needed):
```js
import { callAPI } from '../utils/api';
import { getSystemPrompt } from '../data/systemPrompt';
```

### Update `sendMessage` signature to read new state fields

The `useCallback` dependency array must include `state.activeIntent` and `state.intentTurn`:

```js
}, [state.messages, state.persona, state.activeIntent, state.intentTurn, dispatch]);
```

### ✅ Test After Step 1

Run the app locally (`npm run dev`). Send any message. Confirm:
- Network tab shows NO calls to any API endpoint
- Responses still appear (served from demoResponses.js)
- No console errors about missing API key

---

## STEP 2 — Add Intent State to ChatContext

**File:** `src/context/ChatContext.jsx`

### Add two fields to `initialState`

```js
const initialState = {
  mode: 'landing',
  messages: [],
  isLoading: false,
  showTransparencyPanel: false,
  language: 'en',
  signalBanner: null,
  showSMSModal: false,
  smsModalData: null,
  persona: getPersonaFromURL(),
  inputFocused: false,
  activeIntent: null,    // ← ADD THIS
  intentTurn: 0,         // ← ADD THIS
};
```

### Add three new cases to `chatReducer`

Add these cases inside the `switch (action.type)` block:

```js
case 'SET_INTENT':
  return {
    ...state,
    activeIntent: action.payload,
    intentTurn: 0,       // always reset turn counter when intent changes
  };

case 'INCREMENT_INTENT_TURN':
  return {
    ...state,
    intentTurn: state.intentTurn + 1,
  };

case 'CLEAR_INTENT':
  return {
    ...state,
    activeIntent: null,
    intentTurn: 0,
  };
```

### Update `RESET_CHAT` case to clear intent

Find the existing RESET_CHAT case and confirm it resets to `initialState` (which now includes `activeIntent: null` and `intentTurn: 0`). It should already do this since it spreads `initialState`:

```js
case 'RESET_CHAT':
  return { ...initialState, language: state.language, persona: state.persona };
```

This is correct — no change needed here.

### ✅ Test After Step 2

Open React DevTools. Confirm `activeIntent: null` and `intentTurn: 0` appear in the ChatContext state. No visual changes to the app expected.

---

## STEP 3 — Fix Pill Tagging

This step has two parts: (A) update the pill click handlers so they dispatch `SET_INTENT`, and (B) update `ActionPills.jsx` to handle object-format pills.

### Part A — LandingScreen.jsx

**File:** `src/components/LandingScreen/LandingScreen.jsx`

The personalized pills in the landing screen come from `getPersonaPills()` which builds them from `persona.suggestedActions`. Each suggestedAction already has an `action` field. We need to carry that through to the click handler.

**Find the `getPersonaPills` function and update it** to include the `action` field in the returned objects:

```js
// BEFORE
function getPersonaPills(persona, lang) {
  const es = lang === 'es';
  const suggested = (persona.suggestedActions || []).map((a) => ({
    label: es && a.labelEs ? a.labelEs : a.label,
    prompt: a.label,
  }));
  // ...
}

// AFTER
function getPersonaPills(persona, lang) {
  const es = lang === 'es';
  const suggested = (persona.suggestedActions || []).map((a) => ({
    label: es && a.labelEs ? a.labelEs : a.label,
    prompt: a.label,
    intent: a.action,    // ← ADD THIS — carry the action field as intent
  }));
  // ...
}
```

**Update EXTRA_PILLS** to include intent fields. Find the `EXTRA_PILLS` object and add `intent` to each pill entry. Example for the `refill` category (apply same pattern to all categories):

```js
const EXTRA_PILLS = {
  refill: [
    { label: 'Why does this keep happening?', labelEs: '...', prompt: '...', intent: 'diagnose_usage'  },
    { label: 'What are my options?',           labelEs: '...', prompt: '...', intent: 'show_options'   },
    { label: 'I need more hotspot',            labelEs: '...', prompt: '...', intent: 'hotspot_inquiry'},
    { label: 'Talk to someone',                labelEs: '...', prompt: '...', intent: 'talk_to_agent'  },
    { label: 'Show me everything',             labelEs: '...', prompt: '...', intent: 'browse_all'     },
  ],
  // repeat for all other categories — add intent to each pill
};
```

**Update BROWSE_PILLS** to include intent fields:

```js
const BROWSE_PILLS = [
  { label: 'Show me all plans',         prompt: 'Show me all available plans.',           intent: 'browse_plans'   },
  { label: 'Show me the latest phones', prompt: 'Show me the latest phones available.',   intent: 'browse_phones'  },
  { label: 'Show me current deals',     prompt: 'Show me all current deals and promotions.', intent: 'browse_deals'  },
  { label: 'My rewards & points',       prompt: 'Tell me about my rewards points...',     intent: 'browse_rewards' },
];
```

**Update the pill click handlers** in the JSX — both the personalized pills section and the browse pills section. Add `dispatch(SET_INTENT)` before `startChat`:

```jsx
// PERSONALIZED PILLS — find onClick handler and update:
onClick={() => {
  if (pill.intent) dispatch({ type: 'SET_INTENT', payload: pill.intent });
  startChat(pill.prompt);
}}

// BROWSE PILLS — find onClick handler and update:
onClick={() => {
  if (pill.intent) dispatch({ type: 'SET_INTENT', payload: pill.intent });
  startChat(pill.prompt);
}}
```

**Update AlertCardGrid CTA handler.** Find `handleSignalAction` or the equivalent and make the `onCta` call dispatch intent before starting chat. The AlertCard's CTA uses the suggestedAction label as prompt — derive the intent from the action:

```js
// In AlertCardGrid (AlertCard.jsx), the getCtaForSignal function:
function getCtaForSignal(sig) {
  const actions = persona?.suggestedActions || [];
  if (sig.severity === 'critical') {
    const a = actions[0];
    return { label: a?.label || 'Act Now', prompt: a?.label || 'I need help', intent: a?.action || null };
  }
  if (sig.severity === 'warning') {
    const a = actions[1] || actions[0];
    return { label: a?.label || 'Show Options', prompt: a?.label || 'What are my options?', intent: a?.action || null };
  }
  return { label: 'Tell Me More', prompt: sig.headline, intent: 'info_inquiry' };
}

// AlertCardGrid onCta call — update to pass intent:
onCta={() => onCta?.(cta.prompt, cta.intent)}
```

Then in `LandingScreen.jsx` where `AlertCardGrid` is used, update the `onCta` handler:

```js
// BEFORE
<AlertCardGrid
  signals={state.persona?.signals || []}
  persona={state.persona}
  onCta={(prompt) => startChat(prompt)}
/>

// AFTER
<AlertCardGrid
  signals={state.persona?.signals || []}
  persona={state.persona}
  onCta={(prompt, intent) => {
    if (intent) dispatch({ type: 'SET_INTENT', payload: intent });
    startChat(prompt);
  }}
/>
```

### Part B — ActionPills.jsx

**File:** `src/components/ActionPills/ActionPills.jsx`

The mid-conversation pills (from AI responses) arrive as an array. They will now be arrays of objects `{ label, intent }` instead of plain strings.

**Update `ActionPills.jsx`** to handle both formats (backward compatible):

```jsx
import Pill from '../ui/Pill/Pill';
import { useChat } from '../../context/ChatContext';
import styles from './ActionPills.module.css';

export default function ActionPills({ pills, onSelect }) {
  const { dispatch } = useChat();
  if (!pills || pills.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      {pills.map((pill, i) => {
        // Support both string format (legacy) and object format (new)
        const label  = typeof pill === 'string' ? pill : pill.label;
        const intent = typeof pill === 'string' ? null  : pill.intent;

        return (
          <Pill
            key={i}
            onClick={() => {
              if (intent) dispatch({ type: 'SET_INTENT', payload: intent });
              onSelect(label);
            }}
          >
            {label}
          </Pill>
        );
      })}
    </div>
  );
}
```

### Part C — Update useChat.js to dispatch INCREMENT_INTENT_TURN

**File:** `src/hooks/useChat.js`

After the AI response is added to messages, increment the intent turn counter. Find the line where the assistant message is dispatched and add the increment after it:

```js
dispatch({
  type: 'ADD_MESSAGE',
  payload: { role: 'assistant', content: message, ... }
});
dispatch({ type: 'INCREMENT_INTENT_TURN' });   // ← ADD THIS
```

Also, dispatch `INCREMENT_INTENT_TURN` after the user message is added:

```js
// After: dispatch({ type: 'ADD_MESSAGE', payload: userMsg });
dispatch({ type: 'INCREMENT_INTENT_TURN' });   // ← ADD THIS
```

Wait — actually, the cleanest approach is: `intentTurn` represents the number of full user-message/AI-response cycles completed within the current intent. So increment it only once per round-trip. Increment AFTER the AI response is dispatched:

```js
// At the END of the try block, after dispatching ADD_MESSAGE for assistant:
dispatch({ type: 'INCREMENT_INTENT_TURN' });
```

### ✅ Test After Step 3

Open React DevTools. Click a personalized pill (e.g. "Why am I running out?"). Confirm:
- `activeIntent` in ChatContext state changes to `"diagnose_usage"`
- `intentTurn` increments with each exchange
- Click a different pill — confirm `activeIntent` updates and `intentTurn` resets to 0

---

## STEP 4 — Rewrite the Routing Logic in demoResponses.js

**File:** `src/utils/demoResponses.js`

This is the largest change. The goal is to replace keyword-based first-message routing with `activeIntent`-based routing for all personas. We also fix the Explore pill detection bug.

### 4.0 — Update `generateDemoResponse` Signature

Change the function signature to accept `activeIntent` and `intentTurn`:

```js
// BEFORE
export function generateDemoResponse(messages, persona) {

// AFTER
export function generateDemoResponse(messages, persona, activeIntent, intentTurn) {
```

### 4.1 — Update the `msg` Helper for Object Pills

The `msg` helper builds responses with ACTION_PILLS. Update it to accept both string arrays and object arrays (no change needed to JSON serialization — `JSON.stringify` handles objects):

```js
// No change needed — JSON.stringify already handles arrays of objects.
// Just make sure all pill arrays in this file are updated to object format (see 4.3).
```

### 4.2 — Fix the Explore Pill Detection (Simple Fix)

The current `isPlanBrowse` and `isPhoneBrowse` checks use substring matching that fails for the actual pill prompts. Since we now have explicit intent from Step 3, these checks are no longer needed for pill-originated messages. However, keep them as a fallback for free-text. Fix the matching to be more inclusive:

```js
// BEFORE (broken substring matching)
const isPlanBrowse = lowerFirst.includes('view plan') || lowerFirst.includes('show me plan') ||
  lowerFirst.includes('compare plan') || lowerFirst.includes('what plan') ||
  lowerFirst.includes('all plan') || lowerFirst === 'plans';

// AFTER (intent-first, with improved text fallback)
// Check activeIntent first — if set, trust it over text
if (activeIntent === 'browse_plans' || activeIntent === 'browse_phones' ||
    activeIntent === 'browse_deals' || activeIntent === 'browse_rewards') {
  return handleBrowseIntent(activeIntent, persona);
}
// Text fallback (improved matching for free text)
const isPlanBrowse = lowerFirst.includes('plan') || lowerFirst === 'plans' || lowerFirst.includes('view plan');
const isPhoneBrowse = lowerFirst.includes('phone') || lowerFirst.includes('device');
```

Add this `handleBrowseIntent` helper function:

```js
function handleBrowseIntent(intent, persona) {
  const a = persona?.account;
  switch (intent) {
    case 'browse_plans': {
      const intro = a?.plan
        ? `You're currently on ${a.plan} at ${a.planPrice}. Here are all available plans:`
        : `Here are all available plans:`;
      return `${intro}\n[RECOMMENDATIONS]${JSON.stringify([
        { type: 'plan', id: 'base-5g',         reason: 'Most affordable — 5 GB of 5G data at $20/mo. No contract, no surprises.', isBest: true  },
        { type: 'plan', id: '5g-unlimited',     reason: 'Unlimited data with no caps. Includes 15 GB hotspot and Disney+ Basic.',   isBest: false },
        { type: 'plan', id: '5g-plus-unlimited',reason: 'Our top tier — premium 5G speeds, 25 GB hotspot, and Disney+ Premium.',   isBest: false },
      ])}[/RECOMMENDATIONS]`;
    }
    case 'browse_phones': {
      const intro = a?.device
        ? `You're currently using a ${a.device}. Here are phones that would be an upgrade:`
        : `Here are our available phones:`;
      return `${intro}\n[RECOMMENDATIONS]${JSON.stringify([
        { type: 'phone', id: 'samsung-galaxy-a17-5g', reason: 'Best value — free with activation. 5G capable, long battery life.', isBest: true  },
        { type: 'phone', id: 'moto-g-stylus-2025',    reason: 'Great all-rounder — built-in stylus, sharp display, $49 after deal.', isBest: false },
        { type: 'phone', id: 'google-pixel-10a',       reason: 'Best camera in the lineup — Google AI photography and pure Android.', isBest: false },
      ])}[/RECOMMENDATIONS]`;
    }
    case 'browse_deals':
      return msg(
        `Here are the current deals available to you:`,
        [
          { label: 'Free Galaxy A36 with activation', intent: 'deal_galaxy'   },
          { label: 'iPhone 17e — $0 down + plan',     intent: 'deal_iphone'   },
          { label: 'Home Internet — first month free', intent: 'deal_internet' },
          { label: 'See all deals',                    intent: 'browse_all'    },
        ]
      );
    case 'browse_rewards': {
      const pts = a?.rewardsPoints || 0;
      const expiring = a?.rewardsExpiring || 0;
      return msg(
        `You have ${pts} Rewards Points on your account.${expiring ? ` ${expiring} pts are expiring in ${a.rewardsExpiringDays} days.` : ''}\n\nYou can use your points for data add-ons, calling cards, or device discounts. Want to see what you can redeem right now?`,
        [
          { label: 'What can I redeem?',      intent: 'rewards_redeem'  },
          { label: 'Add 5 GB free (1,000 pts)', intent: 'quick_refill'  },
          { label: 'Not right now',            intent: 'cancel'          },
        ]
      );
    }
    default:
      return null;
  }
}
```

### 4.3 — Rewrite `getMariaTurnResponse`

Replace the entire `getMariaTurnResponse` function with the new intent-based version. The function signature changes to accept `activeIntent` and `intentTurn`.

**The old function used:**
- `first` = userMsgs[0] → path determination
- `prev` = userMsgs[turn-2] → previous user message
- `latest` = userMsgs[turn-1] → current user message
- `turn` = total user messages

**The new function uses:**
- `activeIntent` → which flow to run
- `intentTurn` → how many exchanges have happened in this intent (0 = first response)
- `latest` = last user message → for branching within a flow
- Persona account data → for personalizing copy

```js
function getMariaTurnResponse(userMsgs, intentTurn, activeIntent) {
  const a = /* persona account — pass as parameter */;
  const latest = (userMsgs[userMsgs.length - 1]?.content || '').toLowerCase();

  switch (activeIntent) {

    // ── DIAGNOSE USAGE FLOW ─────────────────────────────
    case 'diagnose_usage':
      return getMariaDiagnoseResponse(latest, intentTurn, a);

    // ── QUICK REFILL FLOW ───────────────────────────────
    case 'quick_refill':
      return getMariaRefillResponse(latest, intentTurn, a);

    // ── ADD DATA FLOW ───────────────────────────────────
    case 'add_data':
      return getMariaAddDataResponse(latest, intentTurn, a);

    // ── PLAN CHANGE FLOW ────────────────────────────────
    case 'plan_change':
      return getMariaPlanResponse(latest, intentTurn, a);

    // ── UPGRADE INTENT (from mid-flow pivots) ──────────
    case 'upgrade_now':
      return msg(
        `Switching you to Total 5G Unlimited now.\n\n┌─────────────────────────────────────────────┐\n│  Total 5G Unlimited                         │\n│  $55/mo  (was $40/mo)                       │\n│  Prorated today: ~$7.14 (14 days left)      │\n│  Charged to: ${a.savedCard}                 │\n└─────────────────────────────────────────────┘\n\nConfirm?`,
        [
          { label: 'Yes — upgrade now',     intent: 'confirm_refill'   },
          { label: 'Switch at renewal instead', intent: 'upgrade_at_renewal' },
          { label: 'Cancel',                intent: 'cancel'            },
        ]
      );

    case 'upgrade_at_renewal':
      return msg(
        `Done — your upgrade to Total 5G Unlimited is scheduled for ${a.renewalDate}. Nothing to pay today.\n\nWant me to add 5 GB now to cover you until then?`,
        [
          { label: 'Yes — add 5 GB for $15', intent: 'quick_refill' },
          { label: "I'll manage",             intent: 'done'          },
        ]
      );

    case 'keep_plan':
      return msg(
        `No problem. You're staying on Total Base 5G. If you need data before ${a.renewalDate}, come back and I can add it in seconds.\n\nAnything else I can help with?`,
        [
          { label: 'Add data now — $15', intent: 'quick_refill' },
          { label: 'Go back home',       intent: 'done'          },
        ]
      );

    case 'confirm_refill':
      return `Confirming now.\n[REFILL_FLOW]`;

    case 'cancel':
      return msg(
        `No problem. Is there anything else I can help you with?`,
        [
          { label: 'Why am I running out?', intent: 'diagnose_usage' },
          { label: 'Quick Refill — $15',   intent: 'quick_refill'   },
          { label: 'Go back home',          intent: 'done'           },
        ]
      );

    case 'try_free_fixes':
      return msg(
        `Great call. Here's a recap of the three fixes to try:\n\n1. Settings → turn off "Wi-Fi Assist"\n2. YouTube/Netflix → set to "Wi-Fi only"\n3. Settings → General → Background App Refresh → off\n\nIf you run out before ${a.renewalDate}, come back and I can add data instantly.\n\nAnything else?`,
        [
          { label: 'Add data anyway — $15', intent: 'quick_refill' },
          { label: 'Go back home',           intent: 'done'          },
        ]
      );

    case 'done':
      return msg(
        `You're all set. Come back any time!\n\nIs there anything else before you go?`,
        [
          { label: 'One more thing',  intent: 'show_options' },
          { label: 'Go back home',   intent: 'reset'        },
        ]
      );

    default:
      return null;
  }
}

// ── DIAGNOSIS SUB-FLOW ───────────────────────────────────────────────
function getMariaDiagnoseResponse(latest, intentTurn, a) {
  // intentTurn 0: First response — show diagnosis intro
  if (intentTurn === 0) {
    return msg(
      `We can see you're mostly on cellular — only ${a.wifiUsagePercent}% of your usage goes through Wi-Fi. Let's see if there's a free fix first.`,
      [
        { label: "Let's do it",              intent: 'diagnose_confirm' },
        { label: 'Skip — add 5 GB for $15', intent: 'quick_refill'    },
        { label: 'Skip — change my plan',   intent: 'plan_change'     },
      ]
    );
  }

  // intentTurn 1: User clicked "Let's do it" (diagnose_confirm sets intent back to diagnose_usage)
  // Ask Wi-Fi question
  if (intentTurn === 1) {
    return msg(
      `Are you connected to Wi-Fi when you're at home or at work?`,
      [
        { label: 'Yes, always', intent: 'diag_wifi_always'    },
        { label: 'Sometimes',   intent: 'diag_wifi_sometimes' },
        { label: "I'm not sure", intent: 'diag_wifi_sometimes' },
      ]
    );
  }

  // intentTurn 2+: Ask streaming question
  if (intentTurn === 2) {
    return msg(
      `Do you stream video or music on cellular — not just on Wi-Fi?`,
      [
        { label: 'Yes, often',    intent: 'diag_streams_yes' },
        { label: 'Occasionally',  intent: 'diag_streams_yes' },
        { label: 'Rarely',        intent: 'diag_streams_no'  },
      ]
    );
  }

  // intentTurn 3: Background apps question
  if (intentTurn === 3) {
    const streamingContext = latest.includes('often') || latest.includes('occasionally')
      ? `That can use 1–3 GB per hour on HD.\n\n`
      : '';
    return msg(
      `${streamingContext}Last one: do you have apps set to auto-update or sync in the background on cellular?`,
      [
        { label: 'Probably yes',    intent: 'diag_bg_yes' },
        { label: "I've disabled it", intent: 'diag_bg_no'  },
        { label: 'Not sure',         intent: 'diag_bg_yes' },
      ]
    );
  }

  // intentTurn 4+: Show free fixes
  return msg(
    `Here are three free fixes that could make a real difference:\n\n✅ Turn off "Wi-Fi Assist" in Settings — stops your phone from switching to cellular when Wi-Fi slows down\n✅ Set streaming apps (YouTube, Netflix) to "Wi-Fi only"\n✅ Disable Background App Refresh — Settings → General → Background App Refresh\n\nWant to try these first? If they don't solve it, I can add data or change your plan in seconds.`,
    [
      { label: "I'll try those",       intent: 'try_free_fixes' },
      { label: 'Add data for now — $15', intent: 'quick_refill'  },
      { label: 'Show plan options',     intent: 'plan_change'    },
    ]
  );
}

// ── REFILL SUB-FLOW ──────────────────────────────────────────────────
function getMariaRefillResponse(latest, intentTurn, a) {
  // intentTurn 0: First response for this intent — confirm details
  if (intentTurn === 0) {
    return msg(
      `Want to add 5 GB right now for $15? I'll charge your ${a.savedCard}. Takes about 2 seconds.`,
      [
        { label: 'Yes — do it',        intent: 'confirm_refill' },
        { label: 'Show other options', intent: 'show_options'   },
        { label: 'Cancel',             intent: 'cancel'         },
      ]
    );
  }

  // intentTurn 1+: If user typed free text (not a pill), continue confirmation
  return `Confirming now.\n[REFILL_FLOW]`;
}

// ── ADD DATA ($10) SUB-FLOW ──────────────────────────────────────────
function getMariaAddDataResponse(latest, intentTurn, a) {
  if (intentTurn === 0) {
    return msg(
      `Want to add 5 GB for $10? I'll charge your ${a.savedCard}. Activates instantly.`,
      [
        { label: 'Yes — do it',  intent: 'confirm_refill' },
        { label: 'Cancel',       intent: 'cancel'         },
      ]
    );
  }
  return `Adding 5 GB to your account.\n[REFILL_FLOW]`;
}

// ── PLAN CHANGE SUB-FLOW ─────────────────────────────────────────────
function getMariaPlanResponse(latest, intentTurn, a) {
  if (intentTurn === 0) {
    return msg(
      `Based on your usage, you've needed more than 5 GB almost every month. Here's what would stop this from happening again:\n\n**Total 5G Unlimited** — $55/mo\n✓ Unlimited data (no more running out)\n✓ 10 GB hotspot\n✓ Disney+ included\n✓ Wi-Fi Calling\n\nThat's $15 more than your current plan.\n\nYou could start now — you'd only pay ~$7.14 today (prorated). Or switch at your next renewal on ${a.renewalDate} with no charge today.`,
      [
        { label: 'Start now — ~$7 today',    intent: 'upgrade_now'        },
        { label: `Switch on ${a.renewalDate} — free`, intent: 'upgrade_at_renewal' },
        { label: 'Stay on my current plan',  intent: 'keep_plan'          },
      ]
    );
  }
  // Free text continuation
  return msg(
    `Would you like to upgrade now or wait until your renewal on ${a.renewalDate}?`,
    [
      { label: 'Upgrade now — ~$7 today',  intent: 'upgrade_now'        },
      { label: 'Wait until renewal — free', intent: 'upgrade_at_renewal' },
      { label: 'Never mind',               intent: 'cancel'              },
    ]
  );
}
```

### 4.4 — Update `getMariaTurnResponse` Call Site in `generateDemoResponse`

In the main `generateDemoResponse` function, find where persona handlers are called and update the Maria call:

```js
// BEFORE
case 'us-001': response = getMariaTurnResponse(userMessages, turn); break;

// AFTER
case 'us-001': response = getMariaTurnResponse(userMessages, intentTurn, activeIntent); break;
```

Note: The persona account object `a` needs to be accessible inside `getMariaTurnResponse`. Pass it explicitly or access via `persona.account` inside the function. The cleanest way:

```js
// AFTER (passing persona)
case 'us-001': response = getMariaTurnResponse(userMessages, intentTurn, activeIntent, persona); break;

// Update function signature:
function getMariaTurnResponse(userMsgs, intentTurn, activeIntent, persona) {
  const a = persona?.account || {};
  // ...
}
```

### 4.5 — Update the Turn 1 Opening for Maria

The persona opening response (Turn 1) should also use intent where available. For Maria, any turn-1 message without an intent goes to the generic opening. But pill-originated turn-1 messages already have an intent set (from Step 3), so those route directly to the right sub-flow via `getMariaTurnResponse`.

**Update `generateDemoResponse` to check intent BEFORE checking for persona opening:**

```js
// ADD THIS BLOCK before the existing "Turn 1: Use persona-specific opening" block:

// If activeIntent is set, route to persona handler regardless of turn number
if (activeIntent && persona) {
  let response = null;
  switch (persona.id) {
    case 'us-001': response = getMariaTurnResponse(userMessages, intentTurn, activeIntent, persona); break;
    // ... other personas
  }
  if (response) return response;
}

// Only fall through to generic persona opening if no intent is set (free text entry)
if (turn === 1 && persona) {
  const personaResponse = getPersonaOpeningResponse(persona);
  if (personaResponse) return personaResponse;
}
```

### 4.6 — Free Text Fallback

When a user types free text (no pill, so no SET_INTENT dispatched), `activeIntent` stays whatever it was. The flow continues naturally because the routing still reads `activeIntent`. If `activeIntent` is null (completely fresh conversation with typed text), fall through to the existing keyword-based generic flows — these still work as a last resort for unstructured input.

Add a specific handler for the case where `activeIntent` is null and turn is 1 with free text:

```js
// In generateDemoResponse, for null intent at turn 1:
if (!activeIntent && turn === 1 && persona) {
  // Show persona opening — best guess at user's need
  const personaResponse = getPersonaOpeningResponse(persona);
  if (personaResponse) return personaResponse;
}

// For null intent at turn > 1, show gentle continuation using last AI response context:
if (!activeIntent && turn > 1) {
  return msg(
    `I want to make sure I help with the right thing. Were you looking to:`,
    [
      { label: 'Add data now',          intent: 'quick_refill'   },
      { label: 'Understand my usage',   intent: 'diagnose_usage' },
      { label: 'Change my plan',        intent: 'plan_change'    },
      { label: 'Go back home',          intent: 'done'           },
    ]
  );
}
```

### 4.7 — Update `POST_FLOW_PILLS` to Object Format

```js
// BEFORE
const POST_FLOW_PILLS = ['Ask something else', 'Go back home', "I'm done for now"];

// AFTER
const POST_FLOW_PILLS = [
  { label: 'Ask something else', intent: 'show_options' },
  { label: 'Go back home',       intent: 'done'         },
  { label: "I'm done for now",   intent: 'done'         },
];
```

### 4.8 — Handle `done` and `reset` Intents in `generateDemoResponse`

Add a top-level check for terminal intents that should reset the conversation:

```js
// Near the top of generateDemoResponse, after the return-to-home text check:
if (activeIntent === 'reset' || activeIntent === 'done') {
  // Will be handled by RefillFlow / ChatArea to dispatch RESET_CHAT
  // But if we reach here (user typed something), just give a clean exit
  return msg(
    `You're all set! Come back any time.\n\nIs there anything else before you go?`,
    [
      { label: 'One more thing', intent: 'show_options' },
      { label: 'All done',       intent: 'reset'        },
    ]
  );
}
```

Also update `RefillFlow.jsx` — after the SMS modal is dismissed, the post-flow action buttons should dispatch `CLEAR_INTENT` before resetting:

```js
// In RefillFlow.jsx handleReturnHome():
function handleReturnHome() {
  dispatch({ type: 'CLEAR_INTENT' });
  dispatch({ type: 'RESET_CHAT' });
}
```

### ✅ Test After Step 4 (Per Flow)

Test each entry point from the Maria dashboard and confirm the expected behavior:

| Entry | Expected Turn 1 | Expected Turn 2 |
|-------|----------------|----------------|
| "Why am I running out?" | Diagnosis intro + 3 pills | Wi-Fi question (if "Let's do it") OR RefillFlow (if "Skip — $15") |
| "Quick Refill — $15" | Refill confirmation + card details | RefillFlow (if "Yes — do it") |
| "Add 5 GB of data — $10" | $10 add-on confirmation | RefillFlow (if confirmed) |
| "Change my plan" | Unlimited upgrade card | Upgrade now OR schedule OR keep plan |
| "Show me all plans" | Plans recommendations card | N/A |
| "Show me the latest phones" | Phone recommendations card | N/A |
| "Show me current deals" | Deals list | N/A |
| "My rewards & points" | Rewards balance + redeem option | N/A |

---

## STEP 5 — Apply Same Pattern to Other Personas

Once Maria is fully working, apply the same pattern to each remaining persona handler. The process is the same for each:

1. Define the intent values for that persona's suggestedActions and mid-flow pills
2. Rewrite the persona's turn handler to switch on `activeIntent` instead of `first`
3. Update all pill arrays in that persona's response functions to object format
4. Update the persona's call site in `generateDemoResponse`

### Priority Order for Other Personas

Apply in this order based on demo priority:

1. **us-005 (Angela)** — support/connectivity flow
2. **us-009 (Alex)** — new phone buyer flow
3. Remaining personas as needed

### Shared Pattern Template for Any Persona

Every persona handler should follow this structure:

```js
function get[Name]TurnResponse(userMsgs, intentTurn, activeIntent, persona) {
  const a = persona?.account || {};
  const latest = (userMsgs[userMsgs.length - 1]?.content || '').toLowerCase();

  switch (activeIntent) {
    case '[primary_intent]':
      return get[Name][PrimaryIntent]Response(latest, intentTurn, a);

    case '[secondary_intent]':
      return get[Name][SecondaryIntent]Response(latest, intentTurn, a);

    // ... one case per intent

    case 'cancel':
      return getGenericCancelResponse(persona);  // shared helper

    case 'done':
      return getGenericDoneResponse(persona);     // shared helper

    default:
      return null;
  }
}
```

Create two shared helpers that all personas can use:

```js
function getGenericCancelResponse(persona) {
  return msg(
    `No problem. Is there anything else I can help with?`,
    [
      { label: 'Go back home', intent: 'done' },
      { label: 'Something else', intent: 'show_options' },
    ]
  );
}

function getGenericDoneResponse(persona) {
  return msg(
    `You're all set. Come back any time!`,
    [
      { label: 'Go back home', intent: 'reset' },
      { label: 'One more thing', intent: 'show_options' },
    ]
  );
}
```

---

## Files Changed — Summary

| File | Change Size | Description |
|------|------------|-------------|
| `src/hooks/useChat.js` | Small | Remove API call, pass activeIntent/intentTurn to demo engine, increment intentTurn |
| `src/context/ChatContext.jsx` | Small | Add activeIntent, intentTurn to state; add SET_INTENT, INCREMENT_INTENT_TURN, CLEAR_INTENT actions |
| `src/components/LandingScreen/LandingScreen.jsx` | Medium | Add intent to pill objects, dispatch SET_INTENT on pill click, update AlertCard onCta handler |
| `src/components/ActionPills/ActionPills.jsx` | Small | Handle object-format pills, dispatch SET_INTENT on click |
| `src/components/AlertCard/AlertCard.jsx` | Small | Pass intent through onCta callback |
| `src/components/RefillFlow/RefillFlow.jsx` | Tiny | dispatch CLEAR_INTENT on return home |
| `src/utils/demoResponses.js` | Large | Rewrite routing to use activeIntent, rewrite getMariaTurnResponse, add handleBrowseIntent, update all pill arrays to object format |
| `src/utils/api.js` | None | Do not delete — leave in place but it will no longer be called |
| `src/data/systemPrompt.js` | None | Do not delete — leave in place but it will no longer be called |

---

## What NOT to Change

- Do not modify `RefillFlow.jsx` logic beyond the CLEAR_INTENT addition
- Do not modify `parseResponse.js` — it already handles object arrays in ACTION_PILLS
- Do not modify `RecommendationCard.jsx` or `PhoneOrderFlow.jsx`
- Do not delete `api.js` or `systemPrompt.js` — leave them as dead code for now
- Do not change any CSS, animation, or visual styling
- Do not change the persona data in `personas.js` — the `action` fields are already correct

---

## Definition of Done

All of the following must pass before this implementation is considered complete:

- [ ] Network tab shows zero API calls when using the app
- [ ] Every entry pill for Maria routes to the correct response immediately on turn 1
- [ ] Clicking different pills after Maria's first response routes correctly (not stuck to first-message path)
- [ ] "Show me all plans" Explore pill shows plan recommendations (not Maria low-data opening)
- [ ] "Show me the latest phones" Explore pill shows phone recommendations
- [ ] "My rewards & points" shows rewards balance
- [ ] Quick Refill → Yes → RefillFlow → SMS Modal works end to end
- [ ] After RefillFlow completes, "Go back home" returns to landing screen cleanly
- [ ] activeIntent resets to null after returning home
- [ ] Free-text input during an active flow continues the current intent correctly
- [ ] Language toggle (EN → ES) still works — pills display in Spanish, intent routing uses English action values
