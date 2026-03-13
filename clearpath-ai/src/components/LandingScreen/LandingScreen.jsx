import { Sparkle } from '@phosphor-icons/react';
import * as Icons from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { INTENT_PILLS } from '../../data/products';
import { useChatActions } from '../../hooks/useChat';
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
  const { startChat } = useChatActions();

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
        Tell us what&apos;s going on.<br />We&apos;ll figure out the rest.
      </motion.h1>

      <motion.p
        className={styles.subhead}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        Hi. I am ClearPath AI. I am going to ask you a couple of quick questions about what you are dealing with, and then I will find the option that makes the most sense for your situation. I will always show you the most affordable path first. Ready to get started?
      </motion.p>

      <div className={styles.spacer} />

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
              <span>{pill.label}</span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
