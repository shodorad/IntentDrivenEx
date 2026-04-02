import { useCallback } from 'react';
import { useChat as useChatContext } from '../context/ChatContext';
import { parseResponse } from '../utils/parseResponse';
import { generateDemoResponse } from '../utils/demoResponses';
import { callAPI } from '../utils/api';
import { getSystemPrompt } from '../data/systemPrompt';

export function useChatActions() {
  const { state, dispatch } = useChatContext();

  const sendMessage = useCallback(async (text, intentOverride = null) => {
    // Clear any existing action pills
    dispatch({ type: 'CLEAR_ACTION_PILLS' });

    // Add user message
    const userMsg = { role: 'user', content: text };
    dispatch({ type: 'ADD_MESSAGE', payload: userMsg });
    dispatch({ type: 'SET_LOADING', payload: true });

    const persona = state.persona;

    try {
      // Build messages array for API
      const apiMessages = [...state.messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const resolvedIntent = intentOverride ?? state.activeIntent;
      const resolvedTurn   = intentOverride != null ? 0 : state.intentTurn;
      // When a pill fires a new intent, reset flow state so the named state machine starts fresh
      const resolvedFlowState = intentOverride != null ? null : state.flowState;
      let responseText = generateDemoResponse(apiMessages, persona, resolvedIntent, resolvedTurn, resolvedFlowState);

      // ── API FALLBACK ──────────────────────────────────────────────────────────
      // If the scripted engine returns null (unhandled path), call Claude API.
      // Scripted flows are unaffected — they always return a non-null string.
      if (!responseText) {
        try {
          const systemPrompt = getSystemPrompt(state.persona);
          responseText = await callAPI(apiMessages, systemPrompt);
        } catch (err) {
          console.error('[ChatEngine] API fallback failed:', err);
          // Hard fallback: show clarify response so conversation doesn't break
          responseText = `I want to make sure I help with the right thing. Were you looking to:\n[ACTION_PILLS]${JSON.stringify([
            { label: 'Add data now',        intent: 'quick_refill'   },
            { label: 'Understand my usage', intent: 'diagnose_usage' },
            { label: 'Change my plan',      intent: 'plan_change'    },
            { label: 'Go back home',        intent: 'done'           },
          ])}[/ACTION_PILLS]`;
        }
      }
      // ─────────────────────────────────────────────────────────────────────────

      // Phase 3: extract [FLOW_STATE:xxx] tag before parsing so it doesn't pollute the message
      let nextFlowState;
      if (responseText) {
        const flowMatch = responseText.match(/\[FLOW_STATE:([^\]]+)\]/);
        if (flowMatch) {
          nextFlowState = flowMatch[1];
          responseText = responseText.replace(/\n?\[FLOW_STATE:[^\]]+\]/, '').trim();
        }
      }

      const { message, actionPills, recommendations, refillFlow, liveChatFlow, phoneOrderFlow, upgradeFlow, internationalFlow, activationFlow, byopFlow } = parseResponse(responseText);

      // E4 guard: suppress recommendations/flows on the very first user message
      const userMessageCount = [...state.messages, userMsg].filter(m => m.role === 'user').length;
      const isFirstUserMessage = userMessageCount === 1;
      const suppressFlow = isFirstUserMessage && (recommendations || refillFlow || phoneOrderFlow || upgradeFlow || internationalFlow || activationFlow || byopFlow);
      if (suppressFlow) {
        console.warn('[E4 guard] Suppressed premature recommendation on first user message.');
      }

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: message,
          actionPills,
          recommendations: suppressFlow ? null : recommendations,
          ...((!suppressFlow && refillFlow) && { refillFlow: true }),
          ...((!suppressFlow && liveChatFlow) && { liveChatFlow: true }),
          ...((!suppressFlow && phoneOrderFlow) && { phoneOrderFlow }),
          ...((!suppressFlow && upgradeFlow) && { upgradeFlow: true }),
          ...((!suppressFlow && internationalFlow) && { internationalFlow: true }),
          ...((!suppressFlow && activationFlow) && { activationFlow: true }),
          ...((!suppressFlow && byopFlow) && { byopFlow: true }),
        }
      });
      dispatch({ type: 'INCREMENT_INTENT_TURN' });
      if (nextFlowState !== undefined) {
        dispatch({ type: 'SET_FLOW_STATE', payload: nextFlowState });
      }
    } catch (err) {
      console.error('Chat error:', err);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: "Sorry, something went wrong. Let me try again — could you rephrase that?",
          actionPills: null,
          recommendations: null
        }
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.messages, state.persona, state.activeIntent, state.intentTurn, dispatch]);

  const startChat = useCallback((intentPrompt, intentOverride = null) => {
    dispatch({ type: 'START_CHAT' });
    // Small delay so the chat UI renders first.
    // Pass intentOverride through so sendMessage uses the correct intent even
    // though state.activeIntent hasn't propagated into this closure yet.
    setTimeout(() => sendMessage(intentPrompt, intentOverride), 100);
  }, [dispatch, sendMessage]);

  const resetChat = useCallback(() => {
    dispatch({ type: 'RESET_CHAT' });
  }, [dispatch]);

  return { sendMessage, startChat, resetChat };
}
