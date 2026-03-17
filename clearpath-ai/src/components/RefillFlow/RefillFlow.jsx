import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CreditCard, CellSignalFull, Receipt } from '@phosphor-icons/react';
import { useChat } from '../../context/ChatContext';
import { useTranslation } from '../../i18n/useTranslation';
import styles from './RefillFlow.module.css';

const STEPS = ['select', 'confirm', 'processing', 'success'];

export default function RefillFlow() {
  const { dispatch } = useChat();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  // Processing auto-advance
  useEffect(() => {
    if (STEPS[step] === 'processing') {
      const timer = setTimeout(() => setStep(3), 1800);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Success → trigger SMS modal after delay
  useEffect(() => {
    if (STEPS[step] === 'success') {
      const timer = setTimeout(() => {
        dispatch({ type: 'SHOW_SMS_MODAL' });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, dispatch]);

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className={styles.flowCard}>
      <AnimatePresence mode="wait">
        {/* ─── Step 1: Select ─── */}
        {STEPS[step] === 'select' && (
          <motion.div
            key="select"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className={styles.stepContent}
          >
            <div className={styles.stepHeader}>
              <CellSignalFull size={20} weight="fill" className={styles.stepIcon} />
              <h3 className={styles.stepTitle}>{t('refill.selectTitle')}</h3>
            </div>

            <div className={styles.planInfo}>
              <div className={styles.planRow}>
                <span className={styles.planLabel}>{t('refill.selectPlan')}</span>
                <span className={styles.planLine}>{t('refill.selectLine')}</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.planRow}>
                <span className={styles.itemName}>{t('refill.selectItem')}</span>
                <span className={styles.itemPrice}>{t('refill.selectPrice')}</span>
              </div>
              <div className={styles.activationNote}>{t('refill.selectActivation')}</div>
            </div>

            <button className={styles.primaryBtn} onClick={() => setStep(1)}>
              {t('refill.selectCta')}
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
              <CreditCard size={20} weight="fill" className={styles.stepIcon} />
              <h3 className={styles.stepTitle}>{t('refill.confirmTitle')}</h3>
            </div>

            <div className={styles.confirmDetails}>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>{t('refill.selectItem')}</span>
                <span className={styles.confirmValue}>{t('refill.selectPrice')}</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>{t('refill.confirmCharged')}</span>
                <span className={styles.confirmValue}>{t('refill.confirmCard')}</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>{t('refill.confirmTotal')}</span>
                <span className={styles.confirmTotal}>{t('refill.selectPrice')}</span>
              </div>
            </div>

            <div className={styles.btnRow}>
              <button className={styles.secondaryBtn} onClick={() => setStep(0)}>
                {t('refill.confirmCancel')}
              </button>
              <button className={styles.primaryBtn} onClick={() => setStep(2)}>
                {t('refill.confirmCta')}
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
            <h3 className={styles.processingTitle}>{t('refill.processingTitle')}</h3>
            <p className={styles.processingSubtext}>{t('refill.processingSubtext')}</p>
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
            <h3 className={styles.successTitle}>{t('refill.successTitle')}</h3>

            <div className={styles.successDetails}>
              <div className={styles.successRow}>
                <Receipt size={14} weight="bold" />
                <span>{t('refill.successPlan')}</span>
              </div>
              <div className={styles.successRow}>
                <CellSignalFull size={14} weight="bold" />
                <span>{t('refill.successBalance')}</span>
              </div>
              <div className={styles.successRow}>
                <span className={styles.successMeta}>{t('refill.successExpiry')}</span>
              </div>
              <div className={styles.successRow}>
                <span className={styles.successMeta}>{t('refill.successReceipt')}</span>
              </div>
              <div className={styles.successRow}>
                <span className={styles.rewardsTag}>{t('refill.successRewards')}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
