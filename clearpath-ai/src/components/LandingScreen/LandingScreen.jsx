import { useEffect } from 'react';
import { Sparkle } from '@phosphor-icons/react';
import * as Icons from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { INTENT_PILLS } from '../../data/products';
import { useChat } from '../../context/ChatContext';
import { useChatActions } from '../../hooks/useChat';
import { useTranslation } from '../../i18n/useTranslation';
import { DEFAULT_SIGNAL, SIGNAL_BANNERS } from '../../data/signalBanners';
import SignalBanner from '../SignalBanner/SignalBanner';
import MiniDashboard from '../MiniDashboard/MiniDashboard';
import styles from './LandingScreen.module.css';

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function LandingScreen() {
  const { dispatch } = useChat();
  const { startChat } = useChatActions();
  const { t } = useTranslation();

  // Set default signal banner on mount
  useEffect(() => {
    dispatch({ type: 'SET_SIGNAL_BANNER', payload: DEFAULT_SIGNAL });
  }, [dispatch]);

  // Keyboard shortcuts to cycle signal banners (1=refill, 2=upgrade, 3=international)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      const signals = { '1': 'urgent', '2': 'smartTip', '3': 'savings' };
      if (signals[e.key]) {
        dispatch({ type: 'SET_SIGNAL_BANNER', payload: SIGNAL_BANNERS[signals[e.key]] });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dispatch]);

  const handleSignalAction = (banner) => {
    dispatch({ type: 'CLEAR_SIGNAL_BANNER' });
    // For refill flow, send a specific prompt
    if (banner.flowId === 'refill') {
      startChat('I need to refill my data');
    } else if (banner.flowId === 'upgrade') {
      startChat('I want to upgrade my plan');
    } else if (banner.flowId === 'international') {
      startChat('I want to add international calling');
    }
  };

  const headlineParts = t('headline').split('\n');

  return (
    <div className={styles.landing}>
      <motion.div
        className={styles.brand}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className={styles.logoMark}>
          <Sparkle size={26} weight="fill" />
        </div>
        <span className={styles.logoText}>ClearPath AI</span>
      </motion.div>

      <motion.h1
        className={styles.headline}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {headlineParts[0]}<br />{headlineParts[1]}
      </motion.h1>

      <motion.p
        className={styles.subhead}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {t('subhead')}
      </motion.p>

      <motion.div
        className={styles.signalWrap}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <SignalBanner onAction={handleSignalAction} />
      </motion.div>

      <motion.div
        style={{ width: '100%', maxWidth: 480, marginBottom: 12 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <MiniDashboard />
      </motion.div>

      <motion.div
        className={styles.pillsGrid}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {INTENT_PILLS.map((pill) => {
          const IconComponent = Icons[pill.icon];
          return (
            <motion.button
              key={pill.id}
              className={styles.pill}
              onClick={() => startChat(pill.prompt)}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className={styles.pillIcon}>
                {IconComponent && <IconComponent size={18} weight="regular" />}
              </span>
              <span>{t(`pills.${pill.id}`)}</span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
