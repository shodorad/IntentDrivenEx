import { useEffect, useRef } from 'react';
import { Headset, ArrowLeft } from '@phosphor-icons/react';
import { useChat } from '../../context/ChatContext';
import { useChatActions } from '../../hooks/useChat';
import MessageBubble from '../MessageBubble/MessageBubble';
import ActionPills from '../ActionPills/ActionPills';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import RecommendationCard from '../RecommendationCard/RecommendationCard';
import RefillFlow from '../RefillFlow/RefillFlow';
import RedeemFlow from '../RedeemFlow/RedeemFlow';
import UpgradeFlow from '../UpgradeFlow/UpgradeFlow';
import LiveChatFlow from '../LiveChatFlow/LiveChatFlow';
import PhoneOrderFlow from '../PhoneOrderFlow/PhoneOrderFlow';
import { AlertCard } from '../AlertCard/AlertCard';
import { CARD_REGISTRY, GROUPED_CARD_TYPES, ORDER_CARD_TYPES } from '../cards/registry';
import styles from './ChatArea.module.css';

function RegistryCards({ cards, onExplore }) {
  if (!cards?.length) return null;

  // Group plan/phone cards for RecommendationCard
  const grouped = [];
  let recBuffer = [];

  const flushRec = () => {
    if (recBuffer.length) {
      grouped.push({ type: '_grouped_rec', cards: recBuffer });
      recBuffer = [];
    }
  };

  for (const card of cards) {
    if (GROUPED_CARD_TYPES.has(card.type)) {
      recBuffer.push(card);
    } else {
      flushRec();
      grouped.push(card);
    }
  }
  flushRec();

  return grouped.map((item, idx) => {
    if (item.type === '_grouped_rec') {
      return <RecommendationCard key={idx} recommendations={item.cards} onExplore={onExplore} />;
    }
    const Component = CARD_REGISTRY[item.type];
    if (!Component) return null;
    if (ORDER_CARD_TYPES.has(item.type)) {
      return <Component key={idx} orderData={item} />;
    }
    return <Component key={idx} data={item.data || item} />;
  });
}

export default function ChatArea() {
  const { state, dispatch } = useChat();
  const { sendMessage, resetChat } = useChatActions();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.isLoading]);

  const handlePillSelect = (pillText, intent) => {
    sendMessage(pillText, intent);
  };

  const handleExplore = (product, type, reason) => {
    if (type === 'phone') {
      const a = state.persona?.account || {};
      const isFree = product.price === 0;
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: '',
          phoneOrderFlow: {
            item:    product.name,
            price:   isFree ? 'FREE' : `$${product.price}`,
            free:    isFree,
            card:    a.savedCard || 'card on file',
            rewards: product.costDiff || null,
          },
          actionPills:     null,
          recommendations: null,
        },
      });
      return;
    }
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        role: 'assistant',
        content: `Confirming your plan upgrade now.`,
        upgradeFlow: true,
        actionPills: null,
        recommendations: null,
      },
    });
  };

  return (
    <div className={styles.area}>
      {/* Floating back to home button */}
      <button className={styles.homeBtn} onClick={resetChat}>
        <ArrowLeft size={15} weight="bold" />
        <span>Back to Home</span>
      </button>

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
            {msg.role === 'assistant' && (
              <>
                {/* Registry-driven MUI cards (LLM mode) */}
                {msg.cards && <RegistryCards cards={msg.cards} onExplore={handleExplore} />}

                {/* Legacy static flow components (backward compat) */}
                {!msg.cards && msg.refillFlow     && <RefillFlow />}
                {!msg.cards && msg.redeemFlow     && <RedeemFlow />}
                {!msg.cards && msg.upgradeFlow    && <UpgradeFlow />}
                {!msg.cards && msg.liveChatFlow   && <LiveChatFlow />}
                {!msg.cards && msg.phoneOrderFlow && <PhoneOrderFlow orderData={msg.phoneOrderFlow} />}
                {!msg.cards && msg.recommendations && <RecommendationCard recommendations={msg.recommendations} onExplore={handleExplore} />}

                {msg.actionPills && <ActionPills pills={msg.actionPills} onSelect={handlePillSelect} />}
              </>
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
