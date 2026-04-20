# ClearPath AI — Chat Workflow Documentation

This file documents how the chat system works end-to-end.
Claude Code should read this before making any changes to chat-related components.

---

## Architecture Overview

The chat system is a **pure client-side state machine** — no live AI backend.
All AI responses come from a large deterministic function (`generateDemoResponse`).
The app has two modes: `landing` and `chatting`, controlled by a single React context.

---

## File Map (Chat-Critical Files)

| File | Role |
|------|------|
| `src/context/ChatContext.jsx` | Single source of truth — all chat state lives here |
| `src/hooks/useChat.js` | Orchestrates the message dispatch pipeline |
| `src/utils/demoResponses.js` | Generates all AI responses (1,691 lines, fully deterministic) |
| `src/utils/parseResponse.js` | Strips embedded tags from raw response strings |
| `src/components/ChatArea/ChatArea.jsx` | Renders the message stream |
| `src/components/MessageBubble/MessageBubble.jsx` | Rich text renderer for individual messages |
| `src/components/ActionPills/ActionPills.jsx` | Quick-reply pill buttons |
| `src/components/RefillFlow/RefillFlow.jsx` | 4-step inline refill transaction card |
| `src/components/PhoneOrderFlow/PhoneOrderFlow.jsx` | Phone order confirmation card |
| `src/components/LiveChatFlow/LiveChatFlow.jsx` | Simulated live agent chat card |
| `src/components/RecommendationCard/RecommendationCard.jsx` | Plan/phone/human recommendation cards |
| `src/components/IPhoneSMSModal/IPhoneSMSModal.jsx` | iPhone SMS confirmation modal (global) |
| `src/components/LandingScreen/LandingScreen.jsx` | Landing mode — pills, signal alerts |
| `src/components/InputBar/InputBar.jsx` | Fixed bottom text input |
| `src/data/personas.js` | 10 persona definitions (us-001 through us-010) |
| `src/i18n/translations.js` | EN/ES UI string translations |
| `src/i18n/useTranslation.js` | Hook that returns the `t(key)` resolver |

---

## State Shape (`ChatContext.jsx`)

```js
{
  mode: 'landing' | 'chatting',
  messages: [
    {
      role: 'user' | 'assistant',
      content: string,
      // assistant messages only — all optional:
      actionPills: [{ label, intent }] | null,
      recommendations: [{ type, id, reason, isBest }] | null,
      refillFlow: boolean,
      liveChatFlow: boolean,
      phoneOrderFlow: { item, price, free } | null,
      // forward-reserved (not yet emitted by parseResponse):
      upgradeFlow, internationalFlow, activationFlow, byopFlow
    }
  ],
  isLoading: boolean,
  showTransparencyPanel: boolean,
  language: 'en' | 'es',
  signalBanner: object | null,
  showSMSModal: boolean,
  smsModalData: { transactionType: 'refill'|'upgrade'|'international'|'phone'|'activation', txItem?: string },
  persona: PersonaObject,   // resolved from URL on init
  inputFocused: boolean,
  activeIntent: string | null,   // e.g. 'quick_refill', 'diagnose_usage'
  intentTurn: number,            // zero-indexed turn counter per intent
}
```

### Reducer Actions

| Action | Effect |
|--------|--------|
| `START_CHAT` | `mode → 'chatting'`, clears messages |
| `ADD_MESSAGE` | Appends `{ role, content, ...flowFlags }` to messages |
| `SET_LOADING` | Toggles `isLoading` |
| `RESET_CHAT` | Returns to initialState, preserves `language` and `persona` |
| `SET_PERSONA` | Replaces persona, clears `signalBanner` |
| `SET_LANGUAGE` | Switches `'en'` / `'es'` |
| `SET_SIGNAL_BANNER` / `CLEAR_SIGNAL_BANNER` | Manages signal banner object |
| `SHOW_SMS_MODAL` / `HIDE_SMS_MODAL` | Opens/closes IPhoneSMSModal with `smsModalData` |
| `TOGGLE_TRANSPARENCY` / `CLOSE_TRANSPARENCY` | Manages the side drawer |
| `SET_INPUT_FOCUSED` | Tracks textarea focus (shows pill grid when true) |
| `CLEAR_ACTION_PILLS` | Removes `actionPills` from the last assistant message |
| `SET_INTENT` | Sets `activeIntent`, resets `intentTurn: 0` |
| `INCREMENT_INTENT_TURN` | Increments `intentTurn` after each AI response |
| `CLEAR_INTENT` | Nulls `activeIntent`, resets `intentTurn: 0` |

**Init:** `persona` is resolved via `getPersonaFromURL()` at module load time (before React renders).
Falls back to `us-001` (Maria) if no URL param matches.

---

## The Core Dispatch Pipeline (`useChat.js`)

### `sendMessage(text, intentOverride = null)`

```
1. dispatch CLEAR_ACTION_PILLS          — removes pills from previous assistant msg
2. dispatch ADD_MESSAGE { role:'user', content:text }
3. dispatch SET_LOADING: true
4. build apiMessages = all messages + new userMsg (role/content only)
5. resolve intent:  intentOverride ?? state.activeIntent
6. resolve turn:    intentOverride set → 0, else state.intentTurn
7. rawString = generateDemoResponse(apiMessages, persona, resolvedIntent, resolvedTurn)
8. parsed = parseResponse(rawString)
   → { message, actionPills, recommendations, refillFlow, liveChatFlow, phoneOrderFlow }
9. [E4 GUARD] count user messages — if first user msg AND response has recommendations
   or flow triggers → suppress them (log warning, still send the text message)
10. dispatch ADD_MESSAGE { role:'assistant', content:parsed.message, ...parsed flags }
11. dispatch INCREMENT_INTENT_TURN
12. dispatch SET_LOADING: false
```

### `startChat(intentPrompt, intentOverride = null)`

```
1. dispatch START_CHAT     — switches mode to 'chatting', clears messages
2. wait 100ms              — lets ChatArea mount before messages arrive
3. sendMessage(intentPrompt, intentOverride)
```

### `resetChat()`

```
dispatch RESET_CHAT
```

---

## Critical Design Rules

### E4 Guard — Clarifying question before any recommendation
**Location:** `useChat.js` (lines 33–39)

On the **first user message** of any conversation, all recommendation cards and all
transaction flow triggers (`refillFlow`, `phoneOrderFlow`, etc.) are suppressed,
even if `generateDemoResponse` returns them.
This guarantees at least one clarifying turn before any purchase CTA appears.

### Intent Threading — `intentTurn` is per-intent, not per-conversation
`intentTurn` resets to 0 whenever `SET_INTENT` is dispatched.
Each intent sub-flow (e.g. `quick_refill`, `diagnose_usage`) has its own zero-indexed
turn counter that the per-persona handler functions in `demoResponses.js` use to
advance through scripted question/answer steps.

### `intentOverride` Closure Fix — Why both `SET_INTENT` and `intentOverride` exist
React state updates are async — when a pill is clicked, `SET_INTENT` is dispatched but
`state.activeIntent` inside the `sendMessage` closure still holds the old value.
`intentOverride` bypasses the stale closure by passing the intent value directly
through the call stack. Always pass both.

### `CLEAR_ACTION_PILLS` — Only the latest message has pills
Dispatched before every `sendMessage`. Ensures pills from previous assistant messages
are removed so only the most recent response shows clickable pills.

### Landing pills — `label` vs `prompt` split
Each landing pill carries:
- `label` — display text, may be in ES if language is `'es'`
- `prompt` — English text actually sent as the user message

This ensures `generateDemoResponse` receives English regardless of UI language,
since the response engine's keyword matching is English-only.

---

## Response Generation (`demoResponses.js`)

### Entry Point
```js
generateDemoResponse(messages, persona, activeIntent, intentTurn) → rawString
```

### Decision Tree (in execution order)

1. **Global catch-alls** — "return to home", "that's all", "never mind" → wrap-up pills
2. **us-009 fast-path** — Alex always routes through `getAlexPhoneTurnResponse`
3. **Browse intents** — `browse_plans`, `browse_phones`, `browse_deals`, `browse_rewards` → `handleBrowseIntent()`
4. **Terminal intents** — `done` or `reset` → `getGenericDoneResponse()`
5. **Browse navigation at turn >1** — nav pill text matching → direct outputs
6. **Diagnose action detection (turn 1, no activeIntent)** — `isDiagnoseAction()` checks if message exactly matches a `suggestedAction.label` with `action: 'diagnose_usage'`
7. **Plan/phone browse detection at turn 1**
8. **Intent-first routing (us-001, us-005)** — if `activeIntent` set, route to persona intent handler before generic routing
9. **Free-text fallback (turn >1, no intent)** — `getGenericClarifyResponse()`
10. **Turn 1 persona opening** — `getPersonaOpeningResponse(persona)`
11. **Turn >1 persona routing** — 10-way switch on `persona.id`
12. **Generic flow** — `getFlowKey(firstMessage)` classifies into topic, advances through `FLOWS[]` steps
13. **Recommendation output** — after all `FLOWS[]` steps exhausted, returns `RECOMMENDATIONS[]`

### Per-Persona Handlers
Each persona has a dedicated multi-turn handler:

| Persona | Handler | Flow Pattern |
|---------|---------|--------------|
| us-001 (Maria) | `getMariaTurnResponse` | Intent-aware sub-flows: diagnose, refill, add-data, plan |
| us-002 (Carlos) | `getCarlosTurnResponse` | Turn-based keyword matching |
| us-003 (Priya) | `getPriyaTurnResponse` | Rewards redemption flow |
| us-004 (James) | `getJamesTurnResponse` | eSIM activation flow |
| us-005 (Angela) | `getAngelaTurnResponse` | 7-turn support/diagnostic flow |
| us-006 (Derek) | `getDerekTurnResponse` | 3 parallel paths: diagnose/upgrade/addData/renewal |
| us-007 (Ana) | `getAnaTurnResponse` | International calling card flow |
| us-008 (Robert) | `getRobertTurnResponse` | Family plan comparison flow |
| us-009 (Alex) | `getAlexPhoneTurnResponse` | Phone purchase with `[RECOMMENDATIONS]` + `[PHONE_ORDER_FLOW]` |
| us-010 (Nina) | `getNinaTurnResponse` | New activation flow |

### Response Encoding — Embedded Tag Format
All responses are plain strings. Structured data is embedded as tags:

```
[ACTION_PILLS][ {"label":"...", "intent":"..."}, ... ][/ACTION_PILLS]

[RECOMMENDATIONS][ {"type":"plan|phone|human","id":"...","reason":"...","isBest":bool} ][/RECOMMENDATIONS]
(also singular: [RECOMMENDATION] ... [/RECOMMENDATION])

[REFILL_FLOW]
(inline boolean flag — no payload)

[LIVE_CHAT_FLOW]
(inline boolean flag — no payload)

[PHONE_ORDER_FLOW]{"item":"...","price":"...","free":bool}[/PHONE_ORDER_FLOW]
```

---

## Response Parsing (`parseResponse.js`)

Strips all embedded tags and returns:
```js
{
  message,        // clean text
  actionPills,    // JSON array or null
  recommendations,// JSON array (normalized from singular or plural tag) or null
  refillFlow,     // boolean
  liveChatFlow,   // boolean
  phoneOrderFlow, // JSON object or null
}
```

Note: `upgradeFlow`, `internationalFlow`, `activationFlow`, `byopFlow` are destructured
in `useChat.js` but `parseResponse.js` does not emit them — they are forward-reserved
scaffolding and will always be `undefined`.

---

## UI Rendering (`ChatArea.jsx`)

For each message in `state.messages`, renders:

```
<div className="messageGroup">
  <MessageBubble role={msg.role} content={msg.content} />
  {msg.refillFlow      && <RefillFlow />}
  {msg.liveChatFlow    && <LiveChatFlow />}
  {msg.phoneOrderFlow  && <PhoneOrderFlow orderData={msg.phoneOrderFlow} />}
  {msg.recommendations && <RecommendationCard recommendations={...} />}
  {msg.actionPills     && <ActionPills pills={msg.actionPills} onSelect={handlePillSelect} />}
</div>
```

Auto-scrolls to bottom on every message change via `useEffect` + `bottomRef`.

Persistent escape hatch always rendered at bottom: "Need a real person? Call 1-866-663-3633"

---

## MessageBubble Rich Text Rendering (`MessageBubble.jsx`)

AI messages are split by `\n\n` into paragraphs. Each paragraph is rendered as:

| Pattern | Rendered As |
|---------|-------------|
| Lines starting with `✅ title — description` | Ordered step timeline with numbered circles |
| Lines starting with `📊 value \| label \| severity` | Stat card grid, color-coded (ok/warn/critical) |
| Line starting with `💡 text` | Teal insight callout box |
| `**Bold**` + bullet lines | Order summary card with key-value rows |
| `Header:` + bullet lines | Section group with subhead |
| Lines starting with `• ` | Unordered list |
| Everything else | Plain paragraph, `**bold**` inline support |

User messages: plain teal right-aligned bubble, no rich rendering.

---

## Transaction Flows

### RefillFlow (`RefillFlow.jsx`) — 4 steps: `select → confirm → processing → success`

```
select:     Shows plan card with "Continue — $15" button
confirm:    Shows confirmation summary with "Confirm & Pay $15"
processing: Auto-advances after 1500ms (spinner)
success:    Triggers SHOW_SMS_MODAL after 2000ms delay
```

Post-SMS-modal dismiss → `showPostFlow` reveals 3 buttons:
- **Return Home** → `CLEAR_INTENT` + `RESET_CHAT`
- **Ask Something Else** → new assistant message with add-on pills
- **Done** → thank-you message, then `CLEAR_INTENT` + `RESET_CHAT` after 3s

### PhoneOrderFlow (`PhoneOrderFlow.jsx`) — 2 steps: `processing → success`

Auto-advances processing → success in 1500ms.
On success, triggers `SHOW_SMS_MODAL` with `transactionType: 'phone'` after 1500ms.

### LiveChatFlow (`LiveChatFlow.jsx`) — 3 phases: `connecting → typing → active`

Auto-advances: 1800ms to typing, 2200ms more to active.
"End chat" button dispatches a new assistant message with follow-up pills.

---

## IPhoneSMSModal (`IPhoneSMSModal.jsx`)

Rendered globally in `App.jsx`. Visible when `state.showSMSModal === true`.
Uses `AnimatePresence` for spring entrance/exit animation.

Message content switches on `state.smsModalData.transactionType`:
- `refill` → "Your $15 data refill is confirmed. 5 GB added. Expires [today+30d]."
- `phone` → order shipped message with phone name
- `upgrade` → plan upgraded message
- `international` → calling card activated
- `activation` → SIM active message

Dismiss: backdrop click or X button → `HIDE_SMS_MODAL`.

---

## Pill System

### ActionPills (`ActionPills.jsx`)
Supports two formats:
- Legacy string: label only, no intent
- Object: `{ label, intent }` → dispatches `SET_INTENT(intent)` before `onSelect`

Click sequence: `SET_INTENT(intent)` → `sendMessage(label, intent)` (intent passed as `intentOverride`)

### Landing Pills (`LandingScreen.jsx`)
Shown only when `state.inputFocused === true` (textarea focused).
Two sections:
- **For You** — first 4 pills from `getPersonaPills(persona, lang)` (persona-specific)
- **Explore** — 4 static `BROWSE_PILLS`

`getPersonaPills` builds up to 8 pills: takes up to 4 from `persona.suggestedActions`,
appends `EXTRA_PILLS[persona.intentCategory]`, slices to 8.

---

## Persona System

### URL Resolution (`personas.js` → `getPersonaFromURL()`)
Called once at module initialization (before React renders). Reads:
- `?persona=` query param
- `?user=` query param
- Last path segment

Alias table: `'maria'` → `'us-001'`, `'1'` or `'user=1'` → `'us-001'`, `'6'` → `'us-006'`, etc.
Falls back to `us-001` if no match.

### Persona Object Shape
```js
{
  id: 'us-001',
  name: 'Maria R.',
  avatar: '...',
  dropdownLabel: '...',
  intentCategory: 'low_data' | 'support' | 'phone' | ...,
  urgency: 'high' | 'upsell' | 'international' | ...,
  account: {
    plan, planPrice, dataRemaining, dataTotal, dataPercent,
    renewalDate, daysUntilRenewal, savedCard, rewardsPoints, ...
  },
  providerKnows: [...],    // documented, not runtime-enforced
  signals: [...],          // alert cards shown on landing
  suggestedActions: [...], // intent pills for "For You" grid
  diagnosisFlow: { enabled, intro, steps[], freeFixSuggestions[], escalationPrompt },
  conversationContext: '...',  // documentation only, not runtime-used
  // some personas have extra fields:
  planComparison, usageHistory, internationalCallsThisMonth, familyLines, ...
}
```

### Runtime Persona Switching
- `UserChip.jsx` dropdown → `SET_PERSONA` + `RESET_CHAT`
- Keyboard shortcuts in `LandingScreen` → keys `1`, `2`, `3` → us-001, us-005, us-009

---

## Translation System

`useTranslation()` hook reads `state.language` from ChatContext.
Returns `t(key)` that resolves dot-notation keys against `translations[lang]`.

Example: `t('refill.selectCta')` → `'Continue — $15'` (EN) or `'Continuar — $15'` (ES)

**What IS translated:** UI chrome — buttons, input placeholder, trust banner, landing headline/subhead, pill labels.

**What is NOT translated:** `demoResponses.js` response strings — all hardcoded English.
ES mode only changes the chrome; the AI conversation stays in English.

---

## Complete Data Flow Diagram

```
User types text or clicks pill
            │
            ▼
InputBar.handleSend          ActionPills.onClick
  mode=landing → startChat     dispatch SET_INTENT(intent)
  mode=chatting → sendMessage  onSelect(label, intent) → sendMessage(label, intent)
            │
            ▼
useChat.sendMessage(text, intentOverride)
  ├─ dispatch CLEAR_ACTION_PILLS
  ├─ dispatch ADD_MESSAGE { role:'user', content:text }
  ├─ dispatch SET_LOADING: true
  ├─ rawString = generateDemoResponse(messages, persona, intent, turn)
  │     └─ 13-step decision tree → per-persona handler → returns tagged string
  ├─ parsed = parseResponse(rawString)
  │     └─ strips tags → { message, actionPills, recommendations, refillFlow, ... }
  ├─ [E4 GUARD: suppress flows on turn 0]
  ├─ dispatch ADD_MESSAGE { role:'assistant', content, ...parsed }
  ├─ dispatch INCREMENT_INTENT_TURN
  └─ dispatch SET_LOADING: false
            │
            ▼
ChatArea renders message stream
  MessageBubble          ← always
  RefillFlow             ← if msg.refillFlow
  LiveChatFlow           ← if msg.liveChatFlow
  PhoneOrderFlow         ← if msg.phoneOrderFlow
  RecommendationCard     ← if msg.recommendations
  ActionPills            ← if msg.actionPills
            │
            ▼ (on RefillFlow/PhoneOrderFlow success)
dispatch SHOW_SMS_MODAL { transactionType }
            │
            ▼
IPhoneSMSModal (global in App.jsx) renders and animates in
User dismisses → dispatch HIDE_SMS_MODAL
            │
            ▼
showPostFlow → Return Home / Ask Something Else / Done
  Return Home / Done → CLEAR_INTENT + RESET_CHAT
```

---

## InputBar Behavior

- Auto-resizing textarea, max 140px height
- Focus/blur dispatches `SET_INPUT_FOCUSED` (blur has 200ms delay so pill clicks register)
- Enter key or send button:
  - `mode === 'landing'` → `startChat(text)` — switches mode, then sends
  - `mode === 'chatting'` → `sendMessage(text)` — sends directly
- Disabled and shows loading indicator while `state.isLoading === true`

---

## Mode Transition Animation (`App.jsx`)

`AnimatePresence` wraps LandingScreen and ChatArea.
- LandingScreen exit: `y: 0 → -48, opacity: 1 → 0` (slides up and fades)
- ChatArea enter: `y: 24 → 0, opacity: 0 → 1` (slides up and fades in)

---

## Adding a New Intent Flow — Checklist

1. Add persona entry in `src/data/personas.js` → `suggestedActions[]` with `{ label, prompt, intent, action }`
2. Add the intent string to the routing logic in `generateDemoResponse` (`demoResponses.js`)
3. Add a per-turn handler function `getMyPersonaMyIntentResponse(messages, intentTurn, persona)`
4. Return properly tagged strings: use `[ACTION_PILLS]`, `[REFILL_FLOW]`, `[RECOMMENDATIONS]` etc.
5. If a new transaction flow type is needed, add a new inline component and flag to `parseResponse.js`, `useChat.js`, and `ChatArea.jsx`
6. Add any new UI strings to `translations.js` under both `en` and `es` keys
7. The E4 guard is automatic — no additional work needed; first turn will always suppress flows

---

## Adding a New SMS Confirmation Type — Checklist

1. Add `transactionType` string to `SHOW_SMS_MODAL` dispatch in the flow component
2. Add a case in `IPhoneSMSModal.jsx` that handles the new `transactionType`
3. Add translation keys if message text needs ES support
