import { Sparkle } from '@phosphor-icons/react';
import styles from './MessageBubble.module.css';

function bold(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}

function renderContent(content) {
  if (!content) return null;
  const paragraphs = content.split('\n\n');
  const nodes = [];

  paragraphs.forEach((para, pi) => {
    const rawLines = para.split('\n');

    // ── ✅ Step timeline ──────────────────────────────────
    const stepLines = rawLines.filter(l => l.startsWith('✅'));
    const nonStepRaw = rawLines.filter(l => !l.startsWith('✅'));

    if (stepLines.length > 0) {
      nodes.push(
        <ol key={`steps-${pi}`} className={styles.stepList}>
          {stepLines.map((line, si) => {
            const isLast = si === stepLines.length - 1;
            const stripped = line.replace(/^✅\s*/, '');
            const dashIdx = stripped.indexOf(' — ');
            const title = dashIdx !== -1 ? stripped.slice(0, dashIdx) : stripped;
            const desc = dashIdx !== -1 ? stripped.slice(dashIdx + 3) : null;
            return (
              <li key={si} className={styles.stepItem}>
                <div className={styles.stepTrack}>
                  <span className={styles.stepNum}>{si + 1}</span>
                  {!isLast && <span className={styles.stepLine} />}
                </div>
                <span className={`${styles.stepBody} ${isLast ? styles.stepBodyLast : ''}`}>
                  <span className={styles.stepTitle}>{title}</span>
                  {desc && <span className={styles.stepDesc}>{desc}</span>}
                </span>
              </li>
            );
          })}
        </ol>
      );
    }

    // ── Process remaining lines ───────────────────────────
    const lines = nonStepRaw.map(l => l.trim()).filter(Boolean);
    if (!lines.length) return;

    const first = lines[0];

    // ── 📊 Stat card grid ─────────────────────────────
    const statLines = lines.filter(l => l.startsWith('📊 '));
    if (statLines.length > 0 && statLines.length === lines.length) {
      const severityClass = { ok: styles.statValueOk, warn: styles.statValueWarn, critical: styles.statValueCritical };
      nodes.push(
        <div key={`stats-${pi}`} className={styles.statGrid}>
          {statLines.map((line, si) => {
            const parts = line.replace(/^📊\s*/, '').split(' | ');
            const value    = parts[0] || '';
            const label    = parts[1] || '';
            const severity = parts[2] || '';
            return (
              <div key={si} className={styles.statCard}>
                <span className={`${styles.statValue} ${severityClass[severity] || ''}`}>{value}</span>
                {label && <span className={styles.statLabel}>{label}</span>}
              </div>
            );
          })}
        </div>
      );
      return;
    }

    // ── 💡 Insight callout ────────────────────────────
    if (first.startsWith('💡 ')) {
      const text = first.replace(/^💡\s*/, '');
      nodes.push(
        <div key={`insight-${pi}`} className={styles.insightCallout}>
          <span className={styles.insightIcon}>⚡</span>
          <span className={styles.insightText}>{bold(text)}</span>
        </div>
      );
      return;
    }

    const bulletLines = lines.filter(l => l.startsWith('• '));
    const isBoldOnly = /^\*\*[^*]+\*\*$/.test(first);
    const endsWithColon = first.endsWith(':') && !isBoldOnly;
    const restAreBullets = lines.length > 1 && bulletLines.length === lines.length - 1;
    const allBullets = bulletLines.length === lines.length;

    // ── Order summary card: **Title** + bullet key-value rows ──
    if (isBoldOnly && restAreBullets && bulletLines.length >= 2) {
      const title = first.slice(2, -2);
      nodes.push(
        <div key={`order-${pi}`} className={styles.orderCard}>
          <div className={styles.orderTitle}>{title}</div>
          <div className={styles.orderRows}>
            {bulletLines.map((l, i) => {
              const text = l.replace(/^•\s*/, '');
              const colonIdx = text.indexOf(': ');
              if (colonIdx !== -1) {
                return (
                  <div key={i} className={styles.orderRow}>
                    <span className={styles.orderKey}>{text.slice(0, colonIdx)}</span>
                    <span className={styles.orderVal}>{bold(text.slice(colonIdx + 2))}</span>
                  </div>
                );
              }
              return <div key={i} className={styles.orderRowFull}>{bold(text)}</div>;
            })}
          </div>
        </div>
      );
      return;
    }

    // ── Section group: header ending with : + bullets ─────
    if (endsWithColon && restAreBullets) {
      nodes.push(
        <div key={`sec-${pi}`} className={styles.sectionGroup}>
          <div className={styles.sectionHeader}>{bold(first.slice(0, -1))}</div>
          <ul className={styles.bulletList}>
            {bulletLines.map((l, i) => (
              <li key={i} className={styles.bulletItem}>{bold(l.replace(/^•\s*/, ''))}</li>
            ))}
          </ul>
        </div>
      );
      return;
    }

    // ── Pure bullet list ──────────────────────────────────
    if (allBullets) {
      nodes.push(
        <ul key={`bl-${pi}`} className={styles.bulletList}>
          {bulletLines.map((l, i) => (
            <li key={i} className={styles.bulletItem}>{bold(l.replace(/^•\s*/, ''))}</li>
          ))}
        </ul>
      );
      return;
    }

    // ── Plain paragraph (with br support for sub-lines) ───
    nodes.push(
      <p key={`p-${pi}`} className={styles.para}>
        {lines.map((line, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {bold(line)}
          </span>
        ))}
      </p>
    );
  });

  return nodes;
}

export default function MessageBubble({ role, content }) {
  if (role === 'user') {
    return (
      <div className={styles.userRow}>
        <div className={styles.userBubble}>{content}</div>
      </div>
    );
  }

  // Don't render an empty AI bubble (e.g. when a flow component handles the response)
  if (!content) return null;

  return (
    <div className={styles.aiRow}>
      <div className={styles.avatar}>
        <Sparkle size={16} weight="fill" />
      </div>
      <div className={styles.aiContent}>
        <span className={styles.aiLabel}>ClearPath AI</span>
        <div className={styles.aiText}>{renderContent(content)}</div>
      </div>
    </div>
  );
}
