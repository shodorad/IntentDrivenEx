import styles from './Button.module.css';

/**
 * Brand-compliant button.
 * variant: 'primary' | 'teal' | 'outline' | 'danger' | 'ghost'
 * size:    'default' | 'sm'
 */
export default function Button({
  variant = 'primary',
  size = 'default',
  children,
  onClick,
  disabled,
  type = 'button',
  className = '',
  ...props
}) {
  const cls = [
    styles.btn,
    styles[variant],
    size === 'sm' ? styles.sm : '',
    disabled ? styles.disabled : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
