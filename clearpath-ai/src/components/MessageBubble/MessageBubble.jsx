import { Sparkle } from '@phosphor-icons/react';
import styles from './MessageBubble.module.css';

export default function MessageBubble({ role, content }) {
  if (role === 'user') {
    return (
      <div className={styles.userRow}>
        <div className={styles.userBubble}>{content}</div>
      </div>
    );
  }

  return (
    <div className={styles.aiRow}>
      <div className={styles.avatar}>
        <Sparkle size={16} weight="fill" />
      </div>
      <div className={styles.aiContent}>
        <span className={styles.aiLabel}>ClearPath AI</span>
        <div className={styles.aiText}>{content}</div>
      </div>
    </div>
  );
}
