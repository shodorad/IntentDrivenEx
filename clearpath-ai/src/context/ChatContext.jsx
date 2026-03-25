import { createContext, useContext, useReducer } from 'react';
import { DEFAULT_SIGNAL } from '../data/signalBanners';

const ChatContext = createContext(null);

const PERSONAS = {
  'maria':   { name: 'Maria R.', initials: 'MR', dataRemaining: '0.8', dataTotal: '5', planName: 'Total Base 5G', planPrice: '$25 / month', renewalDate: 'Apr 9, 2026',  addons: [] },
  '1':       { name: 'Maria R.', initials: 'MR', dataRemaining: '0.8', dataTotal: '5', planName: 'Total Base 5G', planPrice: '$25 / month', renewalDate: 'Apr 9, 2026',  addons: [] },
  'us-001':  { name: 'Maria R.', initials: 'MR', dataRemaining: '0.8', dataTotal: '5', planName: 'Total Base 5G', planPrice: '$25 / month', renewalDate: 'Apr 9, 2026',  addons: [] },
  'us-006':  { name: 'James T.', initials: 'JT', dataRemaining: '0',   dataTotal: '5', planName: 'Total Base 5G', planPrice: '$25 / month', renewalDate: 'Apr 12, 2026', addons: [] },
  'us-007':  { name: 'Ana G.',   initials: 'AG', dataRemaining: '3.2', dataTotal: '10', planName: 'Total Connect', planPrice: '$35 / month', renewalDate: 'Apr 20, 2026', addons: ['Intl. Calling'] },
};

const DEFAULT_PERSONA = { name: 'Maria R.', initials: 'MR', dataRemaining: '0.8', dataTotal: '5', planName: 'Total Base 5G', planPrice: '$25 / month', renewalDate: 'Apr 9, 2026', addons: [] };

function getPersonaFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('persona') || params.get('user');
    if (key && PERSONAS[key]) return PERSONAS[key];
    // Also check path segments like /us-001
    const pathKey = window.location.pathname.replace(/\//g, '').toLowerCase();
    if (pathKey && PERSONAS[pathKey]) return PERSONAS[pathKey];
  } catch (_) { /* ignore */ }
  return DEFAULT_PERSONA;
}

const initialState = {
  mode: 'landing', // 'landing' | 'chatting'
  messages: [],     // { role, content, actionPills?, recommendations? }
  isLoading: false,
  showTransparencyPanel: false,
  language: 'en',   // 'en' | 'es'
  signalBanner: DEFAULT_SIGNAL, // { type, color, flowId, signalKey }
  showSMSModal: false,
  persona: getPersonaFromUrl(),
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'START_CHAT':
      return { ...state, mode: 'chatting', messages: [] };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'RESET_CHAT':
      return { ...initialState, language: state.language, persona: state.persona };
    case 'SET_PERSONA':
      return { ...state, persona: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_SIGNAL_BANNER':
      return { ...state, signalBanner: action.payload };
    case 'CLEAR_SIGNAL_BANNER':
      return { ...state, signalBanner: null };
    case 'SHOW_SMS_MODAL':
      return { ...state, showSMSModal: true };
    case 'HIDE_SMS_MODAL':
      return { ...state, showSMSModal: false };
    case 'TOGGLE_TRANSPARENCY':
      return { ...state, showTransparencyPanel: !state.showTransparencyPanel };
    case 'CLOSE_TRANSPARENCY':
      return { ...state, showTransparencyPanel: false };
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
