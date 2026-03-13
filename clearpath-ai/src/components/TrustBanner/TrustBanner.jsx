import { Info } from '@phosphor-icons/react';
import { useChat } from '../../context/ChatContext';
import { TRANSPARENCY } from '../../data/transparencyContent';
import styles from './TrustBanner.module.css';

export default function TrustBanner() {
  const { dispatch } = useChat();

  return (
    <>
      {/* Desktop: side tab */}
      <button
        className={styles.sideTab}
        onClick={() => dispatch({ type: 'TOGGLE_TRANSPARENCY' })}
        aria-label="How ClearPath AI works"
      >
        <div className={styles.tabContent}>
          <Info size={16} weight="bold" />
          <span className={styles.tabLabel}>{TRANSPARENCY.bannerLabel}</span>
        </div>
        <span className={styles.tabDesc}>{TRANSPARENCY.bannerDescriptor}</span>
      </button>

      {/* Mobile: floating icon */}
      <button
        className={styles.mobileBtn}
        onClick={() => dispatch({ type: 'TOGGLE_TRANSPARENCY' })}
        aria-label="How ClearPath AI works"
      >
        <Info size={20} weight="bold" />
      </button>
    </>
  );
}
