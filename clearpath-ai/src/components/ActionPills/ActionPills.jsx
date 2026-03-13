import styles from './ActionPills.module.css';

export default function ActionPills({ pills, onSelect }) {
  if (!pills || pills.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      {pills.map((pill, i) => (
        <button
          key={i}
          className={styles.pill}
          onClick={() => onSelect(pill)}
        >
          {pill}
        </button>
      ))}
    </div>
  );
}
