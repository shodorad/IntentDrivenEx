import { Globe, MagnifyingGlass, ShoppingCart } from '@phosphor-icons/react';
import { useChatActions } from '../../hooks/useChat';
import styles from './Header.module.css';

export default function Header() {
  const { resetChat } = useChatActions();

  return (
    <header className={styles.header}>
      {/* Utility bar */}
      <div className={styles.utilityBar}>
        <div className={styles.utilityInner}>
          <button className={styles.utilityLink}>
            <Globe size={14} weight="regular" />
            <span>Español</span>
          </button>
          <div className={styles.utilityRight}>
            <a href="#" className={styles.utilityLink}>
              <span>Find a store</span>
            </a>
            <a href="#" className={styles.utilityLink}>
              <span>Help & support</span>
            </a>
            <span className={styles.utilityText}>611611</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className={styles.mainNav}>
        <div className={styles.navInner}>
          <div className={styles.navLeft}>
            <a
              href="#"
              className={styles.logo}
              onClick={(e) => { e.preventDefault(); resetChat(); }}
            >
              <img
                src="/tw-logo.svg"
                alt="Total Wireless"
                className={styles.logoImg}
              />
            </a>
            <nav className={styles.navLinks}>
              <a href="#" className={styles.navLink}>Shop</a>
              <a href="#" className={styles.navLink}>Deals</a>
              <a href="#" className={styles.navLink}>Pay</a>
              <a href="#" className={styles.navLink}>Activate</a>
              <a href="#" className={styles.navLink}>Why Total Wireless</a>
            </nav>
          </div>
          <div className={styles.navRight}>
            <a href="#" className={styles.navLinkAccent}>Total Rewards</a>
            <a href="#" className={styles.navLink}>Log in</a>
            <button className={styles.iconBtn} aria-label="Cart">
              <ShoppingCart size={20} weight="regular" />
            </button>
            <button className={styles.iconBtn} aria-label="Search">
              <MagnifyingGlass size={20} weight="regular" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
