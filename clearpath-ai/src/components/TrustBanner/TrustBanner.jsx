import { Info } from '@phosphor-icons/react';
import { useChat } from '../../context/ChatContext';
import { useTranslation } from '../../i18n/useTranslation';
import styles from './TrustBanner.module.css';

export default function TrustBanner() {
  const { dispatch } = useChat();
  const { t } = useTranslation();

  return (
    <>
      {/* Desktop: side tab */}
      <button
        className={styles.sideTab}
        onClick={() => dispatch({ type: 'TOGGLE_TRANSPARENCY' })}
        aria-label={t('transparency.bannerLabel')}
      >
        <div className={styles.tabContent}>
          <Info size={16} weight="bold" />
          <span className={styles.tabLabel}>{t('transparency.bannerLabel')}</span>
        </div>
        <span className={styles.tabDesc}>{t('transparency.bannerDescriptor')}</span>
      </button>

      {/* Mobile: floating icon */}
      <button
        className={styles.mobileBtn}
        onClick={() => dispatch({ type: 'TOGGLE_TRANSPARENCY' })}
        aria-label={t('transparency.bannerLabel')}
      >
        <Info size={20} weight="bold" />
      </button>
    </>
  );
}
