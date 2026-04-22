import { GoogleGenAI } from '@google/genai';
import { runAgentLoop } from './agentLoop.js';

// gemini-2.0-flash: supports function calling, fast, cost-effective
// gemma-4-31b-it did not support Gemini tool-use API
const MODEL = 'gemini-2.0-flash';

export async function handleLLMChat(req, res) {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GOOGLE_AI_API_KEY not configured' });

  // system prompt is built on the frontend (router.js → getSystemPrompt) and passed in body
  const { messages = [], system: systemPrompt = '', persona } = req.body;

  const ai = new GoogleGenAI({ apiKey });

  const result = await runAgentLoop(ai, MODEL, systemPrompt, messages, persona);

  return res.status(200).json(result);
}
