import { X, ShieldCheck } from '@phosphor-icons/react';
import { useChat } from '../../context/ChatContext';
import { TRANSPARENCY } from '../../data/transparencyContent';
import styles from './TransparencyPanel.module.css';

export default function TransparencyPanel() {
  const { state, dispatch } = useChat();

  if (!state.showTransparencyPanel) return null;

  return (
    <div className={styles.overlay} onClick={() => dispatch({ type: 'CLOSE_TRANSPARENCY' })}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeBtn}
          onClick={() => dispatch({ type: 'CLOSE_TRANSPARENCY' })}
          aria-label="Close"
        >
          <X size={20} weight="bold" />
        </button>

        <div className={styles.header}>
          <ShieldCheck size={32} weight="fill" className={styles.shieldIcon} />
          <h2>{TRANSPARENCY.panelHeader}</h2>
        </div>

        <p className={styles.body}>{TRANSPARENCY.panelBody}</p>

        <div className={styles.rulesSection}>
          <h3 className={styles.rulesHeader}>{TRANSPARENCY.rulesHeader}</h3>
          <ol className={styles.rulesList}>
            {TRANSPARENCY.rules.map((rule, i) => (
              <li key={i}>
                <span className={styles.ruleNum}>{i + 1}</span>
                <span>{rule}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
