import { useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useChatActions } from '../../hooks/useChat';
import MessageBubble from '../MessageBubble/MessageBubble';
import ActionPills from '../ActionPills/ActionPills';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import RecommendationCard from '../RecommendationCard/RecommendationCard';
import ProductImageStrip from '../ProductImageStrip/ProductImageStrip';
import ExploreDetail from '../ExploreDetail/ExploreDetail';
import styles from './ChatArea.module.css';

export default function ChatArea() {
  const { state, dispatch } = useChat();
  const { sendMessage } = useChatActions();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.isLoading]);

  const handlePillSelect = (pillText) => {
    sendMessage(pillText);
  };

  const handleExplore = (product, type, reason) => {
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        role: 'assistant',
        content: `Great choice! Here's a closer look at the ${product.name} — including what real customers have to say.`,
        exploreData: { product, type, reason },
        actionPills: null,
        recommendations: null,
        productImages: null,
      },
    });
  };

  return (
    <div className={styles.area}>
      <div className={styles.spacer} />
      {state.messages.map((msg, i) => (
        <div key={i} className={styles.messageGroup}>
          <MessageBubble role={msg.role} content={msg.content} />
          {msg.role === 'assistant' && msg.productImages && (
            <ProductImageStrip images={msg.productImages} />
          )}
          {msg.role === 'assistant' && msg.recommendations && (
            <RecommendationCard recommendations={msg.recommendations} onExplore={handleExplore} />
          )}
          {msg.role === 'assistant' && msg.exploreData && (
            <ExploreDetail exploreData={msg.exploreData} />
          )}
          {msg.role === 'assistant' && msg.actionPills && (
            <ActionPills pills={msg.actionPills} onSelect={handlePillSelect} />
          )}
        </div>
      ))}
      {state.isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
