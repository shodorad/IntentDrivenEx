# Deep Dive: LLM Fallback Chain

**Topic**: Where does the LLM go when it fails?
**Date**: 2026-04-24
**Files covered**:
- `clearpath-ai/api/chat.js`
- `clearpath-ai/api/llmHandler.js`
- `clearpath-ai/api/staticHandler.js`
- `clearpath-ai/api/fallback.js`
- `clearpath-ai/src/engine/router.js`

---

## Overview

When the LLM call fails (rate limit, bad JSON output, network error), the app doesn't crash or show an error to the user. Instead, it walks down a **fallback chain** — a sequence of increasingly simpler response strategies, each one a safety net for the one above it.

This is a classic pattern called **graceful degradation**: the system tries the best option first, and if that fails, tries the next-best, all the way down to a hardcoded string that can never fail.

---

## The Fallback Chain (visualized)

```
User sends message
      │
      ▼
[router.js] chatMode === 'llm'?
      │ YES
      ▼
[llmHandler.js] → Google Gemma 4 31B API
      │
      │  FAIL (network / bad JSON / validation error)
      ▼
[router.js] catch → genericClarify()   ← fallback #1 (router level)
      │
      │  SEPARATE PATH: API gateway level
      ▼
[chat.js] try { handleLLMChat() }
      │
      │  FAIL (err.status === 429 / quota exceeded)
      ▼
getFallbackResponse()                  ← fallback #2 (rate limit specific)
      │
      │  FAIL (getFallbackResponse itself somehow throws)
      ▼
handleStaticChat()                     ← fallback #3 (keyword matcher)
      │
      │  FAIL
      ▼
getFallbackResponse()                  ← fallback #4 (last resort)
```

---

## Code Walkthrough

### Layer 1: The API Gateway — `api/chat.js`

```js
// chat.js lines 15–32
if (chatMode === 'llm') {
  return await handleLLMChat(req, res);
}
return handleStaticChat(req, res);
```

This is the **entry point** for every chat request. It decides which path to take based on `chatMode`.

**The catch block is where the magic happens:**

```js
} catch (err) {
  // Rate limit / quota — give a friendly canned response
  if (err.status === 429 || err.message?.includes('429') || err.message?.includes('quota')) {
    return res.status(200).json(getFallbackResponse());
  }

  // Any other error — try the static keyword matcher
  try {
    return handleStaticChat(req, res);
  } catch {
    // Static handler also failed — last resort hardcoded reply
    return res.status(200).json(getFallbackResponse());
  }
}
```

**Key design decision**: The catch block returns `res.status(200)` even on error. This is intentional — the frontend only knows how to handle 200 responses with a JSON body. Returning a 500 would break the chat UI entirely. The error is hidden from the user; they see a friendly message instead.

> **Why `err.message?.includes('429')`?**
> The `?.` is optional chaining — it safely reads `.message` even if `err` is null/undefined. The `429` check handles cases where the error code is embedded in the message string rather than as a proper HTTP status code, which some SDK versions do.

---

### Layer 2: The LLM Handler — `api/llmHandler.js`

```js
const response = await ai.models.generateContent({
  model: 'gemma-4-31b-it',
  contents,
  config: {
    systemInstruction: systemPrompt + '\n\n' + JSON_SCHEMA_INSTRUCTION,
    responseMimeType: 'application/json',
    temperature: 0.3,
    maxOutputTokens: 2048,
  },
});

const rawText = extractNonThoughtPart(response.text);
const parsed = JSON.parse(rawText);
validateResponse(parsed);
```

Three things can go wrong here, each throwing and triggering the fallback:

1. **`generateContent` throws** — network error, quota exceeded, model unavailable
2. **`JSON.parse(rawText)` throws** — the model ignored the JSON instruction and returned prose
3. **`validateResponse(parsed)` throws** — JSON was valid but missing required fields (`message`, `cards`, `followUp`)

```js
function validateResponse(parsed) {
  if (typeof parsed.message !== 'string') throw new Error('missing message');
  if (!Array.isArray(parsed.cards))       throw new Error('cards must be array');
  if (!Array.isArray(parsed.followUp))    throw new Error('followUp must be array');
}
```

This validator acts as a **contract check** — it enforces the shape the frontend depends on. If the LLM hallucinates a different structure, this catches it before broken data reaches the UI.

**The `extractNonThoughtPart` helper:**

```js
function extractNonThoughtPart(text) {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}
```

Some models (particularly reasoning/chain-of-thought models) emit internal thinking wrapped in `<think>` tags before their actual output. This strips it so `JSON.parse` doesn't choke on the extra text. The regex `[\s\S]*?` matches any character including newlines, lazily (stops at the first `</think>`).

---

### Layer 3: The Router — `src/engine/router.js`

```js
// router.js lines 88–102
if (chatMode === 'llm') {
  try {
    const systemPrompt = getSystemPrompt(persona);
    const apiResponse = await callAPI(messageHistory, systemPrompt, chatMode);
    return { response: apiResponse, ... };
  } catch {
    return genericClarify();  // ← fallback inside the router
  }
}
```

This is a **second, independent catch** at the router level — separate from the `chat.js` catch. Why two?

- `chat.js` is the **server** (Node.js API route). It catches server-side errors.
- `router.js` lives in the **browser** (React frontend). It catches client-side errors — e.g. network failures before the request even reaches the server.

`genericClarify()` returns a safe clarifying question:

```js
function genericClarify() {
  return {
    response: msg(
      `I want to make sure I help with the right thing. Were you looking to:`,
      [
        { label: 'Add data now',          intent: 'quick_refill'   },
        { label: 'Understand my usage',   intent: 'diagnose_usage' },
        { label: 'Change my plan',        intent: 'plan_change'    },
        { label: 'Go back home',          intent: 'done'           },
      ]
    ), ...
  };
}
```

This is a conversational reset — instead of showing an error, it steers the user back to a known-good state.

---

### Layer 4: Static Handler — `api/staticHandler.js`

The static handler is not really a "fallback" in the error sense — it's the default mode when `chatMode !== 'llm'`. But it's also used as a fallback when the LLM fails:

```js
// Keyword matching — no AI required, never fails
if (text.includes('refill') || text.includes('data') || text.includes('ran out')) {
  response = { message: "I can help with that...", cards: [], followUp: [...] };
} else if (text.includes('slow') || text.includes('signal') || text.includes('speed')) {
  response = { message: "Let's figure out...", cards: [], followUp: [...] };
} else {
  response = { message: "Got it — let me point you...", cards: [], followUp: [...] };
}
```

This is **rule-based NLP at its simplest** — `String.includes()` checks. No probability, no model, no network. It can only match three cases but it is literally impossible to crash.

---

### Layer 5: Hardcoded Fallback — `api/fallback.js`

```js
export function getFallbackResponse() {
  return {
    message: "I'm having a moment — let me get back on track. What can I help you with?",
    cards: [],
    followUp: [
      { label: 'Quick Refill — $15', intent: 'quick_refill' },
      { label: 'Check My Data',      intent: 'diagnose_usage' },
      { label: 'Talk to a Person',   intent: 'live_chat' },
    ],
  };
}
```

This is the **floor** — a pure function with no dependencies, no I/O, no async. It returns a plain object. It cannot fail. The three follow-up pills are chosen deliberately: they cover the three most common user intents (add data, diagnose usage, escalate to human) so even the worst-case user experience still moves the conversation forward.

---

## Concepts Explained

### Graceful Degradation
A system design principle where, as components fail, the system continues to function at a reduced (but still useful) level rather than failing completely. Contrast with "fail-fast" design where errors surface immediately.

**When to use**: User-facing systems where a partial response is better than no response. Chat interfaces, search engines, recommendation systems.

**When NOT to use**: Financial transactions, data mutations — where a wrong partial answer is worse than an honest error.

### Defensive `try/catch` Nesting
Notice `chat.js` has a `try/catch` inside the outer `catch`:

```js
} catch (err) {
  try {
    return handleStaticChat(req, res);
  } catch {
    return res.status(200).json(getFallbackResponse());
  }
}
```

This is intentional: the inner catch handles the case where the fallback itself fails. Nested try/catch is usually a smell, but here each level genuinely has a different recovery strategy — it's not just swallowing errors.

### Optional Chaining (`?.`)
`err.message?.includes('429')` — safely accesses `.includes` only if `err.message` is not null/undefined. Without it, if `err.message` is undefined, calling `.includes()` throws a TypeError, crashing the catch block that was supposed to handle errors.

### Regex: Lazy vs Greedy Matching
`<think>[\s\S]*?<\/think>` — the `*?` is **lazy** (matches as few characters as possible). Without it, `*` is **greedy** and would match from the first `<think>` all the way to the *last* `</think>` in the string, potentially swallowing valid JSON between two think blocks.

### Contract Validation at Boundaries
`validateResponse()` enforces a **data contract** — a guarantee that the LLM output matches the shape the frontend expects. This is an instance of the **Postel's Law** corollary applied defensively: be strict about what you accept from external systems.

---

## Design Decisions Worth Noting

| Decision | Why |
|---|---|
| Always return `status(200)` even on error | Frontend only handles 200; a 500 breaks the chat UI |
| Two independent catches (server + client) | Client-side network failures vs server-side LLM failures need different handling |
| `temperature: 0.3` (not 0) | Pure 0 temperature can cause repetitive loops; 0.3 gives slight variation while staying deterministic |
| `responseMimeType: 'application/json'` | Forces the model into JSON mode at the API level — belt-and-suspenders with the prompt instruction |
| Hardcoded fallback pills cover the top 3 intents | Even in total failure, users can still accomplish the most common tasks |

---

## Learning Resources

### Graceful Degradation & Resilience Patterns
- [AWS: Implement graceful degradation](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/implement-loosely-coupled-architectures.html) — from the Well-Architected Framework
- [Martin Fowler: Tolerant Reader pattern](https://martinfowler.com/bliki/TolerantReader.html) — being lenient about what you accept from external systems
- [Netflix Tech Blog: Fault Tolerance in a High Volume, Distributed System](https://netflixtechblog.com/fault-tolerance-in-a-high-volume-distributed-system-91ab4faae74a)

### JavaScript Error Handling
- [MDN: try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) — fundamentals
- [JavaScript.info: Error handling](https://javascript.info/error-handling) — practical patterns including nested catch

### Regex
- [Regex101](https://regex101.com) — interactive playground, paste the `<think>` regex and test it
- [MDN: Regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)
- Greedy vs lazy: search "regex greedy vs lazy quantifier" on any tutorial site

### LLM Output Validation
- [Instructor library (Python)](https://python.useinstructor.com/) — structured LLM output with Pydantic validation (same concept, different language)
- [Zod + LLM output validation (JS)](https://zod.dev/) — TypeScript schema validation you could apply here

### Optional Chaining
- [MDN: Optional chaining (?.)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)

---

## Related Files in This Codebase

- [api/chat.js](../clearpath-ai/api/chat.js) — gateway handler, outer fallback catch
- [api/llmHandler.js](../clearpath-ai/api/llmHandler.js) — LLM call + JSON validation
- [api/staticHandler.js](../clearpath-ai/api/staticHandler.js) — keyword matcher fallback
- [api/fallback.js](../clearpath-ai/api/fallback.js) — hardcoded last resort
- [src/engine/router.js](../clearpath-ai/src/engine/router.js) — client-side routing + client catch
- [src/data/systemPrompt.js](../clearpath-ai/src/data/systemPrompt.js) — the prompt that tells the LLM what to output

---

## Next Steps for Deeper Study

1. **Add Zod validation** — replace `validateResponse()` with a Zod schema for richer error messages and type inference
2. **Retry with backoff** — instead of immediately falling back on 429, retry after 1s/2s/4s (exponential backoff)
3. **Structured error logging** — log which fallback level was triggered and why, so you can measure LLM reliability over time
4. **Circuit breaker pattern** — if the LLM fails 5 times in a row, stop trying it for 60 seconds and serve static responses directly (saves quota and latency)
