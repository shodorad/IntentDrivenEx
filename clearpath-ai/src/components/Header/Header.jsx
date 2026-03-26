import { useChat } from '../../context/ChatContext';
import { useChatActions } from '../../hooks/useChat';
import { PERSONAS, PERSONA_LIST } from '../../data/personas';
import UserChip from '../UserChip/UserChip';
import styles from './Header.module.css';

export default function Header() {
  const { state, dispatch } = useChat();
  const { resetChat } = useChatActions();
  const lang = state.language || 'en';

  const toggleLanguage = (newLang) => {
    dispatch({ type: 'SET_LANGUAGE', payload: newLang });
  };

  const handlePersonaChange = (e) => {
    const persona = PERSONAS[e.target.value];
    if (persona) {
      dispatch({ type: 'SET_PERSONA', payload: persona });
      dispatch({ type: 'RESET_CHAT' });
    }
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
          {/* Demo persona switcher */}
          <select
            className={styles.personaSelect}
            value={state.persona?.id || 'us-001'}
            onChange={handlePersonaChange}
            title="Switch demo persona"
          >
            {PERSONA_LIST.map((p) => (
              <option key={p.id} value={p.id}>
                {p.dropdownLabel}
              </option>
            ))}
          </select>

          <div className={styles.divider} />

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
