// JSON schema instruction appended to every system prompt in LLM mode.
export const JSON_SCHEMA_INSTRUCTION = `
RESPONSE FORMAT — STRICT JSON ONLY.
No markdown, no code fences, no extra text outside the JSON.

{
  "message": "string — your conversational reply (1–3 sentences)",
  "cards": [
    // MUI data cards (include whenever data supports a visual):
    // { "type": "usage_chart",      "data": { "dataTotal": "5 GB", "dataRemaining": "0.8 GB", "daysUntilRenewal": 14 } }
    // { "type": "account_snapshot", "data": { "plan": "...", "dataRemaining": "...", "dataTotal": "...", "dataPercent": 16, "renewalDate": "Apr 9", "daysUntilRenewal": 14, "autoPayEnabled": false, "rewardsPoints": 120, "device": "Samsung Galaxy A14", "savedCard": "4242" } }
    // { "type": "plan_comparison",  "data": { "currentPlan": "Total Base 5G", "planIds": ["base-5g", "5g-unlimited", "5g-plus-unlimited"] } }
    // { "type": "step_timeline",    "data": { "title": "...", "steps": [{ "label": "...", "detail": "..." }] } }
    // { "type": "insight",          "data": { "severity": "info|tip|warning|critical", "title": "...", "insights": [{ "text": "..." }], "tags": ["..."] } }
    //
    // Plan/phone recommendations:
    // { "type": "plan",  "id": "base-5g|5g-unlimited|5g-plus-unlimited", "reason": "...", "isBest": true|false }
    // { "type": "phone", "id": "<phone-id>", "reason": "...", "isBest": false }
    //
    // Flow triggers (no extra fields):
    // { "type": "refill" }
    // { "type": "upgrade" }
    // { "type": "redeem" }
    // { "type": "live_chat" }
    // { "type": "international" }
    // { "type": "activation" }
    // { "type": "byop" }
    //
    // Phone order:
    // { "type": "phone_order", "item": "iPhone 15", "price": "FREE", "free": true }
    //
    // Leave as [] if not recommending anything or asking a clarifying question.
  ],
  "followUp": [
    // 2–3 quick reply pills. Always include unless a flow card is present.
    { "label": "string", "intent": "string" }
  ]
}
`;
