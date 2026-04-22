import * as PhosphorIcons from '@phosphor-icons/react';
import styles from './InsightPanel.module.css';

const SEVERITY_CONFIG = {
  info:     { icon: 'Info',          cardClass: 'info',     iconClass: 'iconInfo',     headClass: 'headlineInfo',     ctaClass: 'ctaInfo'     },
  tip:      { icon: 'Lightbulb',     cardClass: 'warning',  iconClass: 'iconWarning',  headClass: 'headlineWarning',  ctaClass: 'ctaWarning'  },
  warning:  { icon: 'Warning',       cardClass: 'warning',  iconClass: 'iconWarning',  headClass: 'headlineWarning',  ctaClass: 'ctaWarning'  },
  success:  { icon: 'CheckCircle',   cardClass: 'success',  iconClass: 'iconSuccess',  headClass: 'headlineSuccess',  ctaClass: 'ctaSuccess'  },
  critical: { icon: 'WarningCircle', cardClass: 'critical', iconClass: 'iconCritical', headClass: 'headlineCritical', ctaClass: 'ctaCritical' },
};

const ARC_COLOR = {
  info:     '#00B5AD',
  tip:      '#FFC107',
  warning:  '#FFC107',
  success:  '#28A745',
  critical: '#DC3545',
};

export default function InsightPanel({ data = {} }) {
  const severity = data.severity || 'info';
  const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.info;
  const arcColor = ARC_COLOR[severity] || '#00B5AD';
  const IconComp = PhosphorIcons[cfg.icon] || PhosphorIcons.Info;

  const insights = data.insights || (data.insight
    ? [{ text: data.insight }]
    : [{ text: 'Only 22% of your usage goes through Wi-Fi — your phone is using cellular most of the time.' }]
  );

  return (
    <div className={`${styles.card} ${styles[cfg.cardClass]}`}>
      {/* Arc decoration */}
      <svg className={styles.deco} width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
        <circle cx="96" cy="96" r="28" stroke={arcColor} strokeWidth="1" opacity="0.20" />
        <circle cx="96" cy="96" r="46" stroke={arcColor} strokeWidth="1" opacity="0.12" />
        <circle cx="96" cy="96" r="64" stroke={arcColor} strokeWidth="1" opacity="0.07" />
        <circle cx="96" cy="96" r="82" stroke={arcColor} strokeWidth="1" opacity="0.04" />
      </svg>

      {/* Icon + body */}
      <div className={styles.top}>
        <div className={`${styles.icon} ${styles[cfg.iconClass]}`}>
          <IconComp size={18} weight="regular" />
        </div>
        <div className={styles.body}>
          {data.title && (
            <div className={`${styles.headline} ${styles[cfg.headClass]}`}>{data.title}</div>
          )}
          <div className={styles.insights}>
            {insights.map((item, i) => (
              <p key={i} className={styles.insightText}>{item.text}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Tags as pills */}
      {data.tags?.length > 0 && (
        <div className={styles.tags}>
          {data.tags.map((tag, i) => (
            <span key={i} className={`${styles.tag} ${styles[cfg.ctaClass]}`}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
