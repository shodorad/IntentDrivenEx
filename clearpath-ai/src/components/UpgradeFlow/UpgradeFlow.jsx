import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Crown, ShieldCheck, FilmStrip } from '@phosphor-icons/react';
import { useChat } from '../../context/ChatContext';
import { useTranslation } from '../../i18n/useTranslation';
import styles from './UpgradeFlow.module.css';

const STEPS = ['compare', 'confirm', 'processing', 'success'];

export default function UpgradeFlow() {
  const { dispatch } = useChat();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (STEPS[step] === 'processing') {
      const timer = setTimeout(() => setStep(3), 1800);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className={styles.flowCard}>
      <AnimatePresence mode="wait">
        {/* ─── Step 1: Plan Comparison ─── */}
        {STEPS[step] === 'compare' && (
          <motion.div
            key="compare"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className={styles.stepContent}
          >
            <div className={styles.stepHeader}>
              <Crown size={20} weight="fill" className={styles.stepIcon} />
              <h3 className={styles.stepTitle}>{t('upgrade.compareTitle')}</h3>
            </div>

            <div className={styles.plansGrid}>
              {/* Current Plan */}
              <div className={styles.planCard}>
                <div className={styles.planTag}>{t('upgrade.currentTag')}</div>
                <div className={styles.planName}>{t('upgrade.currentPlan')}</div>
                <div className={styles.planPrice}>$40<span>/mo</span></div>
                <ul className={styles.planFeatures}>
                  <li>5 GB high-speed data</li>
                  <li>Unlimited talk & text</li>
                  <li>No hotspot</li>
                </ul>
              </div>

              {/* Recommended Plan */}
              <div className={`${styles.planCard} ${styles.recommended}`}>
                <div className={`${styles.planTag} ${styles.recTag}`}>{t('upgrade.recommendedTag')}</div>
                <div className={styles.planName}>{t('upgrade.unlimitedPlan')}</div>
                <div className={styles.planPrice}>$50<span>/mo</span></div>
                <ul className={styles.planFeatures}>
                  <li className={styles.highlight}>Unlimited high-speed data</li>
                  <li>10 GB hotspot</li>
                  <li className={styles.highlight}>Disney+ included</li>
                </ul>
                <div className={styles.guarantee}>
                  <ShieldCheck size={14} weight="fill" />
                  <span>{t('upgrade.priceGuarantee')}</span>
                </div>
              </div>
            </div>

            <button className={styles.primaryBtn} onClick={() => setStep(1)}>
              {t('upgrade.switchCta')}
            </button>
          </motion.div>
        )}

        {/* ─── Step 2: Confirm ─── */}
        {STEPS[step] === 'confirm' && (
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
              <ArrowRight size={20} weight="bold" className={styles.stepIcon} />
              <h3 className={styles.stepTitle}>{t('upgrade.confirmTitle')}</h3>
            </div>

            <div className={styles.confirmDetails}>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>{t('upgrade.changeTo')}</span>
                <span className={styles.confirmValue}>{t('upgrade.unlimitedPlan')}</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>{t('upgrade.newPrice')}</span>
                <span className={styles.confirmTotal}>$50/mo</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>{t('upgrade.effective')}</span>
                <span className={styles.confirmValue}>{t('upgrade.effectiveDate')}</span>
              </div>
            </div>

            <div className={styles.bonusNote}>
              <FilmStrip size={16} weight="fill" />
              <span>{t('upgrade.disneyNote')}</span>
            </div>

            <div className={styles.btnRow}>
              <button className={styles.secondaryBtn} onClick={() => setStep(0)}>
                {t('upgrade.back')}
              </button>
              <button className={styles.primaryBtn} onClick={() => setStep(2)}>
                {t('upgrade.confirmCta')}
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
            <h3 className={styles.processingTitle}>{t('upgrade.processingTitle')}</h3>
            <p className={styles.processingSubtext}>{t('upgrade.processingSubtext')}</p>
          </motion.div>
        )}

        {/* ─── Step 4: Success ─── */}
        {STEPS[step] === 'success' && (
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
            <h3 className={styles.successTitle}>{t('upgrade.successTitle')}</h3>

            <div className={styles.successDetails}>
              <div className={styles.successRow}>{t('upgrade.successPlan')}</div>
              <div className={styles.successRow}>{t('upgrade.successData')}</div>
              <div className={styles.successRow}>{t('upgrade.successHotspot')}</div>
              <div className={styles.disneyActivation}>
                <FilmStrip size={18} weight="fill" />
                <span>{t('upgrade.disneyActivation')}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
