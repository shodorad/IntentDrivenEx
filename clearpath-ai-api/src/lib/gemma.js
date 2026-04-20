import { GoogleGenAI } from '@google/genai';

let _client = null;

export function getGemmaClient() {
  if (!_client) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) throw new Error('GOOGLE_AI_API_KEY not configured');
    _client = new GoogleGenAI({ apiKey });
  }
  return _client;
}

export const GEMMA_MODEL = 'gemma-4-31b-it';

// Gemma 4 is a thinking model — strip <think>...</think> blocks
export function extractAnswer(text) {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

export function validateResponse(parsed) {
  if (typeof parsed.message !== 'string') throw new Error('missing message field');
  if (!Array.isArray(parsed.cards))        throw new Error('cards must be an array');
  if (!Array.isArray(parsed.followUp))     throw new Error('followUp must be an array');
}
