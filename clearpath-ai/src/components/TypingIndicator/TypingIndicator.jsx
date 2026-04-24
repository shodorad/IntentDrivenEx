import { Sparkle } from '@phosphor-icons/react';
import styles from './TypingIndicator.module.css';

export default function TypingIndicator({ stage }) {
  return (
    <div className={styles.row}>
      <div className={styles.avatar}>
        <Sparkle size={16} weight="fill" />
      </div>
      <div className={styles.bubble}>
        <div className={styles.dots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        {stage && <span className={styles.stage} key={stage}>{stage}</span>}
      </div>
    </div>
  );
}
