import { useState } from 'react';
import styles from './PasswordGate.module.css';

const CORRECT_PASSWORD = 'rdv@2026';
const SESSION_KEY = 'clearpath_auth';

function checkUrlPassword() {
  const params = new URLSearchParams(window.location.search);
  return params.get('pwd') === CORRECT_PASSWORD || params.get('pass') === CORRECT_PASSWORD;
}

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') return true;
    if (checkUrlPassword()) {
      sessionStorage.setItem(SESSION_KEY, '1');
      return true;
    }
    return false;
  });
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  if (unlocked) return children;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === CORRECT_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setUnlocked(true);
    } else {
      setError(true);
      setShake(true);
      setInput('');
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.card} ${shake ? styles.shake : ''}`}>
        <div className={styles.logo}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L4 7v7c0 6.08 4.27 11.75 10 13.14C19.73 25.75 24 20.08 24 14V7L14 2z" fill="#00B5AD" opacity="0.15"/>
            <path d="M14 2L4 7v7c0 6.08 4.27 11.75 10 13.14C19.73 25.75 24 20.08 24 14V7L14 2z" stroke="#00B5AD" strokeWidth="1.5" fill="none"/>
            <path d="M10 14l3 3 5-5" stroke="#00B5AD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={styles.logoText}>ClearPath AI</span>
        </div>

        <h2 className={styles.title}>Protected Demo</h2>
        <p className={styles.subtitle}>Enter the access password to continue</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            placeholder="Password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            autoFocus
          />
          {error && <p className={styles.errorMsg}>Incorrect password. Try again.</p>}
          <button type="submit" className={styles.btn}>
            Unlock
          </button>
        </form>

        <p className={styles.footer}>Radiant Digital · Internal Preview</p>
      </div>
    </div>
  );
}
