import { handleLLMChat } from './llmHandler.js';
import { handleStaticChat } from './staticHandler.js';
import { getFallbackResponse } from './fallback.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { chatMode = 'static' } = req.body;

  try {
    if (chatMode === 'llm') {
      return await handleLLMChat(req, res);
    }
    return handleStaticChat(req, res);
  } catch (err) {
    console.error('[api/chat]', err.message);

    if (err.status === 429 || err.message?.includes('429') || err.message?.includes('quota')) {
      return res.status(200).json(getFallbackResponse());
    }

    try {
      return handleStaticChat(req, res);
    } catch {
      return res.status(200).json(getFallbackResponse());
    }
  }
}
