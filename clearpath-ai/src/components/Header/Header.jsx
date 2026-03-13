import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <svg viewBox="0 0 200 28" className={styles.logoSvg} aria-label="Total Wireless">
            <text x="0" y="22" fill="#FFFFFF" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="20" letterSpacing="-0.5">
              Total Wireless
            </text>
          </svg>
        </div>
      </div>
    </header>
  );
}
