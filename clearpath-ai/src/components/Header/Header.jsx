import { useChat } from '../../context/ChatContext';
import { useChatActions } from '../../hooks/useChat';
import UserChip from '../UserChip/UserChip';
import styles from './Header.module.css';

export default function Header() {
  const { state, dispatch } = useChat();
  const { resetChat } = useChatActions();
  const lang = state.language || 'en';

  const toggleLanguage = (newLang) => {
    dispatch({ type: 'SET_LANGUAGE', payload: newLang });
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a
          href="#"
          className={styles.logo}
          onClick={(e) => { e.preventDefault(); resetChat(); }}
        >
          <img
            src="/tw-logo.svg"
            alt="Total Wireless"
            className={styles.logoImg}
          />
        </a>

        <div className={styles.right}>
          <div className={styles.langToggle}>
            <button
              className={`${styles.langBtn} ${lang === 'en' ? styles.langActive : ''}`}
              onClick={() => toggleLanguage('en')}
            >
              EN
            </button>
            <button
              className={`${styles.langBtn} ${lang === 'es' ? styles.langActive : ''}`}
              onClick={() => toggleLanguage('es')}
            >
              ES
            </button>
          </div>

          <div className={styles.divider} />

          <UserChip />
        </div>
      </div>
    </header>
  );
}
