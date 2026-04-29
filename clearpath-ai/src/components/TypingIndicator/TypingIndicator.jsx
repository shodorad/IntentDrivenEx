import { useEffect, useState } from 'react';
import { Sparkle } from '@phosphor-icons/react';
import styles from './TypingIndicator.module.css';

const MESSAGES = [
  'Reading your account…',
  'Checking your plan details…',
  'Analyzing your question…',
  'Finding the best options…',
  'Building your response…',
  'Looking at your history…',
  'Calculating the best fit…',
  'Almost there…',
];

export default function TypingIndicator() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.row}>
      <div className={styles.avatar}>
        <Sparkle size={16} weight="fill" />
      </div>
      <div className={styles.bubble}>
        <span className={styles.label}>ClearPath AI</span>
        <div className={styles.shimmer} />
        <span className={styles.stage} key={msgIdx}>{MESSAGES[msgIdx]}</span>
      </div>
    </div>
  );
}
