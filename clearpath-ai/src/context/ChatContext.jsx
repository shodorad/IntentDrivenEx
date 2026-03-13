import { createContext, useContext, useReducer } from 'react';

const ChatContext = createContext(null);

const initialState = {
  mode: 'landing', // 'landing' | 'chatting'
  messages: [],     // { role, content, actionPills?, recommendations? }
  isLoading: false,
  showTransparencyPanel: false,
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
      return { ...initialState };
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
