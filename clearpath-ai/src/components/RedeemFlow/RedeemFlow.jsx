import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Star, CellSignalFull, Gift } from '@phosphor-icons/react';
import { useChat } from '../../context/ChatContext';
import styles from '../RefillFlow/RefillFlow.module.css';

const STEPS = ['select', 'confirm', 'processing', 'success'];
const REDEEM_POINTS = 1000;

const slideVariants = {
  enter:  { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0  },
  exit:   { opacity: 0, x: -40 },
};

export default function RedeemFlow() {
  const { state, dispatch } = useChat();
  const [step, setStep] = useState(0);
  const [showPostFlow, setShowPostFlow] = useState(false);
  const prevShowSMSModal = useRef(false);

  const account = state.persona?.account || {};
  const pts = account.rewardsPoints ?? 1000;
  const remaining = pts - REDEEM_POINTS;

  // Auto-advance processing → success
  useEffect(() => {
    if (STEPS[step] === 'processing') {
      const t = setTimeout(() => setStep(3), 1500);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Success → SMS modal
  useEffect(() => {
    if (STEPS[step] === 'success') {
      const t = setTimeout(() => {
        dispatch({ type: 'SHOW_SMS_MODAL', payload: { transactionType: 'refill' } });
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [step, dispatch]);

  // Show post-flow pills after SMS modal dismissed
  useEffect(() => {
    if (prevShowSMSModal.current && !state.showSMSModal && STEPS[step] === 'success') {
      const t = setTimeout(() => setShowPostFlow(true), 0);
      prevShowSMSModal.current = state.showSMSModal;
      return () => clearTimeout(t);
    }
    prevShowSMSModal.current = state.showSMSModal;
  }, [state.showSMSModal, step]);

  function handleReturnHome() {
    dispatch({ type: 'RESET_CHAT' });
  }

  return (
    <div className={styles.flowCard}>
      <AnimatePresence mode="wait">

        {/* Step 1: Select */}
        {STEPS[step] === 'select' && (
          <motion.div key="select" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <Gift size={20} weight="fill" className={styles.stepIcon} />
              <h3 className={styles.stepTitle}>Redeem Rewards Points</h3>
            </div>

            <div className={styles.planInfo}>
              <div className={styles.planRow}>
                <span className={styles.planLabel}>5 GB Data Add-On</span>
                <span className={styles.itemPrice} style={{ color: '#10b981' }}>FREE</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.planRow}>
                <span className={styles.itemName}>Points to redeem</span>
                <span className={styles.planLabel}>1,000 pts</span>
              </div>
              <div className={styles.planRow}>
                <span className={styles.itemName}>Points remaining after</span>
                <span className={styles.planLabel}>{remaining.toLocaleString()} pts</span>
              </div>
              <div className={styles.activationNote}>Activates instantly · No charge to your card</div>
            </div>

            <button className={styles.primaryBtn} onClick={() => setStep(1)}>
              Redeem — it's free
            </button>
          </motion.div>
        )}

        {/* Step 2: Confirm */}
        {STEPS[step] === 'confirm' && (
          <motion.div key="confirm" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <Star size={20} weight="fill" className={styles.stepIcon} />
              <h3 className={styles.stepTitle}>Confirm Redemption</h3>
            </div>

            <div className={styles.confirmDetails}>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>What you're getting</span>
                <span className={styles.confirmValue}>5 GB Data Add-On</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>Points used</span>
                <span className={styles.confirmValue}>1,000 pts</span>
              </div>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>Points remaining</span>
                <span className={styles.confirmValue}>{remaining.toLocaleString()} pts</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>Total charge</span>
                <span className={styles.confirmTotal} style={{ color: '#10b981' }}>$0.00 — FREE</span>
              </div>
            </div>

            <div className={styles.btnRow}>
              <button className={styles.secondaryBtn} onClick={() => setStep(0)}>Cancel</button>
              <button className={styles.primaryBtn} onClick={() => setStep(2)}>Confirm — it's free</button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Processing */}
        {STEPS[step] === 'processing' && (
          <motion.div key="processing" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className={`${styles.stepContent} ${styles.centered}`}>
            <div className={styles.spinner} />
            <h3 className={styles.processingTitle}>Applying your points…</h3>
            <p className={styles.processingSubtext}>Adding 5 GB to your account at no charge</p>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {STEPS[step] === 'success' && (
          <motion.div key="success" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className={`${styles.stepContent} ${styles.centered}`}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}>
              <CheckCircle size={48} weight="fill" className={styles.successIcon} />
            </motion.div>
            <h3 className={styles.successTitle}>5 GB Added — No Charge</h3>

            <div className={styles.successDetails}>
              <div className={styles.successRow}>
                <CellSignalFull size={14} weight="bold" />
                <span>5 GB added to {account.plan || 'your plan'}</span>
              </div>
              <div className={styles.successRow}>
                <Star size={14} weight="bold" />
                <span>1,000 points redeemed</span>
              </div>
              <div className={styles.successRow}>
                <span className={styles.successMeta}>{remaining.toLocaleString()} points remaining in your account</span>
              </div>
              <div className={styles.successRow}>
                <span className={styles.successMeta}>Confirmation sent to your phone on file</span>
              </div>
            </div>

            {showPostFlow && (
              <div className={styles.postFlowActions}>
                <div className={styles.postFlowPills}>
                  <button className={styles.postFlowPill} onClick={handleReturnHome}>Back to Home</button>
                </div>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
