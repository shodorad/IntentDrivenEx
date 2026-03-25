import { useEffect } from 'react';
import { Sparkle } from '@phosphor-icons/react';
import * as Icons from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { INTENT_PILLS } from '../../data/products';
import { useChat } from '../../context/ChatContext';
import { useChatActions } from '../../hooks/useChat';
import { useTranslation } from '../../i18n/useTranslation';
import { DEFAULT_SIGNAL, SIGNAL_BANNERS } from '../../data/signalBanners';
import { PERSONAS } from '../../context/ChatContext';
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
  const { state, dispatch } = useChat();
  const { startChat } = useChatActions();
  const { t } = useTranslation();

  // Set default signal banner on mount
  useEffect(() => {
    dispatch({ type: 'SET_SIGNAL_BANNER', payload: DEFAULT_SIGNAL });
  }, [dispatch]);

  // Keyboard shortcuts: 1=Maria/urgent, 2=James/upgrade, 3=Ana/international
  useEffect(() => {
    const SIGNAL_MAP = { '1': 'urgent', '2': 'smartTip', '3': 'savings' };
    const PERSONA_MAP = { '1': 'us-001', '2': 'us-006', '3': 'us-007' };

    const handleKey = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      if (!SIGNAL_MAP[e.key]) return;
      dispatch({ type: 'SET_SIGNAL_BANNER', payload: SIGNAL_BANNERS[SIGNAL_MAP[e.key]] });
      dispatch({ type: 'SET_PERSONA', payload: PERSONAS[PERSONA_MAP[e.key]] });
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
        className={styles.dashboardWrap}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <MiniDashboard />
      </motion.div>

      {state.inputFocused && <div className={styles.pillsBackdrop} />}

      <motion.div
        className={`${styles.pillsGrid} ${state.inputFocused ? styles.pillsGridFocused : ''}`}
        variants={containerVariants}
        initial="hidden"
        animate={state.inputFocused ? 'show' : 'hidden'}
        style={{ pointerEvents: state.inputFocused ? 'auto' : 'none' }}
      >
        {INTENT_PILLS.map((pill) => {
          const IconComponent = Icons[pill.icon];
          return (
            <motion.button
              key={pill.id}
              className={styles.pill}
              onMouseDown={(e) => e.preventDefault()}
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
