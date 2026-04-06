import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CreditCard, ArrowsClockwise } from '@phosphor-icons/react';
import { useChat } from '../../context/ChatContext';
// Reuse RefillFlow styles — identical card/step/button design
import styles from '../RefillFlow/RefillFlow.module.css';

const STEPS = ['confirm', 'processing', 'success'];

export default function UpgradeFlow() {
  const { state, dispatch } = useChat();
  const [step, setStep] = useState(0);
  const [showPostFlow, setShowPostFlow] = useState(false);
  const prevShowSMSModal = useRef(false);

  const account = state.persona?.account || {};
  const savedCard = account.savedCard || 'Visa ••••4291';

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  // Processing auto-advance after 1.5s
  useEffect(() => {
    if (STEPS[step] === 'processing') {
      const timer = setTimeout(() => setStep(2), 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Success → trigger SMS modal with upgrade transaction type
  useEffect(() => {
    if (STEPS[step] === 'success') {
      const timer = setTimeout(() => {
        dispatch({ type: 'SHOW_SMS_MODAL', payload: { transactionType: 'upgrade' } });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, dispatch]);

  // Show post-flow actions after SMS modal is dismissed
  useEffect(() => {
    if (prevShowSMSModal.current && !state.showSMSModal && STEPS[step] === 'success') {
      const t = setTimeout(() => setShowPostFlow(true), 0);
      prevShowSMSModal.current = state.showSMSModal;
      return () => clearTimeout(t);
    }
    prevShowSMSModal.current = state.showSMSModal;
  }, [state.showSMSModal, step]);

  function handleReturnHome() {
    dispatch({ type: 'CLEAR_INTENT' });
    dispatch({ type: 'RESET_CHAT' });
  }

  return (
    <div className={styles.flowCard}>
      <AnimatePresence mode="wait">

        {/* ─── Step 1: Confirm upgrade details ─── */}
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
              <h3 className={styles.stepTitle}>Plan Upgrade</h3>
            </div>

            <div className={styles.confirmDetails}>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>New plan</span>
                <span className={styles.confirmValue}>Total 5G Unlimited</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>Monthly rate</span>
                <span className={styles.confirmValue}>$55/mo</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>Prorated today</span>
                <span className={styles.confirmValue}>~$7.14 (14 days left)</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>Charged to</span>
                <span className={styles.confirmValue}>{savedCard}</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>Due today</span>
                <span className={styles.confirmTotal}>$7.14</span>
              </div>
            </div>

            <div className={styles.btnRow}>
              <button className={styles.secondaryBtn} onClick={handleReturnHome}>
                Cancel
              </button>
              <button className={styles.primaryBtn} onClick={() => setStep(1)}>
                Confirm Upgrade
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── Step 2: Processing ─── */}
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
            <h3 className={styles.processingTitle}>Upgrading your plan…</h3>
            <p className={styles.processingSubtext}>Switching to Total 5G Unlimited</p>
          </motion.div>
        )}

        {/* ─── Step 3: Success ─── */}
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
            <h3 className={styles.successTitle}>You're on Unlimited!</h3>

            <div className={styles.successDetails}>
              <div className={styles.successRow}>
                <ArrowsClockwise size={14} weight="bold" />
                <span>Plan: Total 5G Unlimited</span>
              </div>
              <div className={styles.successRow}>
                <CheckCircle size={14} weight="fill" />
                <span>Unlimited data — active now</span>
              </div>
              <div className={styles.successRow}>
                <CheckCircle size={14} weight="fill" />
                <span>Disney+ activation email on its way</span>
              </div>
              <div className={styles.successRow}>
                <span className={styles.successMeta}>Renews at $55/mo on your next cycle</span>
              </div>
            </div>

            {showPostFlow && (
              <div className={styles.postFlowActions}>
                <div className={styles.postFlowPills}>
                  <button className={styles.postFlowPill} onClick={handleReturnHome}>
                    Return home
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
