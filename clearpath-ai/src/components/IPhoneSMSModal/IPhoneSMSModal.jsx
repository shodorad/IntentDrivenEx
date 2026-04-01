import { X } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../context/ChatContext';
import { useTranslation } from '../../i18n/useTranslation';
import styles from './IPhoneSMSModal.module.css';

// Expiry date ~30 days from today
function getExpiryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function IPhoneSMSModal() {
  const { state, dispatch } = useChat();
  const { t } = useTranslation();

  const dismiss = () => dispatch({ type: 'HIDE_SMS_MODAL' });

  // Derive context-aware message from transaction type
  const txType = state.smsModalData?.transactionType || 'refill';
  const txItem = state.smsModalData?.item || 'your new phone';

  const SMS_MESSAGES = {
    refill: `Your $15 data refill is confirmed. 5 GB added. New balance updated. Expires ${getExpiryDate()}. Reply STOP to opt out.`,
    phone: `Order confirmed! Your ${txItem} ships in 2–3 business days. We'll text you a tracking number once it's on the way.`,
    upgrade: `Your plan has been upgraded to Total 5G Unlimited. Unlimited data is now active. Disney+ activation email is on its way. Reply STOP to opt out.`,
    international: `Your Global Calling Card has been activated. International calls are now covered. Manage add-ons anytime in your account. Reply STOP to opt out.`,
    activation: `Your Total Wireless SIM is now active! Welcome to the network. Plan: Total Base 5G Unlimited — $20/mo. Expires ${getExpiryDate()}. Reply STOP to opt out.`,
  };

  const smsMessage = SMS_MESSAGES[txType] || SMS_MESSAGES.refill;

  return (
    <AnimatePresence>
      {state.showSMSModal && (
        <motion.div
          className={styles.overlay}
          onClick={dismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className={styles.iphoneFrame}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 60, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          >
            {/* Dynamic Island */}
            <div className={styles.dynamicIsland} />

            {/* Status bar */}
            <div className={styles.statusBar}>
              <span className={styles.time}>9:41</span>
              <div className={styles.statusIcons}>
                <span className={styles.signal}>●●●●○</span>
                <span className={styles.wifi}>WiFi</span>
                <span className={styles.battery}>■■■</span>
              </div>
            </div>

            {/* Messages header */}
            <div className={styles.messagesHeader}>
              <div className={styles.backArrow}>‹</div>
              <div className={styles.senderInfo}>
                <div className={styles.senderAvatar}>
                  <span>TW</span>
                </div>
                <div className={styles.senderName}>{t('sms.sender')}</div>
              </div>
              <div className={styles.headerSpacer} />
            </div>

            {/* Message area */}
            <div className={styles.messageArea}>
              <div className={styles.timestamp}>Today 9:41 AM</div>
              <div className={styles.smsBubble}>
                {smsMessage}
              </div>
            </div>

            {/* iMessage input bar */}
            <div className={styles.inputBar}>
              <div className={styles.plusBtn}>+</div>
              <div className={styles.fakeInput}>Text Message</div>
              <div className={styles.sendArrow}>↑</div>
            </div>

            {/* Home indicator */}
            <div className={styles.homeIndicator} />

            {/* Close button */}
            <button className={styles.closeBtn} onClick={dismiss} aria-label="Close">
              <X size={16} weight="bold" />
            </button>
          </motion.div>

          {/* Caption below phone */}
          <motion.p
            className={styles.caption}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t('sms.caption')}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
