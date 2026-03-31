import styles from './Badge.module.css';

/**
 * Small status badge / tag.
 * variant: 'teal' | 'navy' | 'success' | 'warning' | 'critical' | 'subtle'
 */
export default function Badge({ variant = 'teal', children, className = '' }) {
  const cls = [styles.badge, styles[variant], className].filter(Boolean).join(' ');
  return <span className={cls}>{children}</span>;
}
