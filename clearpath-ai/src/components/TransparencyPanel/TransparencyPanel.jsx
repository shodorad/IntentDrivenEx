import { X, ShieldCheck } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../context/ChatContext';
import { useTranslation } from '../../i18n/useTranslation';
import styles from './TransparencyPanel.module.css';

export default function TransparencyPanel() {
  const { state, dispatch } = useChat();
  const { t } = useTranslation();

  const close = () => dispatch({ type: 'CLOSE_TRANSPARENCY' });
  const rules = t('transparency.rules');

  return (
    <AnimatePresence>
      {state.showTransparencyPanel && (
        <motion.div
          className={styles.overlay}
          onClick={close}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={styles.drawer}
            onClick={(e) => e.stopPropagation()}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <button
              className={styles.closeBtn}
              onClick={close}
              aria-label="Close"
            >
              <X size={20} weight="bold" />
            </button>

            <div className={styles.header}>
              <ShieldCheck size={32} weight="fill" className={styles.shieldIcon} />
              <h2>{t('transparency.panelHeader')}</h2>
            </div>

            <p className={styles.body}>{t('transparency.panelBody')}</p>

            <div className={styles.rulesSection}>
              <h3 className={styles.rulesHeader}>{t('transparency.rulesHeader')}</h3>
              <ol className={styles.rulesList}>
                {Array.isArray(rules) && rules.map((rule, i) => (
                  <li key={i}>
                    <span className={styles.ruleNum}>{i + 1}</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
