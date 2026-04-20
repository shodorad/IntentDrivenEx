import { useState } from 'react';
import { Gear, Robot, List, Lightning, X } from '@phosphor-icons/react';
import { useChat } from '../../context/ChatContext';
import styles from './AdminPanel.module.css';

export default function AdminPanel() {
  const { state, dispatch } = useChat();
  const [open, setOpen] = useState(false);

  const isLLM = state.chatMode === 'llm';

  const toggle = (mode) => {
    dispatch({ type: 'SET_CHAT_MODE', payload: mode });
  };

  return (
    <div className={styles.wrap}>
      {open ? (
        <div className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <Gear size={16} weight="bold" />
              <span>Admin Controls</span>
            </div>
            <button className={styles.closeBtn} onClick={() => setOpen(false)}>
              <X size={14} weight="bold" />
            </button>
          </div>

          <div className={styles.section}>
            <p className={styles.label}>Chat Mode</p>
            <div className={styles.toggleRow}>
              <button
                className={`${styles.modeBtn} ${!isLLM ? styles.active : ''}`}
                onClick={() => toggle('static')}
              >
                <List size={14} weight="bold" />
                Static
              </button>
              <button
                className={`${styles.modeBtn} ${isLLM ? styles.active : ''}`}
                onClick={() => toggle('llm')}
              >
                <Robot size={14} weight="bold" />
                LLM
              </button>
            </div>
          </div>

          <div className={styles.meta}>
            <div className={styles.metaRow}>
              <Lightning size={12} weight="fill" className={isLLM ? styles.metaIconActive : styles.metaIcon} />
              <span>{isLLM ? 'gemini-1.5-flash · Google AI' : 'intentRouter · staticData'}</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaDim}>Fallback: static intentRouter</span>
            </div>
          </div>
        </div>
      ) : (
        <button className={styles.fab} onClick={() => setOpen(true)} title="Admin Controls">
          <Gear size={18} weight="bold" />
          <span className={`${styles.modeBadge} ${isLLM ? styles.modeBadgeLLM : ''}`}>
            {isLLM ? 'LLM' : 'Static'}
          </span>
        </button>
      )}
    </div>
  );
}
