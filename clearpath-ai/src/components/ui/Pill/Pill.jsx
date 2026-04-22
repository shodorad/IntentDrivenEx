import styles from './Pill.module.css';

/**
 * Quick-reply / chip pill.
 * active: boolean — navy filled state
 */
export default function Pill({ active = false, children, onClick, className = '' }) {
  const cls = [styles.pill, active ? styles.active : '', className].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
