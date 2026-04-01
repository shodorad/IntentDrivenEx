import Pill from '../ui/Pill/Pill';
import { useChat } from '../../context/ChatContext';
import styles from './ActionPills.module.css';

export default function ActionPills({ pills, onSelect }) {
  const { dispatch } = useChat();
  if (!pills || pills.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      {pills.map((pill, i) => {
        // Support both string format (legacy) and object format { label, intent }
        const label  = typeof pill === 'string' ? pill : pill.label;
        const intent = typeof pill === 'string' ? null  : pill.intent;

        return (
          <Pill
            key={i}
            onClick={() => {
              if (intent) dispatch({ type: 'SET_INTENT', payload: intent });
              onSelect(label, intent);
            }}
          >
            {label}
          </Pill>
        );
      })}
    </div>
  );
}
