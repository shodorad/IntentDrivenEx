# How the ClearPath AI Chat Works

---

## The Simple Version

When you open the app, you see a landing screen with a greeting and some quick-action pills. The moment you tap a pill or type a message, the chat opens.

From that point on, every message you send follows the same path:

1. **Your message goes in** — the chat shows your bubble on the right
2. **The engine decides what to do** — it figures out what you want
3. **A response comes back** — the AI bubble appears on the left, often with follow-up pill buttons

That decision in step 2 is the entire engine. The rest of this document explains exactly how it works.

---

## The Medium Version — Four Questions

Every time you send a message, the engine asks four questions in order. It stops at the first one that has an answer.

```
1. Are you trying to leave or escalate?
   → "go back home", "talk to someone"  →  handle it immediately

2. Are you already in the middle of a flow?
   → yes  →  keep going inside that flow

3. Do we know what you want (intent)?
   → yes  →  start the right flow

4. Is this your first message with no clear intent?
   → yes  →  show the persona opening (tailored greeting)
   → no   →  ask Claude API as a fallback
```

A **flow** is just a named back-and-forth script for one specific thing a customer might want — like refilling data, troubleshooting signal, or buying a phone. Once a flow starts, it owns the conversation until it finishes.

An **intent** is a label for what the customer wants — `quick_refill`, `diagnose_usage`, `support`, `international`, etc. The engine figures out the intent either from the pill you tapped (direct) or by scanning your message for known phrases (classifier).

---

## The Detailed Version

### File Map

| File | What it does |
|---|---|
| `src/engine/router.js` | The entry point — runs the four-question chain |
| `src/engine/flows/index.js` | Registry that maps every intent key to a flow object |
| `src/engine/flows/*.js` | One file per flow — all the conversation logic |
| `src/engine/personaOpenings.js` | The tailored first-message greeting for each persona |
| `src/engine/utils.js` | Helpers: `msg()`, `step()`, `withEndFlow()` |
| `src/hooks/useChat.js` | React hook — calls the router, dispatches state changes |
| `src/context/ChatContext.jsx` | All chat state lives here (messages, flow position, persona) |
| `src/utils/parseResponse.js` | Strips embedded tags from response strings |
| `src/data/intentMap.js` | Phrase tables used to classify free-text messages |

---

### State Shape

The chat state lives in `ChatContext.jsx`. The fields that drive the engine are:

```js
{
  messages:    [],     // every message in the thread (role + content)
  persona:     {...},  // who is this customer? (account data, urgency, etc.)
  isLoading:   false,

  // Flow position — where are we in the current conversation script?
  flowId:      null,   // e.g. 'quick_refill' | 'support' | null
  stepId:      null,   // e.g. 'asked_restart' | 'confirm_or_cancel' | null
  flowContext: {},     // facts collected during this flow (e.g. { worseIndoors: true })
}
```

`flowId` + `stepId` together say exactly where we are. When a flow ends, both go back to `null`. There is no global turn counter — position is always a named step, never a number.

---

### The Router (`router.js`)

`route()` is called once per user message. It returns a `RouteResult`.

```js
async function route(conversationState, userText, persona, messageHistory, intentHint)
  → RouteResult
```

**RouteResult shape:**
```js
{
  response:     string,      // the full response text (may include embedded tags)
  nextFlowId:   string|null, // flow to start (null = stay in current)
  nextStepId:   string,      // next step within that flow
  contextPatch: object,      // new facts to merge into flowContext
  endFlow:      boolean,     // true = dispatch END_FLOW after rendering
}
```

**The four steps, in order:**

#### Step 1 — Global catches
Certain phrases always get the same response regardless of where the conversation is. These run first, before any flow logic.

```
"go back home" / "start over" / "never mind"  →  endSession()
"talk to someone" / "speak to a person"        →  escalateToLiveChat()
```

If neither matches, continue to step 2.

#### Step 2 — Active flow
If `flowId` is set, the current flow owns the conversation. The router calls:

```js
FLOW_REGISTRY[flowId].step(stepId, userText, flowContext, persona)
```

The flow returns the next response and the next step name. The router returns that result directly — steps 3, 4, and 5 never run.

If the flow returns `null` (it doesn't recognize the input at this step), the router shows a safe fallback instead of crashing.

#### Step 3 — Intent classification
No active flow. Figure out what the user wants.

If `intentHint` is provided (pill was tapped — intent is known exactly), use it directly.
If not, run `classifyIntent(userText)` against the phrase table in `intentMap.js`.

```js
const intent = intentHint ?? classifyIntent(userText);
```

If an intent is found and it has a flow in the registry:
```js
FLOW_REGISTRY[intent].step('start', userText, {}, persona)
```
Returns the first step of that flow, tagging the result with `nextFlowId: intent` so the dispatcher knows to call `START_FLOW`.

Terminal intents (`done`, `reset`) call `endSession()` instead.

#### Step 4 — Persona opening
No intent found. If this is the customer's very first message, show the persona-specific greeting. The greeting references their actual account data — data remaining, renewal date, call history, etc.

```js
if (userMessages.length === 1) return getPersonaOpening(persona);
```

This step only fires for the first message. Later unclassified messages fall through to the API.

#### Step 5 — API fallback
Truly off-script. No flow, no intent, not the first message. Call the Claude API with the persona's system prompt and the full message history. If the API fails, return the generic clarify response with option pills.

---

### Flows (`src/engine/flows/*.js`)

Every flow is an object with one method:

```js
export const MyFlow = {
  step(stepId, userText, ctx, persona) → RouteResult | null
}
```

Rules every flow follows:
- Always has a `'start'` case — the entry point when the flow is first triggered
- Every terminal path sets `endFlow: true` — there are no implied endings
- `default: return null` — the router handles the fallback, not the flow
- No turn counters — position is a named stepId, not a number
- No dispatch calls — flows are pure functions that return data

**How steps advance:**

Each step returns `nextStepId` — the name of the step the *next* message will land in. The dispatcher calls `ADVANCE_FLOW({ stepId: result.nextStepId, contextPatch: result.contextPatch })`. When the next message arrives, the router calls `flow.step(nextStepId, ...)`.

**Collecting context:**

`contextPatch` merges new facts into `flowContext`. This is how a later step can know what a user said two turns ago without scanning the message history.

```js
// Step 'asked_indoor' captures whether signal is worse indoors:
case 'asked_indoor':
  if (lower.includes('worse')) {
    return {
      response: step3IndoorAirplaneMsg(),
      nextStepId:   'asked_airplane_indoor',
      contextPatch: { worseIndoors: true },   // ← saved for later
      endFlow:      false,
    };
  }
```

**Triggering UI components:**

Flows can trigger special UI components (payment processing, live chat widget, SMS modal) by embedding tags in the response string. `parseResponse.js` strips them and passes them to the message object as boolean flags.

```
[REFILL_FLOW]          →  msg.refillFlow = true    →  <RefillFlow /> renders
[LIVE_CHAT_FLOW]       →  msg.liveChatFlow = true  →  <LiveChatFlow /> renders
[UPGRADE_FLOW]         →  msg.upgradeFlow = true   →  <UpgradeFlow /> renders
[PHONE_ORDER_FLOW]{…}  →  msg.phoneOrderFlow = {…} →  <PhoneOrderFlow /> renders
[RECOMMENDATIONS][…]   →  msg.recommendations = […]→  <RecommendationCard /> renders
[ACTION_PILLS][…]      →  msg.actionPills = […]    →  <ActionPills /> renders
```

---

### Flow Registry (`flows/index.js`)

The registry maps every intent key to the flow object that handles it:

```js
export const FLOW_REGISTRY = {
  quick_refill:   QuickRefillFlow,
  diagnose_usage: DiagnoseUsageFlow,
  plan_change:    PlanChangeFlow,
  support:        TroubleshootSignalFlow,
  upgrade_now:    UpgradeFlow,
  browse_plans:   BrowsePlansFlow,
  browse_phones:  BrowsePhonesFlow,
  activate:       ActivationFlow,
  international:  InternationalFlow,

  // Aliases — same flow, different entry labels
  'slow-data':    DiagnoseUsageFlow,
  'runs-out':     DiagnoseUsageFlow,
  cost:           PlanChangeFlow,
  compare:        BrowsePlansFlow,
  byop:           ActivationFlow,
};
```

Adding a new topic = write a new flow file + add one line here. Nothing else changes.

---

### Pill Intent vs. Free Text

Pills and free text take two different paths to intent:

| Source | Path |
|---|---|
| Pill tap | `pill.intent` → passed as `intentHint` → skips classifier entirely |
| Free-text message | `classifyIntent(text)` → weighted phrase matching → returns intent key or null |

This matters because pill labels are written for humans ("Yes — redeem 1,000 pts for free"), not for keyword matching. The classifier would fail on them. `intentHint` bypasses it cleanly.

`classifyIntent()` scores each intent by how many of its known phrases appear in the message. Longer phrase matches win ties (more specific = higher confidence). A single negation phrase blocks an intent entirely.

---

### Persona Openings

The persona opening is the AI's first response when it doesn't know yet what the customer wants. It's personalized — it references real account data, not a generic greeting.

Each of the 10 personas has a dedicated opening in `personaOpenings.js`. The opening is also a `RouteResult` (same shape as a flow step), so it flows through `useChat.js` exactly the same way as any other response.

The persona is resolved from the URL once at app load:
- `?persona=maria` / `?user=1` → us-001 (Maria)
- `?user=5` → us-005 (Angela)
- `?user=7` → us-007 (Ana)
- Falls back to us-001 if nothing matches

---

### `useChat.js` — Wiring the Engine to React

`useChat.js` is the bridge between the router and React state. Its only job is:

```
user input → call route() → dispatch state changes
```

```js
const sendMessage = async (text, intentHint = null) => {
  dispatch ADD_MESSAGE { role: 'user', content: text }
  dispatch SET_LOADING true

  const result = await route(conversationState, text, persona, messageHistory, intentHint)
  const parsed = parseResponse(result.response)   // strip embedded tags

  dispatch ADD_MESSAGE { role: 'assistant', content: parsed.message, ...flowFlags }

  if (result.endFlow)          dispatch END_FLOW
  else if (new flow starting)  dispatch START_FLOW + ADVANCE_FLOW
  else                         dispatch ADVANCE_FLOW (update stepId + merge contextPatch)

  dispatch SET_LOADING false
}
```

`startChat(prompt, intentHint)` — used by landing pills and the input bar when mode is `'landing'`. Switches to chat mode first, then calls `sendMessage`.

`startProactiveChat(signal)` — used by signal cards that open the chat with an AI-first message (no user bubble). The opening is injected directly as an assistant message without going through `sendMessage`.

---

### Complete Message Journey

```
User taps "Check for outages now" (intent: 'support')
            │
            ▼
ActionPills.jsx
  dispatch SET_INTENT('support')         ← legacy, harmless
  onSelect('Check for outages now', 'support')
            │
            ▼
useChat.sendMessage('Check for outages now', 'support')
  dispatch CLEAR_ACTION_PILLS
  dispatch ADD_MESSAGE { role: 'user', content: '...' }
  dispatch SET_LOADING true
            │
            ▼
router.route({ flowId:null, stepId:null }, 'Check for outages now', angela, history, 'support')
  Step 1 — global catches: no match
  Step 2 — active flow: flowId is null, skip
  Step 3 — intentHint = 'support' → FLOW_REGISTRY['support'].step('start', ...)
    → returns { response: 'Network check complete...', nextStepId: 'asked_restart', endFlow: false }
    → tags with nextFlowId: 'support'
            │
            ▼
useChat processes RouteResult
  parsed = parseResponse(result.response)
  dispatch ADD_MESSAGE { role: 'assistant', content: 'Network check complete...' }
  dispatch START_FLOW { flowId: 'support' }
  dispatch ADVANCE_FLOW { stepId: 'asked_restart', contextPatch: {} }
  dispatch SET_LOADING false
            │
            ▼
ChatArea renders
  MessageBubble ← always
  ActionPills   ← pills extracted from response
            │
            ▼ (user sends next message "Restarted, problem's still there")

router.route({ flowId: 'support', stepId: 'asked_restart' }, 'Restarted...', angela, history)
  Step 1 — global catches: no match
  Step 2 — active flow: TroubleshootSignalFlow.step('asked_restart', 'Restarted...')
    → matches "Restarted, problem's still there" → returns step 2 (indoor question)
    → nextStepId: 'asked_indoor'
            │
  ... continues until escalating step ...
            │
User taps "Schedule a callback"
  TroubleshootSignalFlow.step('escalating', 'Schedule a callback', ...)
    → lower.includes('callback') → returns callback confirmation
    → endFlow: true
            │
  dispatch ADD_MESSAGE { content: 'Done — a network specialist will call...' }
  dispatch END_FLOW   ← flowId → null, stepId → null, flowContext → {}
```

---

### What Cannot Break

The architecture has a few hard guarantees:

| Old bug | Why it cannot happen now |
|---|---|
| Flow keeps running after it should end | `endFlow: true` dispatches `END_FLOW`. Router checks `flowId` is set before routing to a flow. |
| Stale intent poisons later turns | No `activeIntent`. `flowId`/`stepId` only change when `ADVANCE_FLOW` or `END_FLOW` is dispatched. |
| Turn counter drifts from actual position | No turn counter. `stepId` is the position — always named, never a number. |
| Adding a new persona breaks existing ones | Each flow is isolated. The registry is append-only. |
| Pill routes to wrong place after mid-flow tap | `intentHint` starts the new flow at `'start'`. `END_FLOW` clears old position first. |
