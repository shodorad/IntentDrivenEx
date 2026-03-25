import { useChat } from '../../context/ChatContext';
import styles from './UserChip.module.css';

export default function UserChip() {
  const { state } = useChat();
  const { name, initials } = state.persona;

  return (
    <div className={styles.chip}>
      <span className={styles.name}>{name}</span>
      <div className={styles.avatarWrap}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.statusDot} />
      </div>
    </div>
  );
}
