import { GoogleGenAI } from '@google/genai';

const JSON_SCHEMA_INSTRUCTION = `
You MUST respond with valid JSON only — no markdown, no code fences, no extra text.
Response schema:
{
  "message": "string — your conversational reply (1-3 sentences)",
  "cards": [
    // Include ONLY when ready to show a recommendation or trigger a flow.
    // Card types:
    // { "type": "plan", "id": "plan-id", "reason": "short reason", "isBest": true|false, "layout": "single|grid|grid6|grid9" }
    // { "type": "phone", "id": "phone-id", "reason": "short reason", "isBest": false, "layout": "single|grid|grid6|grid9" }
    // { "type": "usage_history", "chartType": "bar|line|pie|donut" }
    // { "type": "usage_chart", "chartType": "line|bar" }
    // { "type": "refill" }
    // { "type": "upgrade" }
    // { "type": "redeem" }
    // { "type": "live_chat" }
    // { "type": "phone_order", "item": "name", "price": "FREE|$XX", "free": true|false }
    // Leave as empty array [] if not recommending anything yet.
    //
    // LAYOUT RULES for plan/phone cards (apply the same layout to ALL cards in the response):
    // - 1 result  → "single"  (centered, full details, all stats shown)
    // - 3 results → "grid"    (3 horizontal cards, full details)
    // - 6 results → "grid6"   (2×3 wrapped grid, reduced density — 2 features, no stats row)
    // - 9 results → "grid9"   (3×3 wrapped grid, minimal density — 1 feature, compact price)
    //
    // CHART TYPE RULES:
    // - usage_history default: "bar"  — use "pie" or "donut" only if user says "as a pie chart" / "as a donut"
    // - usage_chart default:   "line" — use "bar" only if user says "as a bar chart"
  ],
  "followUp": [
    // 2-3 quick reply pills. Always include unless a flow card is present.
    { "label": "string", "intent": "string" }
  ]
}
`;

function extractNonThoughtPart(text) {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

function validateResponse(parsed) {
  if (typeof parsed.message !== 'string') throw new Error('missing message');
  if (!Array.isArray(parsed.cards)) throw new Error('cards must be array');
  if (!Array.isArray(parsed.followUp)) throw new Error('followUp must be array');
}

export async function handleLLMChat(req, res) {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GOOGLE_AI_API_KEY not configured' });

  const { messages = [], system: systemPrompt = '' } = req.body;

  const ai = new GoogleGenAI({ apiKey });

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

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

  return res.status(200).json(parsed);
}
