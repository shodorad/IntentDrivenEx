import { useState, useEffect } from 'react';
import { Headset, PaperPlaneTilt } from '@phosphor-icons/react';
import { useChat } from '../../context/ChatContext';
import styles from './LiveChatFlow.module.css';

const AGENT = { name: 'Jordan M.', title: 'Support Specialist' };

export default function LiveChatFlow() {
  const { dispatch } = useChat();
  const [phase, setPhase] = useState('connecting'); // 'connecting' | 'typing' | 'active'
  const [inputValue, setInputValue] = useState('');

  // Auto-advance: connecting → typing → active
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('typing'), 1800);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase === 'typing') {
      const t2 = setTimeout(() => setPhase('active'), 2200);
      return () => clearTimeout(t2);
    }
  }, [phase]);

  function handleEnd() {
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        role: 'assistant',
        content: `Chat session ended. Is there anything else I can help you with?`,
        actionPills: ['Check for outages', 'Walk me through a fix', 'Return to home'],
      },
    });
  }

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.agentAvatar}>
          <Headset size={18} weight="fill" />
        </div>
        <div className={styles.agentInfo}>
          <div className={styles.agentName}>{AGENT.name} · {AGENT.title}</div>
          <div className={styles.agentStatus}>
            {phase !== 'connecting' && <span className={styles.statusDot} />}
            <span>{phase === 'connecting' ? 'Connecting…' : 'Active now'}</span>
          </div>
        </div>
        {phase === 'connecting' && (
          <span className={styles.waitBadge}>~4 min wait</span>
        )}
      </div>

      {/* Body */}
      {phase === 'connecting' ? (
        <div className={styles.connecting}>
          <div className={styles.spinner} />
          <p className={styles.connectingText}>Connecting you to a specialist…</p>
        </div>
      ) : (
        <div className={styles.body}>
          {phase === 'typing' && (
            <div className={styles.typingBubble}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          )}
          {phase === 'active' && (
            <div className={styles.agentBubble}>
              Hi! I'm {AGENT.name.split(' ')[0]}, a support specialist at Total Wireless. I can see you've been having signal issues — I have your account pulled up. Let me take a look and see what's going on.
            </div>
          )}
        </div>
      )}

      {/* Input row — only show when active */}
      {phase === 'active' && (
        <div className={styles.inputRow}>
          <input
            className={styles.input}
            placeholder="Type a message…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className={styles.sendBtn} aria-label="Send">
            <PaperPlaneTilt size={15} weight="fill" />
          </button>
        </div>
      )}

      {/* Footer */}
      {phase === 'active' && (
        <div className={styles.footer}>
          <button className={styles.endBtn} onClick={handleEnd}>End chat</button>
        </div>
      )}
    </div>
  );
}
