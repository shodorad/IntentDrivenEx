// JSON schema instruction appended to every system prompt in LLM mode.
export const JSON_SCHEMA_INSTRUCTION = `
RESPONSE FORMAT — STRICT JSON ONLY.
No markdown, no code fences, no extra text outside the JSON.

{
  "message": "string — your conversational reply (1–3 sentences)",
  "cards": [
    // Include ONLY when surfacing a recommendation or triggering a flow.
    // Leave as [] if not yet recommending.
    //
    // Plan/phone cards:
    // { "type": "plan",  "id": "<plan-id>",  "reason": "<short reason>", "isBest": true|false }
    // { "type": "phone", "id": "<phone-id>", "reason": "<short reason>", "isBest": false }
    //
    // Flow triggers (no extra fields needed):
    // { "type": "refill" }
    // { "type": "upgrade" }
    // { "type": "redeem" }
    // { "type": "live_chat" }
    // { "type": "international" }
    // { "type": "activation" }
    // { "type": "byop" }
    //
    // Phone order (include item + price):
    // { "type": "phone_order", "item": "iPhone 15", "price": "FREE", "free": true }
  ],
  "followUp": [
    // 2–3 quick reply pills. Always include unless a flow card is present.
    { "label": "string", "intent": "string" }
  ]
}
`;
