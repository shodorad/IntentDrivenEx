import { useEffect, useRef } from 'react';
import { Headset } from '@phosphor-icons/react';
import { useChat } from '../../context/ChatContext';
import { useChatActions } from '../../hooks/useChat';
import MessageBubble from '../MessageBubble/MessageBubble';
import ActionPills from '../ActionPills/ActionPills';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import RecommendationCard from '../RecommendationCard/RecommendationCard';
import RefillFlow from '../RefillFlow/RefillFlow';
import LiveChatFlow from '../LiveChatFlow/LiveChatFlow';
import PhoneOrderFlow from '../PhoneOrderFlow/PhoneOrderFlow';
import { AlertCard } from '../AlertCard/AlertCard';
import styles from './ChatArea.module.css';

export default function ChatArea() {
  const { state, dispatch } = useChat();
  const { sendMessage } = useChatActions();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.isLoading]);

  const handlePillSelect = (pillText, intent) => {
    sendMessage(pillText, intent);
  };

  const handleExplore = (product, type, reason) => {
    if (type === 'phone') {
      // Route through sendMessage so the persona flow (e.g. Alex) can respond
      // with an order summary. The product name contains enough keywords for
      // getAlexPhoneTurnResponse to match (a36, a17, moto, iphone 13, etc.)
      sendMessage(`I want the ${product.name}`);
      return;
    }
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        role: 'assistant',
        content: `Great choice! Here's a closer look at the ${product.name} — including what real customers have to say.`,
        exploreData: { product, type, reason },
        actionPills: null,
        recommendations: null,
      },
    });
  };

  return (
    <div className={styles.area}>
      {/* Sticky left signal card — shown when a card triggered this chat */}
      {state.activeSignal && (
        <div className={styles.stickySignalWrap}>
          <span className={styles.stickySignalLabel}>What triggered this</span>
          <AlertCard
            severity={state.activeSignal.severity}
            headline={state.activeSignal.headline}
            subtext={state.activeSignal.subtext}
          />
        </div>
      )}

      {/* Messages column */}
      <div className={styles.messagesCol}>
        <div className={styles.spacer} />
        {state.messages.map((msg, i) => (
          <div key={i} className={styles.messageGroup}>
            <MessageBubble role={msg.role} content={msg.content} />
            {msg.role === 'assistant' && msg.refillFlow && (
              <RefillFlow />
            )}
            {msg.role === 'assistant' && msg.liveChatFlow && (
              <LiveChatFlow />
            )}
            {msg.role === 'assistant' && msg.phoneOrderFlow && (
              <PhoneOrderFlow orderData={msg.phoneOrderFlow} />
            )}
            {msg.role === 'assistant' && msg.recommendations && (
              <RecommendationCard recommendations={msg.recommendations} onExplore={handleExplore} />
            )}
            {msg.role === 'assistant' && msg.actionPills && (
              <ActionPills pills={msg.actionPills} onSelect={handlePillSelect} />
            )}
          </div>
        ))}
        {state.isLoading && <TypingIndicator />}

        {/* Persistent escape hatch — always visible during chat */}
        <div className={styles.escapeHatch}>
          <Headset size={16} weight="regular" />
          <span>
            Need a real person? Call <a href="tel:18666633633" className={styles.escapeLink}>1-866-663-3633</a> anytime.
          </span>
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
