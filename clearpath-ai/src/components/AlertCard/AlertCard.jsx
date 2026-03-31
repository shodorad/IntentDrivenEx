/**
 * AlertCard + AlertCardGrid
 * Reusable glassmorphism intent-alert card.
 * Design source: clearpath-ai-brand-guide.html → "Intent Driven Alerts" section.
 *
 * Usage:
 *   <AlertCardGrid signals={persona.signals} onCta={(prompt) => startChat(prompt)} />
 *
 * AlertCard props:
 *   severity   'critical' | 'warning' | 'info'
 *   headline   Alert headline text
 *   subtext    Supporting detail text
 *   ctaLabel   CTA button label
 *   onCta      Click handler
 */

import * as Icons from '@phosphor-icons/react';
import styles from './AlertCard.module.css';

/* Phosphor icon per severity */
const SEVERITY_ICON = {
  critical: 'WarningCircle',
  warning:  'Warning',
  info:     'Info',
};

/* Arc colors per severity */
const ARC_COLOR = {
  critical: '#DC3545',
  warning:  '#FFC107',
  info:     '#00B5AD',
};

export function AlertCard({ severity = 'info', headline, subtext, ctaLabel, onCta }) {
  const sev = severity;

  const cardClass   = sev === 'critical' ? styles.critical  : sev === 'warning' ? styles.warning  : styles.info;
  const iconClass   = sev === 'critical' ? styles.iconCritical : sev === 'warning' ? styles.iconWarning : styles.iconInfo;
  const headClass   = sev === 'critical' ? styles.headlineCritical : sev === 'warning' ? styles.headlineWarning : styles.headlineInfo;
  const ctaClass    = sev === 'critical' ? styles.ctaCritical : sev === 'warning' ? styles.ctaWarning : styles.ctaInfo;
  const arcColor    = ARC_COLOR[sev] || '#6B7280';
  const iconName    = SEVERITY_ICON[sev] || 'Info';
  const IconComp    = Icons[iconName];

  return (
    <div className={`${styles.card} ${cardClass}`}>
      {/* Concentric arc decoration — bottom-right, no filter/blur */}
      <svg
        className={styles.deco}
        width="96" height="96"
        viewBox="0 0 96 96"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="96" cy="96" r="28" stroke={arcColor} strokeWidth="1" opacity="0.20" />
        <circle cx="96" cy="96" r="46" stroke={arcColor} strokeWidth="1" opacity="0.12" />
        <circle cx="96" cy="96" r="64" stroke={arcColor} strokeWidth="1" opacity="0.07" />
        <circle cx="96" cy="96" r="82" stroke={arcColor} strokeWidth="1" opacity="0.04" />
      </svg>

      {/* Icon + text row */}
      <div className={styles.top}>
        <div className={`${styles.icon} ${iconClass}`}>
          {IconComp && <IconComp size={18} weight="regular" />}
        </div>
        <div className={styles.body}>
          <div className={`${styles.headline} ${headClass}`}>{headline}</div>
          <div className={styles.subtext}>{subtext}</div>
        </div>
      </div>

      {/* CTA */}
      {ctaLabel && (
        <button
          className={`${styles.cta} ${ctaClass}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={onCta}
        >
          {ctaLabel}
          <Icons.ArrowRight size={11} weight="bold" />
        </button>
      )}
    </div>
  );
}

/**
 * AlertCardGrid — wraps 1–3 AlertCards in the mesh gradient backdrop.
 *
 * Props:
 *   signals   Array of signal objects from persona data
 *   onCta     (prompt: string) => void
 *   persona   Persona object (used to derive CTAs)
 */
export function AlertCardGrid({ signals = [], onCta, persona }) {
  if (!signals.length) return null;

  function getCtaForSignal(sig) {
    const actions = persona?.suggestedActions || [];
    if (sig.severity === 'critical') {
      const a = actions[0];
      return { label: a?.label || 'Act Now', prompt: a?.label || 'I need help' };
    }
    if (sig.severity === 'warning') {
      const a = actions[1] || actions[0];
      return { label: a?.label || 'Show Options', prompt: a?.label || 'What are my options?' };
    }
    return { label: 'Tell Me More', prompt: sig.headline };
  }

  return (
    <div className={styles.gridWrap}>
      <div className={styles.grid}>
        {signals.slice(0, 3).map((sig) => {
          const cta = getCtaForSignal(sig);
          return (
            <AlertCard
              key={sig.id}
              severity={sig.severity}
              headline={sig.headline}
              subtext={sig.subtext}
              ctaLabel={cta.label}
              onCta={() => onCta?.(cta.prompt)}
            />
          );
        })}
      </div>
    </div>
  );
}
