import Pill from '../ui/Pill/Pill';
import styles from './ActionPills.module.css';

export default function ActionPills({ pills, onSelect }) {
  if (!pills || pills.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      {pills.map((pill, i) => (
        <Pill key={i} onClick={() => onSelect(pill)}>
          {pill}
        </Pill>
      ))}
    </div>
  );
}
