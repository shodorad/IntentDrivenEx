import { Sparkle } from '@phosphor-icons/react';
import * as Icons from '@phosphor-icons/react';
import { INTENT_PILLS } from '../../data/products';
import { useChatActions } from '../../hooks/useChat';
import styles from './LandingScreen.module.css';

export default function LandingScreen() {
  const { startChat } = useChatActions();

  return (
    <div className={styles.landing}>
      <div className={styles.brand}>
        <div className={styles.logoMark}>
          <Sparkle size={28} weight="fill" />
        </div>
        <span className={styles.logoText}>ClearPath AI</span>
      </div>

      <h1 className={styles.headline}>
        Tell us what's going on.<br />We'll figure out the rest.
      </h1>

      <p className={styles.subhead}>
        Hi. I am ClearPath AI. I am going to ask you a couple of quick questions about what you are dealing with, and then I will find the option that makes the most sense for your situation. I will always show you the most affordable path first. Ready to get started?
      </p>

      <div className={styles.pillsGrid}>
        {INTENT_PILLS.map((pill) => {
          const IconComponent = Icons[pill.icon];
          return (
            <button
              key={pill.id}
              className={styles.pill}
              onClick={() => startChat(pill.prompt)}
            >
              {IconComponent && <IconComponent size={20} weight="regular" />}
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
