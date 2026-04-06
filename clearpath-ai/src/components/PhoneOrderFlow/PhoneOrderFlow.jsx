import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Package, Truck, Star } from '@phosphor-icons/react';
import { useChat } from '../../context/ChatContext';
import Pill from '../ui/Pill/Pill';
import styles from './PhoneOrderFlow.module.css';

const STEPS = ['confirm', 'processing', 'success'];

export default function PhoneOrderFlow({ orderData = {} }) {
  const { state, dispatch } = useChat();
  const { item = 'your new phone', price = '', free = false, card = 'card on file', rewards = null } = orderData;
  const [step, setStep] = useState(0);
  const [showPostFlow, setShowPostFlow] = useState(false);
  const prevShowSMSModal = useRef(false);

  // Auto-advance: processing → success after 1.5s
  useEffect(() => {
    if (STEPS[step] === 'processing') {
      const timer = setTimeout(() => setStep(2), 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Success: trigger SMS modal after 1.5s
  useEffect(() => {
    if (STEPS[step] === 'success') {
      const timer = setTimeout(() => {
        dispatch({ type: 'SHOW_SMS_MODAL', payload: { transactionType: 'phone', item } });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, dispatch, item]);

  // Show post-flow pills after SMS modal is dismissed
  useEffect(() => {
    if (prevShowSMSModal.current && !state.showSMSModal && STEPS[step] === 'success') {
      const timer = setTimeout(() => setShowPostFlow(true), 0);
      prevShowSMSModal.current = state.showSMSModal;
      return () => clearTimeout(timer);
    }
    prevShowSMSModal.current = state.showSMSModal;
  }, [state.showSMSModal, step]);

  function handleReturnHome() {
    dispatch({ type: 'RESET_CHAT' });
  }

  function handleNewQuestion() {
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        role: 'assistant',
        content: "What else can I help you with?",
        actionPills: ['Check plan options', 'Manage account', "That's all, thanks"],
      },
    });
    setShowPostFlow(false);
  }

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className={styles.flowCard}>
      <AnimatePresence mode="wait">

        {/* Confirm */}
        {STEPS[step] === 'confirm' && (
          <motion.div
            key="confirm"
            variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.3 }}
            className={styles.stepContent}
          >
            <h3 className={styles.stepTitle}>Confirm your order</h3>
            <div className={styles.confirmDetails}>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>Phone</span>
                <span className={styles.confirmValue}>{item}</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>Price</span>
                <span className={styles.confirmValue}>{free ? 'FREE' : price}</span>
              </div>
              {rewards && (
                <>
                  <div className={styles.divider} />
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmLabel}>Rewards applied</span>
                    <span className={styles.confirmValue}>{rewards}</span>
                  </div>
                </>
              )}
              <div className={styles.divider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>Card</span>
                <span className={styles.confirmValue}>{card}</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>Ships</span>
                <span className={styles.confirmValue}>2–3 business days</span>
              </div>
            </div>
            <div className={styles.btnRow}>
              <button className={styles.secondaryBtn} onClick={() => dispatch({ type: 'END_FLOW' })}>
                Go back
              </button>
              <button className={styles.primaryBtn} onClick={() => setStep(1)}>
                Place order
              </button>
            </div>
          </motion.div>
        )}

        {/* Processing */}
        {STEPS[step] === 'processing' && (
          <motion.div
            key="processing"
            variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.3 }}
            className={`${styles.stepContent} ${styles.centered}`}
          >
            <div className={styles.spinner} />
            <h3 className={styles.processingTitle}>Placing your order…</h3>
            <p className={styles.processingSubtext}>Verifying payment and reserving your {item}</p>
          </motion.div>
        )}

        {/* Success */}
        {STEPS[step] === 'success' && (
          <motion.div
            key="success"
            variants={slideVariants}
            initial="enter" animate="center" exit="exit"
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

            <h3 className={styles.successTitle}>Order placed!</h3>
            <p className={styles.successSub}>{item} is on its way.</p>

            <div className={styles.successDetails}>
              <div className={styles.successRow}>
                <Package size={14} weight="bold" />
                <span>{item} — <strong>{free ? 'FREE' : price}</strong></span>
              </div>
              <div className={styles.successRow}>
                <Truck size={14} weight="bold" />
                <span>Ships in 2–3 business days</span>
              </div>
              {!free && (
                <div className={styles.successRow}>
                  <Star size={14} weight="bold" />
                  <span>2,450 rewards points applied</span>
                </div>
              )}
              <div className={styles.successMeta}>Tracking number sent to your number on file.</div>
            </div>

            {showPostFlow && (
              <div className={styles.postFlowActions}>
                <div className={styles.postFlowPills}>
                  <Pill onClick={handleReturnHome}>Return to home</Pill>
                </div>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
