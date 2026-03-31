import { useEffect } from 'react';
import * as Icons from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { INTENT_PILLS } from '../../data/products';
import { useChat } from '../../context/ChatContext';
import { useChatActions } from '../../hooks/useChat';
import { useTranslation } from '../../i18n/useTranslation';
import { PERSONAS } from '../../data/personas';
import SignalBanner from '../SignalBanner/SignalBanner';
import MiniDashboard from '../MiniDashboard/MiniDashboard';
import { AlertCardGrid } from '../AlertCard/AlertCard';
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

// CTA label by intentCategory
const CTA_BY_INTENT = {
  refill: 'Quick Refill',
  activate: 'Activate Now',
  support: 'Get Help',
  upgrade: 'See Upgrade Options',
  addon: 'Add International',
  compare: 'Compare Plans',
  phone: 'Browse Phones',
};


// Static browse pills shown in the "Explore" category when input is focused
const BROWSE_PILLS = [
  { label: 'Show me all plans',         prompt: 'Show me all available plans.' },
  { label: 'Show me the latest phones', prompt: 'Show me the latest phones available.' },
  { label: 'Show me current deals',     prompt: 'Show me all current deals and promotions.' },
  { label: 'My rewards & points',       prompt: 'Tell me about my rewards points and how to use them.' },
];

// Extra pills per intentCategory to fill 2×4 grid (always ends with "Show me everything")
const EXTRA_PILLS = {
  refill: [
    { label: 'Why does this keep happening?', labelEs: '¿Por qué sigue pasando esto?',   prompt: 'Why do I keep running out of data every month?' },
    { label: 'What are my options?',           labelEs: '¿Cuáles son mis opciones?',       prompt: 'What options do I have for my data situation?' },
    { label: 'I need more hotspot',            labelEs: 'Necesito más hotspot',             prompt: 'I need more mobile hotspot data.' },
    { label: 'Talk to someone',                labelEs: 'Hablar con alguien',               prompt: 'I want to talk to a customer support agent.' },
    { label: 'Show me everything',             labelEs: 'Mostrar todo',                     prompt: 'Show me all available plans and options.' },
  ],
  activate: [
    { label: 'Tell me about Total Wireless',   labelEs: 'Cuéntame sobre Total Wireless',   prompt: 'What is Total Wireless and how does it work?' },
    { label: 'What plans are available?',       labelEs: '¿Qué planes hay disponibles?',    prompt: 'Show me all available plans for a new customer.' },
    { label: 'Can I keep my number?',           labelEs: '¿Puedo conservar mi número?',     prompt: 'Can I keep my existing phone number when I switch?' },
    { label: 'How long does it take?',          labelEs: '¿Cuánto tiempo tarda?',           prompt: 'How long does SIM activation take?' },
    { label: 'Show me everything',              labelEs: 'Mostrar todo',                     prompt: 'Show me all available plans and options.' },
  ],
  support: [
    { label: 'Check for outages',              labelEs: 'Revisar cortes de servicio',       prompt: 'Are there any network outages in my area?' },
    { label: 'Try a self-fix',                 labelEs: 'Intentar una solución propia',     prompt: 'Walk me through some steps to fix my connectivity issue.' },
    { label: 'Dropped calls',                  labelEs: 'Llamadas cortadas',                prompt: 'I have been experiencing dropped calls.' },
    { label: 'Talk to someone',                labelEs: 'Hablar con alguien',               prompt: 'I want to talk to a customer support agent.' },
    { label: 'Show me everything',             labelEs: 'Mostrar todo',                     prompt: 'Show me all available support and plan options.' },
  ],
  upgrade: [
    { label: 'Tell me about Unlimited',        labelEs: 'Cuéntame sobre Ilimitado',        prompt: 'What does the Unlimited plan include?' },
    { label: 'Is there a cheaper option?',     labelEs: '¿Hay una opción más económica?',  prompt: 'What is the most affordable option for my situation?' },
    { label: 'What is included?',              labelEs: '¿Qué incluye?',                   prompt: 'What features are included in each plan?' },
    { label: 'Keep my current plan',           labelEs: 'Mantener mi plan actual',          prompt: 'I want to keep my current plan for now.' },
    { label: 'Show me everything',             labelEs: 'Mostrar todo',                     prompt: 'Show me all available plans and options.' },
  ],
  addon: [
    { label: 'What other add-ons exist?',      labelEs: '¿Qué otros complementos hay?',    prompt: 'What add-ons are available for my plan?' },
    { label: 'How does billing work?',         labelEs: '¿Cómo funciona la facturación?',  prompt: 'How is add-on billing handled?' },
    { label: 'Is this worth it?',              labelEs: '¿Vale la pena?',                  prompt: 'Is the international calling add-on worth it for my usage?' },
    { label: 'See all add-ons',                labelEs: 'Ver todos los complementos',       prompt: 'Show me all available add-ons.' },
    { label: 'Show me everything',             labelEs: 'Mostrar todo',                     prompt: 'Show me all available plans and options.' },
  ],
  compare: [
    { label: 'Calculate 4-line pricing',       labelEs: 'Calcular precio de 4 líneas',     prompt: 'Calculate the total price for 4 lines on each plan.' },
    { label: 'What is the difference?',        labelEs: '¿Cuál es la diferencia?',         prompt: 'What is the difference between the plans?' },
    { label: 'Lock in my rate',                labelEs: 'Fijar mi tarifa',                  prompt: 'How does the 5-year price guarantee work?' },
    { label: 'Talk to an expert',              labelEs: 'Hablar con un experto',            prompt: 'I want to speak with someone to help me choose a plan.' },
    { label: 'Show me everything',             labelEs: 'Mostrar todo',                     prompt: 'Show me all available plans and options.' },
  ],
  phone: [
    { label: "What's the best deal right now?", prompt: 'What is the best phone deal right now?' },
    { label: 'Free phones available?', prompt: 'Are there any free phones available?' },
    { label: 'Compare iPhone vs Samsung', prompt: 'Help me compare iPhone vs Samsung options.' },
    { label: 'Talk to someone', prompt: 'I want to talk to a customer support agent.' },
    { label: 'Show me everything', prompt: 'Show me all available plans and options.' },
  ],
};

function getPersonaPills(persona, lang) {
  const es = lang === 'es';
  const suggested = (persona.suggestedActions || []).map((a) => ({
    label: es && a.labelEs ? a.labelEs : a.label,
    prompt: a.label, // always English prompt so AI/flow routing works correctly
  }));
  const category = persona.intentCategory || 'refill';
  const extras = (EXTRA_PILLS[category] || EXTRA_PILLS.refill).map((p) => ({
    label: es && p.labelEs ? p.labelEs : p.label,
    prompt: p.prompt,
  }));
  const combined = [...suggested, ...extras];
  return combined.slice(0, 8);
}

export default function LandingScreen() {
  const { state, dispatch } = useChat();
  const { startChat } = useChatActions();
  const { t, lang } = useTranslation();

  // Clear signal banner whenever persona changes (signals are now shown in the alerts grid)
  useEffect(() => {
    dispatch({ type: 'CLEAR_SIGNAL_BANNER' });
  }, [state.persona, dispatch]);

  // Keyboard shortcuts: 1=us-001, 2=us-005, 3=us-009
  useEffect(() => {
    const PERSONA_MAP = { '1': 'us-001', '2': 'us-005', '3': 'us-009' };
    const handleKey = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      if (!PERSONA_MAP[e.key]) return;
      const persona = PERSONAS[PERSONA_MAP[e.key]];
      if (persona) {
        dispatch({ type: 'SET_PERSONA', payload: persona });
        dispatch({ type: 'RESET_CHAT' });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dispatch]);

  const handleSignalAction = (banner) => {
    dispatch({ type: 'CLEAR_SIGNAL_BANNER' });
    const flowPrompts = {
      refill: 'I need to refill my data',
      upgrade: 'I want to upgrade my plan',
      international: 'I want to add international calling',
      addon: 'I want to add international calling',
      activate: 'I need to activate my SIM',
      support: 'I am having connectivity issues',
      compare: 'I want to compare plans for my family',
    };
    const prompt = flowPrompts[banner.flowId] || 'I need help with my account';
    startChat(prompt);
  };

  const hour = new Date().getHours();
  const greetingLabel = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';
  const firstName = (state.persona?.name || 'there').split(' ')[0].toUpperCase();

  // Get persona-specific pills — use only first 4 as personalized; browse is static
  const personalizedPills = getPersonaPills(state.persona, lang).slice(0, 4);
  const browsePills = BROWSE_PILLS;

  return (
    <div className={styles.landing}>
      {/* Greeting */}
      <motion.div
        className={styles.greeting}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <span className={styles.greetingDash}>—</span>
        <span className={styles.greetingText}>{greetingLabel}, {firstName}</span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        className={styles.headline}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {t('headline').split('\n').map((line, i) => (
          i === 0
            ? <span key={i}>{line}<br /></span>
            : <span key={i} className={styles.headlineAccent}>{line}</span>
        ))}
      </motion.h1>

      <motion.div
        className={styles.sectionGroup}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <span className={styles.sectionLabel}>{t('landing.sectionAlerts')}</span>
        <AlertCardGrid
          signals={state.persona?.signals || []}
          persona={state.persona}
          onCta={(prompt) => startChat(prompt)}
        />
        <SignalBanner onAction={handleSignalAction} />
      </motion.div>

      <motion.div
        className={styles.sectionGroup}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <span className={styles.sectionLabel}>{t('landing.sectionAccount')}</span>
        <MiniDashboard />
      </motion.div>

      {state.inputFocused && (
        <motion.div
          className={`${styles.pillsGrid} ${styles.pillsGridFocused}`}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Category 1: Contextual — For You */}
          <div className={styles.pillCategory}>
            <span className={`${styles.pillCategoryLabel} ${styles.pillCategoryLabelFor}`}>For You</span>
            <div className={styles.pillCategoryGrid}>
              {personalizedPills.map((pill, idx) => {
                const knownPill = INTENT_PILLS.find((ip) => ip.label === pill.label || ip.prompt === pill.prompt);
                const IconComponent = knownPill ? Icons[knownPill.icon] : Icons['ArrowRight'];
                return (
                  <motion.button
                    key={idx}
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
                    <span>{pill.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className={styles.pillDivider}>
            <span className={styles.pillDividerText}>or explore</span>
          </div>

          {/* Category 2: Browse / Explore */}
          <div className={styles.pillCategory}>
            <span className={`${styles.pillCategoryLabel} ${styles.pillCategoryLabelExplore}`}>Explore</span>
            <div className={styles.pillCategoryGrid}>
              {browsePills.map((pill, idx) => (
                <motion.button
                  key={idx}
                  className={`${styles.pill} ${styles.pillExplore}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => startChat(pill.prompt)}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className={styles.pillIcon}>
                    <Icons.MagnifyingGlass size={18} weight="regular" />
                  </span>
                  <span>{pill.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
