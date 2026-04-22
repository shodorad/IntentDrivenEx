import * as Icons from '@phosphor-icons/react';
import { ArrowLeft } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { INTENT_PILLS } from '../../data/products';

const BROWSE_PILLS = [
  { label: 'Show me all plans',         prompt: 'Show me all available plans.',                          intent: 'browse_plans'   },
  { label: 'Show me the latest phones', prompt: 'Show me the latest phones available.',                  intent: 'browse_phones'  },
  { label: 'Show me current deals',     prompt: 'Show me all current deals and promotions.',             intent: 'browse_deals'   },
  { label: 'My rewards & points',       prompt: 'Tell me about my rewards points and how to use them.',  intent: 'browse_rewards' },
];
import { useChat } from '../../context/ChatContext';
import { useChatActions } from '../../hooks/useChat';

import { useTranslation } from '../../i18n/useTranslation';
import styles from './PillOverlay.module.css';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

const EXTRA_PILLS = {
  refill: [
    { label: 'Why does this keep happening?', labelEs: '¿Por qué sigue pasando esto?',   prompt: 'Why do I keep running out of data every month?',           intent: 'diagnose_usage'  },
    { label: 'What are my options?',           labelEs: '¿Cuáles son mis opciones?',       prompt: 'What options do I have for my data situation?',            intent: 'show_options'    },
    { label: 'I need more hotspot',            labelEs: 'Necesito más hotspot',             prompt: 'I need more mobile hotspot data.',                         intent: 'hotspot_inquiry' },
    { label: 'Talk to someone',                labelEs: 'Hablar con alguien',               prompt: 'I want to talk to a customer support agent.',              intent: 'talk_to_agent'   },
    { label: 'Show me everything',             labelEs: 'Mostrar todo',                     prompt: 'Show me all available plans and options.',                 intent: 'browse_all'      },
  ],
  activate: [
    { label: 'Tell me about Total Wireless',   labelEs: 'Cuéntame sobre Total Wireless',   prompt: 'What is Total Wireless and how does it work?',             intent: 'info_inquiry'    },
    { label: 'What plans are available?',       labelEs: '¿Qué planes hay disponibles?',    prompt: 'Show me all available plans for a new customer.',          intent: 'browse_plans'    },
    { label: 'Can I keep my number?',           labelEs: '¿Puedo conservar mi número?',     prompt: 'Can I keep my existing phone number when I switch?',       intent: 'port_inquiry'    },
    { label: 'How long does it take?',          labelEs: '¿Cuánto tiempo tarda?',           prompt: 'How long does SIM activation take?',                      intent: 'activation_time' },
    { label: 'Show me everything',              labelEs: 'Mostrar todo',                     prompt: 'Show me all available plans and options.',                 intent: 'browse_all'      },
  ],
  support: [
    { label: 'Check for outages',              labelEs: 'Revisar cortes de servicio',       prompt: 'Are there any network outages in my area?',               intent: 'check_outages'   },
    { label: 'Try a self-fix',                 labelEs: 'Intentar una solución propia',     prompt: 'Walk me through some steps to fix my connectivity issue.', intent: 'diagnose_usage'  },
    { label: 'Dropped calls',                  labelEs: 'Llamadas cortadas',                prompt: 'I have been experiencing dropped calls.',                 intent: 'dropped_calls'   },
    { label: 'Talk to someone',                labelEs: 'Hablar con alguien',               prompt: 'I want to talk to a customer support agent.',              intent: 'talk_to_agent'   },
    { label: 'Show me everything',             labelEs: 'Mostrar todo',                     prompt: 'Show me all available support and plan options.',          intent: 'browse_all'      },
  ],
  upgrade: [
    { label: 'Tell me about Unlimited',        labelEs: 'Cuéntame sobre Ilimitado',        prompt: 'What does the Unlimited plan include?',                   intent: 'plan_change'     },
    { label: 'Is there a cheaper option?',     labelEs: '¿Hay una opción más económica?',  prompt: 'What is the most affordable option for my situation?',    intent: 'browse_plans'    },
    { label: 'What is included?',              labelEs: '¿Qué incluye?',                   prompt: 'What features are included in each plan?',                intent: 'plan_features'   },
    { label: 'Keep my current plan',           labelEs: 'Mantener mi plan actual',          prompt: 'I want to keep my current plan for now.',                 intent: 'keep_plan'       },
    { label: 'Show me everything',             labelEs: 'Mostrar todo',                     prompt: 'Show me all available plans and options.',                 intent: 'browse_all'      },
  ],
  addon: [
    { label: 'What other add-ons exist?',      labelEs: '¿Qué otros complementos hay?',    prompt: 'What add-ons are available for my plan?',                 intent: 'browse_addons'   },
    { label: 'How does billing work?',         labelEs: '¿Cómo funciona la facturación?',  prompt: 'How is add-on billing handled?',                          intent: 'billing_inquiry' },
    { label: 'Is this worth it?',              labelEs: '¿Vale la pena?',                  prompt: 'Is the international calling add-on worth it for my usage?', intent: 'value_inquiry' },
    { label: 'See all add-ons',                labelEs: 'Ver todos los complementos',       prompt: 'Show me all available add-ons.',                          intent: 'browse_addons'   },
    { label: 'Show me everything',             labelEs: 'Mostrar todo',                     prompt: 'Show me all available plans and options.',                 intent: 'browse_all'      },
  ],
  compare: [
    { label: 'Calculate 4-line pricing',       labelEs: 'Calcular precio de 4 líneas',     prompt: 'Calculate the total price for 4 lines on each plan.',     intent: 'browse_plans'    },
    { label: 'What is the difference?',        labelEs: '¿Cuál es la diferencia?',         prompt: 'What is the difference between the plans?',               intent: 'plan_features'   },
    { label: 'Lock in my rate',                labelEs: 'Fijar mi tarifa',                  prompt: 'How does the 5-year price guarantee work?',               intent: 'plan_change'     },
    { label: 'Talk to an expert',              labelEs: 'Hablar con un experto',            prompt: 'I want to speak with someone to help me choose a plan.',  intent: 'talk_to_agent'   },
    { label: 'Show me everything',             labelEs: 'Mostrar todo',                     prompt: 'Show me all available plans and options.',                 intent: 'browse_all'      },
  ],
  phone: [
    { label: "What's the best deal right now?", prompt: 'What is the best phone deal right now?',          intent: 'browse_deals'  },
    { label: 'Free phones available?',           prompt: 'Are there any free phones available?',            intent: 'browse_phones' },
    { label: 'Compare iPhone vs Samsung',        prompt: 'Help me compare iPhone vs Samsung options.',      intent: 'browse_phones' },
    { label: 'Talk to someone',                  prompt: 'I want to talk to a customer support agent.',     intent: 'talk_to_agent' },
    { label: 'Show me everything',               prompt: 'Show me all available plans and options.',        intent: 'browse_all'    },
  ],
};

function getPersonaPills(persona, lang) {
  const es = lang === 'es';
  const suggested = (persona.suggestedActions || []).map((a) => ({
    label: es && a.labelEs ? a.labelEs : a.label,
    prompt: a.label,
    intent: a.action,
  }));
  const category = persona.intentCategory || 'refill';
  const extras = (EXTRA_PILLS[category] || EXTRA_PILLS.refill).map((p) => ({
    label: es && p.labelEs ? p.labelEs : p.label,
    prompt: p.prompt,
    intent: p.intent,
  }));
  return [...suggested, ...extras].slice(0, 4);
}

export default function PillOverlay() {
  const { state, dispatch } = useChat();
  const { startChat, sendMessage, resetChat } = useChatActions();
  const { t, lang } = useTranslation();

  if (!state.inputFocused) return null;

  const isChat = state.mode === 'chatting';
  const personalizedPills = getPersonaPills(state.persona, lang);
  const browsePills = BROWSE_PILLS;

  const handlePillClick = (pill) => {
    dispatch({ type: 'SET_INPUT_FOCUSED', payload: false });
    if (pill.intent) dispatch({ type: 'SET_INTENT', payload: pill.intent });
    if (isChat) {
      sendMessage(pill.prompt, pill.intent);
    } else {
      startChat(pill.prompt, pill.intent);
    }
  };

  return (
    <>
      <div
        className={styles.backdrop}
        onMouseDown={() => dispatch({ type: 'SET_INPUT_FOCUSED', payload: false })}
      />
    <motion.div
      className={styles.overlay}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Back to Home — only shown in chat mode */}
      {isChat && (
        <div className={styles.overlayHeader}>
          <button
            className={styles.backBtn}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { dispatch({ type: 'SET_INPUT_FOCUSED', payload: false }); resetChat(); }}
          >
            <ArrowLeft size={13} weight="bold" />
            <span>Back to Home</span>
          </button>
        </div>
      )}

      {/* For You */}
      <div className={styles.pillCategory}>
        <span className={`${styles.pillCategoryLabel} ${styles.pillCategoryLabelFor}`}>For You</span>
        <div className={styles.pillCategoryGrid}>
          {personalizedPills.map((pill, idx) => {
            const knownPill = INTENT_PILLS ? INTENT_PILLS.find((ip) => ip.label === pill.label || ip.prompt === pill.prompt) : null;
            const IconComponent = knownPill ? Icons[knownPill.icon] : Icons['ArrowRight'];
            return (
              <motion.button
                key={idx}
                className={styles.pill}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handlePillClick(pill)}
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

      {/* Explore */}
      <div className={styles.pillCategory}>
        <span className={`${styles.pillCategoryLabel} ${styles.pillCategoryLabelExplore}`}>Explore</span>
        <div className={styles.pillCategoryGrid}>
          {browsePills.map((pill, idx) => (
            <motion.button
              key={idx}
              className={`${styles.pill} ${styles.pillExplore}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handlePillClick(pill)}
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
    </>
  );
}
