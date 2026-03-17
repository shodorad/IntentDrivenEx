import { X } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../context/ChatContext';
import { useTranslation } from '../../i18n/useTranslation';
import styles from './IPhoneSMSModal.module.css';

export default function IPhoneSMSModal() {
  const { state, dispatch } = useChat();
  const { t } = useTranslation();

  const dismiss = () => dispatch({ type: 'HIDE_SMS_MODAL' });

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
                {t('sms.message')}
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
