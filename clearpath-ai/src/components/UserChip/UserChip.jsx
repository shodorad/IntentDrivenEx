import { useChat } from '../../context/ChatContext';
import styles from './UserChip.module.css';

export default function UserChip() {
  const { state } = useChat();
  const p = state.persona;
  // Support both `avatar` (new full persona shape) and `initials` (legacy)
  const initials = p.avatar || p.initials || '??';

  return (
    <div className={styles.chip}>
      <span className={styles.name}>{p.name}</span>
      <div className={styles.avatarWrap}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.statusDot} />
      </div>
    </div>
  );
}
