import { Sparkle } from '@phosphor-icons/react';
import styles from './TypingIndicator.module.css';

export default function TypingIndicator() {
  return (
    <div className={styles.row}>
      <div className={styles.avatar}>
        <Sparkle size={16} weight="fill" />
      </div>
      <div className={styles.dots}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    </div>
  );
}
