import { useChat } from '../../context/ChatContext';
import styles from './MiniDashboard.module.css';

export default function MiniDashboard() {
  const { state } = useChat();
  const persona = state.persona;

  const used = parseFloat(persona.dataTotal) - parseFloat(persona.dataRemaining);
  const pct = Math.round((used / parseFloat(persona.dataTotal)) * 100);

  return (
    <div className={styles.dashboard}>
      <div className={styles.left}>
        <span className={styles.planName}>{persona.planName}</span>
        <div className={styles.barWrap}>
          <div className={styles.bar}>
            <div className={styles.fill} style={{ width: `${pct}%` }} />
          </div>
          <span className={styles.dataLabel}>
            {persona.dataRemaining} GB left of {persona.dataTotal} GB
          </span>
        </div>
      </div>
      <div className={styles.right}>
        <span className={styles.renewLabel}>Renews</span>
        <span className={styles.renewDate}>{persona.renewalDate}</span>
      </div>
    </div>
  );
}
