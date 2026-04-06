import { useCallback } from 'react';
import { useChat as useChatContext } from '../context/ChatContext';
import { parseResponse } from '../utils/parseResponse';
import { route } from '../engine/router';
import { getSignalOpening } from '../engine/personaOpenings';

export function useChatActions() {
  const { state, dispatch } = useChatContext();

  const sendMessage = useCallback(async (text, intentHint = null) => {
    dispatch({ type: 'CLEAR_ACTION_PILLS' });
    dispatch({ type: 'ADD_MESSAGE', payload: { role: 'user', content: text } });
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const conversationState = {
        flowId:      state.flowId,
        stepId:      state.stepId,
        flowContext: state.flowContext,
      };

      const result = await route(
        conversationState,
        text,
        state.persona,
        [...state.messages, { role: 'user', content: text }],
        intentHint
      );

      const parsed = parseResponse(result.response);

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role:            'assistant',
          content:         parsed.message,
          actionPills:     parsed.actionPills,
          recommendations: parsed.recommendations,
          ...(parsed.refillFlow     && { refillFlow:     true              }),
          ...(parsed.liveChatFlow   && { liveChatFlow:   true              }),
          ...(parsed.phoneOrderFlow && { phoneOrderFlow: parsed.phoneOrderFlow }),
          ...(parsed.upgradeFlow    && { upgradeFlow:    true              }),
          ...(parsed.internationalFlow && { internationalFlow: true        }),
          ...(parsed.activationFlow && { activationFlow: true             }),
          ...(parsed.byopFlow       && { byopFlow:        true            }),
        }
      });

      // Update flow state based on router result
      if (result.endFlow) {
        dispatch({ type: 'END_FLOW' });
      } else if (result.nextFlowId && result.nextFlowId !== state.flowId) {
        dispatch({ type: 'START_FLOW', payload: { flowId: result.nextFlowId } });
        dispatch({ type: 'ADVANCE_FLOW', payload: { stepId: result.nextStepId, contextPatch: result.contextPatch ?? {} } });
      } else if (result.nextStepId) {
        dispatch({ type: 'ADVANCE_FLOW', payload: { stepId: result.nextStepId, contextPatch: result.contextPatch ?? {} } });
      }

    } catch (err) {
      console.error('[Router] Unhandled error:', err);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role:        'assistant',
          content:     "Something went wrong. Try again?",
          actionPills: null,
          recommendations: null,
        }
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state, dispatch]);

  const startChat = useCallback((intentPrompt, intentHint = null) => {
    dispatch({ type: 'START_CHAT' });
    // Small delay so the chat UI renders first.
    setTimeout(() => sendMessage(intentPrompt, intentHint), 100);
  }, [dispatch, sendMessage]);

  // Proactive AI-first opening — used by info-severity signal cards.
  // Opens the chat and shows the persona opening as an AI message with no user bubble.
  const startProactiveChat = useCallback((sig) => {
    dispatch({ type: 'START_CHAT' });
    if (sig) dispatch({ type: 'SET_ACTIVE_SIGNAL', payload: sig });
    setTimeout(() => {
      const result = getSignalOpening(sig, state.persona);
      if (result) {
        const { message, actionPills } = parseResponse(result.response);
        dispatch({ type: 'ADD_MESSAGE', payload: { role: 'assistant', content: message, actionPills } });
      }
    }, 100);
  }, [dispatch, state.persona]);

  const resetChat = useCallback(() => {
    dispatch({ type: 'RESET_CHAT' });
  }, [dispatch]);

  return { sendMessage, startChat, startProactiveChat, resetChat };
}
