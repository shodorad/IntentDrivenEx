import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Globe, Star, CreditCard } from '@phosphor-icons/react';
import { useChat } from '../../context/ChatContext';
import { useTranslation } from '../../i18n/useTranslation';
import styles from './InternationalFlow.module.css';

const STEPS = ['catalog', 'confirm', 'processing', 'success'];

export default function InternationalFlow() {
  const { state, dispatch } = useChat();
  const { t } = useTranslation();

  // Derive top country from persona (e.g. Colombia for Ana) — falls back to "international"
  const intlCalls = state.persona?.account?.internationalCallsThisMonth || [];
  const topCountry = intlCalls[0]?.country || null;
  const [step, setStep] = useState(0);
  const [selectedAddon, setSelectedAddon] = useState(null);

  const addons = [
    {
      id: 'mexico',
      name: t('intl.mexicoName'),
      desc: t('intl.mexicoDesc'),
      price: '$10',
      unit: t('intl.perMonth'),
      badge: t('intl.recommended'),
      badgeType: 'recommended',
      countries: '2',
    },
    {
      id: 'latam',
      name: t('intl.latamName'),
      desc: t('intl.latamDesc'),
      price: '$20',
      unit: t('intl.perMonth'),
      badge: t('intl.popular'),
      badgeType: 'popular',
      countries: '18',
    },
    {
      id: 'daypass',
      name: t('intl.daypassName'),
      desc: t('intl.daypassDesc'),
      price: '$5',
      unit: t('intl.perDay'),
      badge: t('intl.travel'),
      badgeType: 'travel',
      countries: '140+',
    },
  ];

  useEffect(() => {
    if (STEPS[step] === 'processing') {
      const timer = setTimeout(() => setStep(3), 1800);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Success → trigger SMS modal after short delay
  useEffect(() => {
    if (STEPS[step] === 'success') {
      const timer = setTimeout(() => {
        dispatch({ type: 'SHOW_SMS_MODAL', payload: { transactionType: 'international' } });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, dispatch]);

  const handleSelect = (addon) => {
    setSelectedAddon(addon);
    setStep(1);
  };

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className={styles.flowCard}>
      <AnimatePresence mode="wait">
        {/* ─── Step 1: Add-on Catalog ─── */}
        {STEPS[step] === 'catalog' && (
          <motion.div
            key="catalog"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className={styles.stepContent}
          >
            <div className={styles.stepHeader}>
              <Globe size={20} weight="fill" className={styles.stepIcon} />
              <h3 className={styles.stepTitle}>{t('intl.catalogTitle')}</h3>
            </div>

            <div className={styles.signalNote}>
              <span>
                {topCountry
                  ? `Based on your recent calls to ${topCountry}, we recommend the Global Calling Card add-on.`
                  : t('intl.signalNote')}
              </span>
            </div>

            <div className={styles.addonList}>
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className={`${styles.addonCard} ${addon.badgeType === 'recommended' ? styles.featured : ''}`}
                >
                  <div className={styles.addonHeader}>
                    <span className={`${styles.badge} ${styles[addon.badgeType]}`}>{addon.badge}</span>
                    <div className={styles.addonPrice}>
                      <span className={styles.priceAmt}>{addon.price}</span>
                      <span className={styles.priceUnit}>{addon.unit}</span>
                    </div>
                  </div>
                  <div className={styles.addonName}>{addon.name}</div>
                  <div className={styles.addonDesc}>{addon.desc}</div>
                  <div className={styles.addonFooter}>
                    <span className={styles.countriesHint}>{addon.countries} {t('intl.countries')}</span>
                    <button className={styles.addBtn} onClick={() => handleSelect(addon)}>
                      {t('intl.addFor')} {addon.price}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Rewards redemption hint */}
            <div className={styles.rewardsHint}>
              <Star size={14} weight="fill" />
              <span>{t('intl.rewardsHint')}</span>
            </div>
          </motion.div>
        )}

        {/* ─── Step 2: Confirm ─── */}
        {STEPS[step] === 'confirm' && selectedAddon && (
          <motion.div
            key="confirm"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className={styles.stepContent}
          >
            <div className={styles.stepHeader}>
              <CreditCard size={20} weight="fill" className={styles.stepIcon} />
              <h3 className={styles.stepTitle}>{t('intl.confirmTitle')}</h3>
            </div>

            <div className={styles.confirmDetails}>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>{t('intl.addon')}</span>
                <span className={styles.confirmValue}>{selectedAddon.name}</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>{t('intl.price')}</span>
                <span className={styles.confirmTotal}>{selectedAddon.price}{selectedAddon.unit === t('intl.perDay') ? '/day' : '/mo'}</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>{t('intl.chargedTo')}</span>
                <span className={styles.confirmValue}>Visa ····4821</span>
              </div>
            </div>

            <div className={styles.btnRow}>
              <button className={styles.secondaryBtn} onClick={() => setStep(0)}>
                {t('intl.back')}
              </button>
              <button className={styles.primaryBtn} onClick={() => setStep(2)}>
                {t('intl.confirmCta')}
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── Step 3: Processing ─── */}
        {STEPS[step] === 'processing' && (
          <motion.div
            key="processing"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className={`${styles.stepContent} ${styles.centered}`}
          >
            <div className={styles.spinner} />
            <h3 className={styles.processingTitle}>{t('intl.processingTitle')}</h3>
            <p className={styles.processingSubtext}>{t('intl.processingSubtext')}</p>
          </motion.div>
        )}

        {/* ─── Step 4: Success ─── */}
        {STEPS[step] === 'success' && selectedAddon && (
          <motion.div
            key="success"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className={`${styles.stepContent} ${styles.centered}`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
            >
              <CheckCircle size={48} weight="fill" className={styles.successIcon} />
            </motion.div>
            <h3 className={styles.successTitle}>{t('intl.successTitle')}</h3>
            <div className={styles.successDetails}>
              <div className={styles.successRow}>{selectedAddon.name} — {t('intl.activated')}</div>
              {topCountry && (
                <div className={styles.successRow}>Covers {topCountry} and 200+ countries</div>
              )}
              <div className={styles.successRow}>{selectedAddon.price} charged to {state.persona?.account?.savedCard || 'card on file'}</div>
              <div className={styles.successMeta}>{t('intl.successNote')}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
