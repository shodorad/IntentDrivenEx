import { useRef, useState } from 'react';
import { PaperPlaneRight, Paperclip, Microphone } from '@phosphor-icons/react';
import { useChat } from '../../context/ChatContext';
import { useChatActions } from '../../hooks/useChat';
import { useTranslation } from '../../i18n/useTranslation';
import styles from './InputBar.module.css';

export default function InputBar() {
  const { state, dispatch } = useChat();
  const { sendMessage, startChat } = useChatActions();
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const textareaRef = useRef(null);
  const blurTimerRef = useRef(null);

  const canSend = text.trim().length > 0 && !state.isLoading;

  const handleSend = () => {
    if (!canSend) return;
    const msg = text.trim();
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    if (state.mode === 'landing') {
      startChat(msg);
    } else {
      sendMessage(msg);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    // Auto-grow
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  };

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <button
          className={styles.iconBtn}
          aria-label="Attach file"
          title="Attach file"
        >
          <Paperclip size={18} weight="regular" />
        </button>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            clearTimeout(blurTimerRef.current);
            dispatch({ type: 'SET_INPUT_FOCUSED', payload: true });
          }}
          onBlur={() => {
            // Delay so pill onClick fires before we hide the pills
            blurTimerRef.current = setTimeout(() => {
              dispatch({ type: 'SET_INPUT_FOCUSED', payload: false });
            }, 200);
          }}
          placeholder={t('inputPlaceholder')}
          rows={1}
          disabled={state.isLoading}
        />
        <button
          className={styles.iconBtn}
          aria-label="Voice input"
          title="Voice input"
        >
          <Microphone size={18} weight="regular" />
        </button>
        <button
          className={`${styles.sendBtn} ${canSend ? styles.active : ''}`}
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
        >
          <PaperPlaneRight size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
}
