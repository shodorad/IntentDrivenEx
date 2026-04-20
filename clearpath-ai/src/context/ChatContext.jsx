/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer } from 'react';
import { PERSONAS, getPersonaFromURL } from '../data/personas';

// Re-export for components that import PERSONAS from ChatContext
export { PERSONAS };

const ChatContext = createContext(null);

const CHAT_MODE_KEY = 'clearpath_chat_mode';

const initialState = {
  mode: 'landing', // 'landing' | 'chatting'
  chatMode: localStorage.getItem(CHAT_MODE_KEY) || 'static', // 'llm' | 'static'
  messages: [],     // { role, content, actionPills?, recommendations? }
  isLoading: false,
  showTransparencyPanel: false,
  language: 'en',   // 'en' | 'es'
  signalBanner: null, // Derived from persona.signals[0] in LandingScreen
  showSMSModal: false,
  smsModalData: null, // { transactionType: 'refill' | 'upgrade' | 'international' }
  persona: getPersonaFromURL(),
  inputFocused: false,
  activeIntent: null,    // current intent driving the conversation
  intentTurn: 0,         // how many user messages sent within current intent
  flowState: null,       // named state within current flow (Phase 3)
  activeSignal: null,    // signal card that triggered the chat session

  // ── New engine state (replaces activeIntent + intentTurn + flowState) ──────
  flowId:      null,     // e.g. 'quick_refill' | 'support' | null
  stepId:      null,     // e.g. 'asked_wifi' | 'asked_restart' | null
  flowContext: {},       // facts accumulated during the active flow
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'START_CHAT':
      return { ...state, mode: 'chatting', messages: [], flowState: null };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'RESET_CHAT':
      return { ...initialState, language: state.language, persona: state.persona };
    case 'SET_PERSONA':
      return { ...state, persona: action.payload, signalBanner: null };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_SIGNAL_BANNER':
      return { ...state, signalBanner: action.payload };
    case 'CLEAR_SIGNAL_BANNER':
      return { ...state, signalBanner: null };
    case 'SHOW_SMS_MODAL':
      return { ...state, showSMSModal: true, smsModalData: action.payload || null };
    case 'HIDE_SMS_MODAL':
      return { ...state, showSMSModal: false, smsModalData: null };
    case 'TOGGLE_TRANSPARENCY':
      return { ...state, showTransparencyPanel: !state.showTransparencyPanel };
    case 'CLOSE_TRANSPARENCY':
      return { ...state, showTransparencyPanel: false };
    case 'SET_INPUT_FOCUSED':
      return { ...state, inputFocused: action.payload };
    case 'CLEAR_ACTION_PILLS': {
      // Remove action pills from the last AI message
      const msgs = [...state.messages];
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i].role === 'assistant' && msgs[i].actionPills) {
          msgs[i] = { ...msgs[i], actionPills: null };
          break;
        }
      }
      return { ...state, messages: msgs };
    }
    case 'SET_INTENT':
      return {
        ...state,
        activeIntent: action.payload,
        intentTurn: 0,       // always reset turn counter when intent changes
        flowState: null,     // reset named flow state when intent changes
      };
    case 'INCREMENT_INTENT_TURN':
      return {
        ...state,
        intentTurn: state.intentTurn + 1,
      };
    case 'SET_FLOW_STATE':
      return { ...state, flowState: action.payload };
    case 'CLEAR_INTENT':
      return {
        ...state,
        activeIntent: null,
        intentTurn: 0,
        flowState: null,
      };
    case 'SET_ACTIVE_SIGNAL':
      return { ...state, activeSignal: action.payload };

    // ── New engine actions ──────────────────────────────────────────────────
    case 'START_FLOW':
      return {
        ...state,
        flowId:      action.payload.flowId,
        stepId:      'start',
        flowContext: {},
      };
    case 'ADVANCE_FLOW':
      return {
        ...state,
        stepId:      action.payload.stepId,
        flowContext: { ...state.flowContext, ...action.payload.contextPatch },
      };
    case 'END_FLOW':
      return { ...state, flowId: null, stepId: null, flowContext: {} };

    case 'SET_CHAT_MODE': {
      localStorage.setItem(CHAT_MODE_KEY, action.payload);
      return { ...state, chatMode: action.payload };
    }

    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
