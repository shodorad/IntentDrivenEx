// src/engine/router.js
// Single entry point replacing generateDemoResponse.
// 5-step dispatch chain — each step is mutually exclusive.

import { classifyIntent }   from '../data/intentMap.js';
import { FLOW_REGISTRY }    from './flows/index.js';
import { callAPI }          from '../utils/api.js';
import { getSystemPrompt }  from '../data/systemPrompt.js';
import { getPersonaOpening } from './personaOpenings.js';
import { msg, POST_FLOW_PILLS } from './utils.js';

// ── Global catch helpers ──────────────────────────────────────────────────────

function escalateToLiveChat() {
  return {
    response: `I'll connect you with our team right now.\n\nLive chat wait time: ~4 minutes.\n[LIVE_CHAT_FLOW]`,
    nextFlowId:   null,
    nextStepId:   null,
    contextPatch: {},
    endFlow:      true,
  };
}

function endSession() {
  return {
    response: msg(
      `You're all set! Come back any time.\n\nIs there anything else before you go?`,
      [
        { label: 'One more thing', intent: 'show_options' },
        { label: 'All done',       intent: 'reset'        },
      ]
    ),
    nextFlowId:   null,
    nextStepId:   null,
    contextPatch: {},
    endFlow:      true,
  };
}

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
    ),
    nextFlowId:   null,
    nextStepId:   null,
    contextPatch: {},
    endFlow:      false,
  };
}

function flowFallback(flow, stepId, persona) {
  // Re-present the current step's last question if available
  // as a safe "I didn't understand that" response.
  // If start is callable, retry it; otherwise show clarify.
  const retryResult = flow.step('start', '', {}, persona);
  if (retryResult) {
    return {
      ...retryResult,
      response: `I didn't quite catch that — let me take you back to the beginning.\n\n${retryResult.response}`,
    };
  }
  return genericClarify();
}

// ── Main router ───────────────────────────────────────────────────────────────

/**
 * Route one user message to a RouteResult.
 *
 * @param {object} conversationState  - { flowId, stepId, flowContext }
 * @param {string} userText           - The user's raw message
 * @param {object} persona            - Full persona object from PERSONAS
 * @param {Array}  messageHistory     - All messages (for API fallback context)
 * @returns {Promise<RouteResult>}
 */
export async function route(conversationState, userText, persona, messageHistory, intentHint = null, chatMode = 'static') {
  const { flowId, stepId, flowContext } = conversationState;
  const lower = userText.toLowerCase();

  // ── 0. LLM MODE — skip flow engine entirely ──────────────────────────────────
  if (chatMode === 'llm') {
    try {
      const systemPrompt = getSystemPrompt(persona);
      const apiResponse = await callAPI(messageHistory, systemPrompt, chatMode, persona);
      return {
        response:     apiResponse,
        nextFlowId:   null,
        nextStepId:   null,
        contextPatch: {},
        endFlow:      false,
      };
    } catch {
      return genericClarify();
    }
  }

  // ── 1. GLOBAL CATCHES ────────────────────────────────────────────────────────
  // These intercept specific phrases regardless of what flow is active.
  if (lower.includes('live chat') ||
      lower.includes('speak to a person') || lower.includes('talk to a person') ||
      lower.includes('connect me to support')) {
    return escalateToLiveChat();
  }
  if (lower.includes('go back home') || lower.includes('go home') ||
      lower.includes('start over') || lower === "that's all" || lower === 'thats all' ||
      lower.includes('return to home') || lower.includes('never mind') || lower.includes('nevermind')) {
    return endSession();
  }

  // ── 2. ACTIVE FLOW ───────────────────────────────────────────────────────────
  // If a flow is running, it owns the conversation — UNLESS a pill provided an
  // explicit intentHint, in which case we route by intent (step 3) instead of
  // letting the active flow try to text-match the pill label.
  if (!intentHint && flowId && FLOW_REGISTRY[flowId]) {
    const flow = FLOW_REGISTRY[flowId];
    const result = flow.step(stepId, userText, flowContext || {}, persona);
    if (result) return result;
    return flowFallback(flow, stepId, persona);
  }

  // ── 3. INTENT CLASSIFICATION ─────────────────────────────────────────────────
  // intentHint comes from pill.intent — bypasses text classifier for pill clicks.
  // classifyIntent handles free-text messages.
  const intent = intentHint ?? classifyIntent(userText);

  if (intent === 'done' || intent === 'reset') {
    return endSession();
  }

  if (intent && FLOW_REGISTRY[intent]) {
    const result = FLOW_REGISTRY[intent].step('start', userText, {}, persona);
    if (result) {
      return {
        ...result,
        nextFlowId: intent,
        nextStepId: result.nextStepId || 'start',
      };
    }
  }

  // ── 4. PERSONA OPENING ───────────────────────────────────────────────────────
  // No intent matched — if this is the first user message, show the persona opening.
  // Skip if an explicit intentHint was provided (pill was clicked but intent isn't registered).
  const userMessages = messageHistory.filter(m => m.role === 'user');
  if (!intentHint && userMessages.length === 1 && persona) {
    const opening = getPersonaOpening(persona);
    if (opening) return opening;
  }

  // ── 5. API FALLBACK ───────────────────────────────────────────────────────────
  // Truly off-script: no flow matched, no intent matched.
  // Let Claude handle it with persona context.
  try {
    const systemPrompt = getSystemPrompt(persona);
    const apiResponse = await callAPI(messageHistory, systemPrompt, chatMode, persona);
    // apiResponse is either a JSON object (LLM/static mode) or a plain string (legacy)
    return {
      response:     apiResponse,
      nextFlowId:   null,
      nextStepId:   null,
      contextPatch: {},
      endFlow:      false,
    };
  } catch {
    return genericClarify();
  }
}
