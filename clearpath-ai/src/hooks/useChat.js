import { useCallback } from 'react';
import { useChat as useChatContext } from '../context/ChatContext';
import { callAPI } from '../utils/api';
import { parseResponse } from '../utils/parseResponse';
import { generateDemoResponse } from '../utils/demoResponses';
import { getSystemPrompt } from '../data/systemPrompt';

// Check if API is available (non-demo mode)
const isDemoMode = () => {
  // In production with Vercel serverless function, API is always available
  // In dev, it depends on whether server.js is running with ANTHROPIC_API_KEY
  return false; // We'll try API first, fall back to demo on error
};

export function useChatActions() {
  const { state, dispatch } = useChatContext();

  const sendMessage = useCallback(async (text) => {
    // Clear any existing action pills
    dispatch({ type: 'CLEAR_ACTION_PILLS' });

    // Add user message
    const userMsg = { role: 'user', content: text };
    dispatch({ type: 'ADD_MESSAGE', payload: userMsg });
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Build messages array for API
      const apiMessages = [...state.messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      let responseText;
      try {
        responseText = await callAPI(apiMessages, getSystemPrompt());
      } catch {
        // Fallback to demo mode
        responseText = generateDemoResponse(apiMessages);
      }

      const { message, actionPills, recommendations, productImages } = parseResponse(responseText);

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: message,
          actionPills,
          recommendations,
          productImages
        }
      });
    } catch (err) {
      console.error('Chat error:', err);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: "Sorry, something went wrong. Let me try again — could you rephrase that?",
          actionPills: null,
          recommendations: null,
          productImages: null
        }
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.messages, dispatch]);

  const startChat = useCallback((intentPrompt) => {
    dispatch({ type: 'START_CHAT' });
    // Small delay so the chat UI renders first
    setTimeout(() => sendMessage(intentPrompt), 100);
  }, [dispatch, sendMessage]);

  const resetChat = useCallback(() => {
    dispatch({ type: 'RESET_CHAT' });
  }, [dispatch]);

  return { sendMessage, startChat, resetChat };
}
