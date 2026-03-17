import { motion, AnimatePresence } from 'framer-motion';
import { Warning, Lightning, CurrencyDollar } from '@phosphor-icons/react';
import { useChat } from '../../context/ChatContext';
import { useTranslation } from '../../i18n/useTranslation';
import styles from './SignalBanner.module.css';

const ICONS = {
  urgent: Warning,
  'smart-tip': Lightning,
  savings: CurrencyDollar,
};

export default function SignalBanner({ onAction }) {
  const { state } = useChat();
  const { t } = useTranslation();
  const banner = state.signalBanner;

  if (!banner) return null;

  const Icon = ICONS[banner.type] || Warning;
  const signalKey = banner.signalKey || 'urgent';
  const colorClass = styles[banner.color] || styles.red;

  return (
    <AnimatePresence>
      <motion.div
        className={`${styles.banner} ${colorClass}`}
        initial={{ opacity: 0, y: -12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
      >
        <div className={`${styles.accent} ${colorClass}`} />
        <div className={styles.body}>
          <div className={styles.labelRow}>
            <Icon size={14} weight="bold" className={styles.icon} />
            <span className={styles.label}>{t(`signal.${signalKey}.label`)}</span>
          </div>
          <div className={styles.headline}>{t(`signal.${signalKey}.headline`)}</div>
          <div className={styles.subtext}>{t(`signal.${signalKey}.subtext`)}</div>
        </div>
        <button className={`${styles.cta} ${colorClass}`} onClick={() => onAction?.(banner)}>
          {t(`signal.${signalKey}.cta`)}
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
