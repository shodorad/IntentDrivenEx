import { Router } from 'express';
import { handleLLMChat }      from '../handlers/llm.js';
import { handleStaticChat }   from '../handlers/static.js';
import { getFallbackResponse } from '../handlers/fallback.js';

const router = Router();

router.post('/', async (req, res) => {
  const { chatMode = 'static' } = req.body;

  try {
    if (chatMode === 'llm') {
      return await handleLLMChat(req, res);
    }
    return handleStaticChat(req, res);
  } catch (err) {
    console.error('[/api/chat]', err.message);

    const isQuotaError = err.status === 429
      || err.message?.includes('429')
      || err.message?.includes('quota')
      || err.message?.includes('RESOURCE_EXHAUSTED');

    if (isQuotaError) {
      return res.status(200).json(getFallbackResponse());
    }

    // Any other LLM error → drop to static
    try {
      return handleStaticChat(req, res);
    } catch {
      return res.status(200).json(getFallbackResponse());
    }
  }
});

export default router;
