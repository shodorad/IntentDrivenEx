# ClearPath AI — Architecture Deep Dive
*Generated 2026-04-27 via /antivibe*

---

## What This Project Is

ClearPath AI is a **telecom customer support chatbot prototype** built for Total Wireless. A customer logs in, picks a persona (Maria, Angela, Alex…), and the AI assistant helps them with things like data refills, plan changes, phone browsing, troubleshooting, and international calling.

It's a **demo / design validation tool** — not a production app. The goal is to show how an AI chat assistant could handle real telecom use cases in a way that feels transparent, non-pushy, and personalized.

The most interesting engineering challenge here: **how do you make a chat feel smart and context-aware without going full LLM for everything?** This project answers that with a dual-mode architecture.

---

## The Big Picture

```
User types a message
        ↓
  useChat.js hook
        ↓
  router.js (5-step dispatch chain)
        ├── Step 0: LLM mode? → Gemma 4 31B API
        ├── Step 1: Global catches (live chat, go home, start over)
        ├── Step 2: Active flow? → Flow engine handles it
        ├── Step 3: Intent classification → Flow engine
        ├── Step 4: Persona opening (first message only)
        └── Step 5: API fallback → Gemma or static handler
                ↓
        parseResponse() → structured output
                ↓
        ChatContext dispatch → state update
                ↓
        ChatArea renders cards, pills, message bubbles
```

---

## Layer 1: The Router — A 5-Step Dispatch Chain

**File:** [src/engine/router.js](../clearpath-ai/src/engine/router.js)

This is the brain of the app. Every user message runs through exactly one of five sequential steps. The steps are **mutually exclusive** — once one fires, the others are skipped.

```js
export async function route(conversationState, userText, persona, messageHistory, intentHint, chatMode) {
  // Step 0 — LLM mode bypass
  // Step 1 — Global catches
  // Step 2 — Active flow continuation
  // Step 3 — Intent classification → flow start
  // Step 4 — Persona opening (turn 1 only)
  // Step 5 — API fallback
}
```

### Why this pattern?

This is a **Chain of Responsibility** — each handler checks if it owns the message, and if so, responds and stops the chain. It's the same pattern used in Express middleware.

The benefit: each step is independently testable and easy to reason about. You can add a new step (say, a language detection step) without touching the others.

**Alternatives:** a single `if/else if` tree works for small cases but becomes unmaintainable fast. A lookup table works for pure intent routing but can't handle stateful flow continuation.

**When to use this pattern:** whenever you have a fixed priority order of handlers for a single input, and exactly one handler should respond.

---

## Layer 2: Intent Classification — Weighted Phrase Matching

**File:** [src/data/intentMap.js](../clearpath-ai/src/data/intentMap.js)

```js
export function classifyIntent(message) {
  const lower = message.toLowerCase();
  const scores = {};

  for (const [intent, config] of Object.entries(INTENT_MAP)) {
    const blocked = config.negations.some(n => lower.includes(n)); // negation kills the intent
    if (blocked) continue;

    const matched = config.phrases.filter(p => lower.includes(p));
    if (matched.length > 0) {
      scores[intent] = {
        count: matched.length,                              // more matches = higher confidence
        specificity: Math.max(...matched.map(p => p.length)) // longer match = more specific
      };
    }
  }

  // Sort by count desc, then specificity desc
  const ranked = Object.keys(scores).sort((a, b) => { ... });
  return ranked[0] ?? null;
}
```

### What this is doing

It's a **bag-of-phrases classifier** — not ML, not embeddings, just substring matching with a scoring function. It handles:

- **Synonyms** via the phrases array (`'top up'`, `'refill'`, `'add data'` all → `quick_refill`)
- **Negation** via negations array (`"don't need data"` blocks `quick_refill` even if `'data'` appears)
- **Ambiguity** via count + specificity tiebreakers

### Why not use an LLM for this?

Zero API cost. Zero latency. Fully deterministic — the same phrase always maps to the same intent. For a demo, this is the right tradeoff.

**The tradeoff:** phrase matching is brittle. `"show me all the phones"` doesn't match `"show me phones"` because `"all the"` breaks the substring. You have to enumerate every variation you want to handle.

**When to use this approach:** low-latency intent routing for a known, bounded domain. Works well for telecom (finite set of intents) — would break down for open-ended customer support.

### Learning resources
- [Text classification without ML](https://nlp.stanford.edu/IR-book/html/htmledition/naive-bayes-text-classification-1.html) — the theory behind keyword classifiers
- [Named Entity Recognition basics](https://spacy.io/usage/linguistic-features#named-entities) — what comes after keyword matching
- [Rasa NLU](https://rasa.com/docs/rasa/nlu-training-data/) — a real intent classifier if you want to graduate from phrase matching

---

## Layer 3: The Flow Engine — Finite State Machines

**Files:** [src/engine/flows/](../clearpath-ai/src/engine/flows/)

Each "flow" is a **finite state machine (FSM)** — a conversation path with named states. The machine starts at `'start'`, advances step by step, and terminates with `endFlow: true`.

```js
// Structure of every flow
export const DiagnoseUsageFlow = {
  step(stepId, userText, ctx, persona) {
    switch (stepId) {
      case 'start':     return { response: "...", nextStepId: 'asked_wifi',     endFlow: false };
      case 'asked_wifi': return { response: "...", nextStepId: 'asked_streaming', endFlow: false };
      case 'showing_fixes': return { response: "...", nextStepId: 'flow_complete', endFlow: true };
      default: return null;  // null = "I don't know how to handle this"
    }
  }
};
```

### What's a Finite State Machine?

A finite state machine is a model for a system that:
1. Has a fixed set of **states** (e.g., `start`, `asked_wifi`, `showing_fixes`)
2. Transitions between states based on **inputs** (user messages)
3. Is always in exactly **one** state at a time

The conversation state lives in React context (`flowId`, `stepId`, `flowContext`). The router reads current state, calls `flow.step()`, gets a result that says what the next state is.

**Why not just have one big conversation loop?** FSMs make each step independently readable. You can look at `'asked_streaming'` in the diagnose-usage flow and understand exactly what it does without reading everything else.

### Cross-navigation

Browse Phones has a clever pattern — "global catches" run before the `switch`, so phrases like `"show me all"` work regardless of which step you're in:

```js
step(stepId, userText, ctx, persona) {
  const lower = userText.toLowerCase();

  // Cross-nav: runs BEFORE stepId switch
  if (lower.includes('show me all') || lower.includes('all phones')) {
    return { response: showAllPhones(), nextStepId: 'browsing_all', ... };
  }
  if (lower.includes('show me iphone')) { ... }

  switch (stepId) {
    case 'start': ...
    case 'browsing_all': ...
  }
}
```

This is like a **wildcard route** in Express — `/phones/*` catches before the specific routes.

### Learning resources
- [Finite State Machines explained](https://statecharts.dev/) — with visual tools, great intro
- [XState](https://stately.ai/docs/xstate) — the production-grade FSM library for JavaScript
- [Dialogue management in chatbots](https://rasa.com/blog/rasa-dialogue-policies/) — how Rasa approaches this at scale

---

## Layer 4: The Response Tag Protocol

**Files:** [src/engine/utils.js](../clearpath-ai/src/engine/utils.js), [src/utils/parseResponse.js](../clearpath-ai/src/utils/parseResponse.js)

Flow responses are plain strings with **embedded tags** — a mini markup language for signaling UI components:

```
"I'll connect you with our team.\n[LIVE_CHAT_FLOW]"

"Here are your options:\n[RECOMMENDATIONS][{...}][/RECOMMENDATIONS]\n[ACTION_PILLS][{...}][/ACTION_PILLS]"

"Confirming now.\n[REFILL_FLOW]"
```

`parseResponse()` strips these tags and extracts their payloads into a structured object. `ChatArea` then renders the right component for each flag.

### Why tags instead of returning a structured object?

This was an evolutionary choice. The flows were built incrementally — starting with plain strings, adding pills, then recommendation cards, then transaction flows. Tags let you add new UI triggers without changing every flow's return type.

**The tradeoff:** it's fragile. A typo in a tag silently does nothing. If you were starting fresh, returning a typed object from each flow would be cleaner.

### The dual-format parser

`parseResponse()` handles two completely different formats:
- **JSON object** — what Gemma returns in LLM mode `{ message, cards, followUp }`
- **Tag-based string** — what the flow engine returns `"text [TAG]...[/TAG]"`

```js
export function parseResponse(input) {
  if (input && typeof input === 'object')     return parseJsonResponse(input);
  if (typeof input === 'string' && input.startsWith('{')) {
    try { return parseJsonResponse(JSON.parse(input)); } catch {}
  }
  return parseTagResponse(input);
}
```

This is a **strategy pattern** — the same interface, different implementations chosen at runtime based on input type.

---

## Layer 5: The Card Registry

**File:** [src/components/cards/registry.js](../clearpath-ai/src/components/cards/registry.js)

```js
export const CARD_REGISTRY = {
  usage_chart:      UsageChart,
  plan_comparison:  PlanComparison,
  insight:          InsightPanel,
  refill:           RefillFlow,
  phone:            RecommendationCard,
  // ...
};
```

This is a **lookup table (registry pattern)**. In LLM mode, Gemma returns `{ type: "usage_chart", data: {...} }`. ChatArea looks up `CARD_REGISTRY["usage_chart"]` and renders `<UsageChart data={...} />`.

### Why this matters

Without the registry, adding a new card type would require:
1. Adding the card component
2. Adding an `if card.type === 'new_type'` branch in ChatArea
3. Updating the LLM prompt to know about it

With the registry, step 2 disappears. You register it once and it works.

**This is the Open/Closed Principle** — open for extension (add to CARD_REGISTRY), closed for modification (ChatArea doesn't change).

### Learning resources
- [Registry pattern](https://martinfowler.com/eaaCatalog/registry.html) — Martin Fowler's definition
- [Open/Closed Principle](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design#open-closed-principle) — the SOLID principle this implements

---

## Layer 6: Persona-Driven Personalization

**File:** [src/data/personas.js](../clearpath-ai/src/data/personas.js)

Each persona is a detailed data object: account state, signals (proactive alerts), conversation guidance, suggested actions. This object flows through every layer:

```
PERSONAS['us-001']  →  ChatContext.state.persona
                    →  system prompt (injected into Gemma)
                    →  flow files (persona.account.plan, persona.account.rewardsPoints)
                    →  template interpolation ({account.renewalDate})
```

The persona is the **single source of truth** for all personalization. The five conversation rules at the top of `personas.js` are enforced at every layer:

> 1. NEVER ask a question the provider already has the answer to.
> 2. DIAGNOSE BEFORE SELLING.
> 3. ASK PERMISSION before showing any plan card or upsell.
> 4. ALWAYS give the customer an escape hatch.
> 5. SURFACE WHAT YOU KNOW. Lead with the customer's data pattern.

---

## Layer 7: The LLM Integration

**Files:** [api/llmHandler.js](../clearpath-ai/api/llmHandler.js), [src/data/systemPrompt.js](../clearpath-ai/src/data/systemPrompt.js)

In LLM mode, messages go to **Gemma 4 31B** (Google's open model via `@google/genai`). The LLM is instructed to return strict JSON:

```json
{ "message": "...", "cards": [...], "followUp": [...] }
```

The system prompt is a ~185-line document that tells Gemma:
- The customer's full account state
- Conversation rules (diagnose before sell, ask permission, etc.)
- What card type to return for each kind of question
- Layout rules for phone/plan grids
- The full product catalog (plans, phones, deals, add-ons)

### Why inject the full product catalog into the prompt?

Gemma has no access to your database. By injecting `PLANS`, `PHONES`, `ADDONS`, and `DEALS` as JSON strings in the system prompt, the LLM can make informed, accurate recommendations without needing a retrieval step. This is called **prompt stuffing** — it works well when the data fits in the context window.

**The tradeoff:** the system prompt grows with your catalog. At some point you'd need a retrieval-augmented generation (RAG) architecture instead.

### Gemma vs Claude

The project uses Gemma (Google) rather than Claude (Anthropic). Gemma is accessible via Google AI Studio with a free tier, which matters for a demo. The structured JSON output requirement (`responseMimeType: 'application/json'`) is Gemma's constrained decoding feature — it forces valid JSON output at the model level.

### The failure mode

When Gemma returns invalid JSON (or the Google API times out), `JSON.parse()` throws, the backend `catch` block calls `handleStaticChat`, and the conversation degrades to the scripted fallback. This is the bug visible in the screenshots in this session.

### Learning resources
- [Google AI Studio](https://aistudio.google.com/) — where to get a Gemma API key
- [System prompt design](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts) — Anthropic's guide (principles apply to any LLM)
- [RAG architecture](https://www.pinecone.io/learn/retrieval-augmented-generation/) — what comes after prompt stuffing
- [Constrained decoding / structured outputs](https://huggingface.co/docs/transformers/en/main_classes/text_generation#transformers.GenerationConfig.forced_decoder_ids) — how JSON mode works at the model level

---

## The Dual-Mode Architecture at a Glance

| | Static Mode | LLM Mode |
|---|---|---|
| **Router step 0** | Skipped | Takes over, skips all flow logic |
| **Intent classification** | Runs via `classifyIntent()` | Skipped |
| **Flow engine** | Runs deterministic FSMs | Never called |
| **Response format** | Tag-based strings | JSON `{ message, cards, followUp }` |
| **Latency** | ~0ms (no network) | ~1–3s (Gemma API) |
| **Cost** | Free | Per-token billing |
| **Off-script handling** | Falls to static handler | Gemma generates freely |
| **Reliability** | 100% (no external deps) | Depends on Gemma availability |

The current architecture treats these modes as **completely separate paths** — which causes the bug where LLM mode never routes to `BrowsePhonesFlow`. A hybrid approach (classify intent first, use flow engine for known intents, LLM only for unknown) would combine the best of both.

---

## State Management: React Context + useReducer

**Files:** [src/context/ChatContext.jsx](../clearpath-ai/src/context/ChatContext.jsx), [src/hooks/useChat.js](../clearpath-ai/src/hooks/useChat.js)

The chat state lives in React Context backed by `useReducer`:

```js
const initialState = {
  messages: [],      // conversation history
  flowId: null,      // which flow is active
  stepId: null,      // which step within that flow
  flowContext: {},   // facts collected during the flow
  persona: null,     // the selected user persona
  chatMode: 'static' // 'static' | 'llm'
};
```

`useReducer` is the right choice here because state transitions are complex and multiple fields update together. For example, `ADVANCE_FLOW` updates `stepId` and `flowContext` atomically — you couldn't do this cleanly with multiple `useState` calls.

**useChat.js** is a custom hook that wraps the dispatch calls. It's the only place in the app that calls `route()` and dispatches `ADD_MESSAGE`. Components never touch routing logic directly.

### Learning resources
- [useReducer vs useState](https://react.dev/learn/extracting-state-logic-into-a-reducer) — official React guide on when to reach for useReducer
- [Custom hooks pattern](https://react.dev/learn/reusing-logic-with-custom-hooks) — why `useChat` exists as a separate hook
- [React Context performance](https://www.developerway.com/posts/how-to-use-react-context-efficiently) — when Context re-renders everything and how to prevent it

---

## What to Explore Next

If you want to go deeper on specific parts of this codebase:

1. **The flow engine** — read `src/engine/flows/browse-phones.js` end-to-end. It's the most complex flow with cross-navigation, order confirmation, and multiple phone selection paths.

2. **The LLM integration** — read `api/llmHandler.js` + `src/data/systemPrompt.js` together. Notice how the system prompt is a form of "programming" — it's the entire business logic for LLM mode written in English.

3. **Card rendering** — trace what happens from Gemma returning `{ type: "usage_chart" }` to `<UsageChart />` rendering. It goes: `parseResponse` → `ChatContext dispatch` → `ChatArea RegistryCards` → `CARD_REGISTRY` lookup → component render.

4. **Persona data** — read `src/data/personas.js` in full. The five conversation rules at the top aren't enforced by code — they're design principles the prompts and flows are written to follow. Understanding the gap between rules and implementation is important.

---

*Files covered: router.js, intentMap.js, flows/*, ChatContext.jsx, useChat.js, parseResponse.js, registry.js, systemPrompt.js, personas.js, llmHandler.js, staticHandler.js, chat.js, api.js*
