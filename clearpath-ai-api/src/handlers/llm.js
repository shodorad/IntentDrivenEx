import { getGemmaClient, GEMMA_MODEL, extractAnswer, validateResponse } from '../lib/gemma.js';
import { JSON_SCHEMA_INSTRUCTION } from '../lib/schema.js';

export async function handleLLMChat(req, res) {
  const { messages = [], system: systemPrompt = '' } = req.body;

  const client = getGemmaClient();

  const contents = messages.map(m => ({
    role:  m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const response = await client.models.generateContent({
    model: GEMMA_MODEL,
    contents,
    config: {
      systemInstruction: systemPrompt + '\n\n' + JSON_SCHEMA_INSTRUCTION,
      responseMimeType:  'application/json',
      temperature:       0.3,
      maxOutputTokens:   2048,
    },
  });

  const rawText = extractAnswer(response.text);
  const parsed  = JSON.parse(rawText);
  validateResponse(parsed);

  return res.status(200).json(parsed);
}
