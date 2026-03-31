import { useState, useRef, useEffect } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { useChat } from '../../context/ChatContext';
import { PERSONA_LIST, PERSONAS } from '../../data/personas';
import styles from './UserChip.module.css';

export default function UserChip() {
  const { state, dispatch } = useChat();
  const p = state.persona;
  const initials = p.avatar || p.initials || '??';
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  const handleSelect = (personaId) => {
    const persona = PERSONAS[personaId];
    if (persona) {
      dispatch({ type: 'SET_PERSONA', payload: persona });
      dispatch({ type: 'RESET_CHAT' });
    }
    setIsOpen(false);
  };

  return (
    <div className={styles.wrap} ref={ref}>
      {/* Chip trigger: [Name] [Avatar] [Caret] */}
      <button
        className={styles.chip}
        onClick={() => setIsOpen((o) => !o)}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles.name}>{p.name}</span>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.statusDot} />
        </div>
        <CaretDown
          size={13}
          weight="bold"
          className={`${styles.caret} ${isOpen ? styles.caretOpen : ''}`}
        />
      </button>

      {/* Persona dropdown */}
      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          {PERSONA_LIST.map((persona) => {
            const [, descriptor] = persona.dropdownLabel.split(' — ');
            const isActive = persona.id === p.id;
            return (
              <button
                key={persona.id}
                role="option"
                aria-selected={isActive}
                className={`${styles.dropdownItem} ${isActive ? styles.dropdownItemActive : ''}`}
                onClick={() => handleSelect(persona.id)}
                type="button"
              >
                <span className={styles.dropdownName}>{persona.name}</span>
                {descriptor && (
                  <span className={styles.dropdownDesc}>{descriptor}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
