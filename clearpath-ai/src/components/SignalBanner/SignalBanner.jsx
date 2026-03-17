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
        initial={{ opacity: 0, scaleX: 0.6, scaleY: 0.8 }}
        animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
        exit={{ opacity: 0, scaleX: 0.6, scaleY: 0.8 }}
        transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={`${styles.iconRing} ${colorClass}`}>
          <Icon size={16} weight="bold" className={styles.icon} />
        </div>
        <div className={styles.body}>
          <div className={styles.title}>{t(`signal.${signalKey}.headline`)}</div>
          <div className={styles.meta}>{t(`signal.${signalKey}.subtext`)}</div>
        </div>
        <button className={`${styles.cta} ${colorClass}`} onClick={() => onAction?.(banner)}>
          {t(`signal.${signalKey}.cta`)}
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
