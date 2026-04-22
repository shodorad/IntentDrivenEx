import { useChat } from '../context/ChatContext';
import { translations } from './translations';

export function useTranslation() {
  const { state } = useChat();
  const lang = state.language || 'en';
  const strings = translations[lang] || translations.en;

  function t(key) {
    const keys = key.split('.');
    let value = strings;
    for (const k of keys) {
      if (value == null) return key;
      value = value[k];
    }
    return value ?? key;
  }

  return { t, lang };
}
