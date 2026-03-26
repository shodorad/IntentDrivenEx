import { motion, AnimatePresence } from 'framer-motion';
import { Warning, Lightning, CurrencyDollar, Info } from '@phosphor-icons/react';
import { useChat } from '../../context/ChatContext';
import { useTranslation } from '../../i18n/useTranslation';
import styles from './SignalBanner.module.css';

const ICONS = {
  urgent: Warning,
  'smart-tip': Lightning,
  savings: CurrencyDollar,
  info: Info,
};

export default function SignalBanner({ onAction }) {
  const { state } = useChat();
  const { t } = useTranslation();
  const banner = state.signalBanner;

  if (!banner) return null;

  const Icon = ICONS[banner.type] || Warning;
  const colorClass = styles[banner.color] || styles.red;

  // Support direct content (from persona.signals) OR translation keys (legacy)
  const headline = banner.headline || t(`signal.${banner.signalKey}.headline`);
  const subtext = banner.subtext || t(`signal.${banner.signalKey}.subtext`);
  // CTA: prefer flowId-based i18n lookup so ES toggle works; fall back to stored string
  const ctaLabel = (banner.flowId ? t(`signal.cta.${banner.flowId}`) : null)
    || banner.cta
    || t(`signal.${banner.signalKey}.cta`);

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
          <div className={styles.title}>{headline}</div>
          <div className={styles.meta}>{subtext}</div>
        </div>
        <button className={`${styles.cta} ${colorClass}`} onClick={() => onAction?.(banner)}>
          {ctaLabel}
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
