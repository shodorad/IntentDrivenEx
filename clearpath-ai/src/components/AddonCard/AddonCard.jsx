/**
 * AddonCard
 * Light mint card with large centered illustration — matches Total Wireless add-on design.
 *
 * Props:
 *   variant    'intl' | 'autopay' | 'data5g' | 'data15g' | 'disney' | 'protect' | 'cloud'
 *   title      Card headline   e.g. "Add global calling time"
 *   desc       Short description
 *   isActive   boolean — shows active badge instead of CTA
 *   ctaLabel   CTA link text (default "Shop now")
 *   onClick    Click handler
 */

import * as Icons from '@phosphor-icons/react';
import styles from './AddonCard.module.css';

/* ── Per-variant illustrations ── */

function IntlIllustration() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      {/* Globe circle */}
      <circle cx="72" cy="84" r="52" fill="#00B5AD" />
      {/* Globe grid lines */}
      <ellipse cx="72" cy="84" rx="26" ry="52" stroke="#0D1F33" strokeWidth="2.5" fill="none" />
      <ellipse cx="72" cy="84" rx="52" ry="20" stroke="#0D1F33" strokeWidth="2" fill="none" />
      <circle cx="72" cy="84" r="52" stroke="#0D1F33" strokeWidth="2.5" fill="none" />
      <line x1="72" y1="32" x2="72" y2="136" stroke="#0D1F33" strokeWidth="2" />
      <line x1="20" y1="84" x2="124" y2="84" stroke="#0D1F33" strokeWidth="2" />
      {/* Phone shape overlaid bottom-right */}
      <rect x="98" y="90" width="34" height="52" rx="6" fill="#5BEBE4" stroke="#0D1F33" strokeWidth="2" />
      <rect x="104" y="98" width="22" height="30" rx="2" fill="#0D1F33" opacity="0.15" />
      <circle cx="115" cy="134" r="3" fill="#0D1F33" opacity="0.4" />
    </svg>
  );
}

function AutoPayIllustration() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      {/* Background circle */}
      <circle cx="80" cy="84" r="56" fill="#00B5AD" />
      {/* Outer ring arrows */}
      <path
        d="M80 34 A50 50 0 0 1 128 68"
        stroke="#0D1F33" strokeWidth="4" strokeLinecap="round" fill="none"
      />
      <path d="M128 68 L134 56 M128 68 L116 62" stroke="#0D1F33" strokeWidth="3.5" strokeLinecap="round" />
      <path
        d="M80 134 A50 50 0 0 1 32 100"
        stroke="#0D1F33" strokeWidth="4" strokeLinecap="round" fill="none"
      />
      <path d="M32 100 L26 112 M32 100 L44 106" stroke="#0D1F33" strokeWidth="3.5" strokeLinecap="round" />
      {/* Dollar sign */}
      <text x="80" y="96" textAnchor="middle" fontSize="44" fontWeight="800" fill="#0D1F33" fontFamily="Inter, sans-serif" opacity="0.85">$</text>
    </svg>
  );
}

function Data5GIllustration() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      {/* Background circle */}
      <circle cx="80" cy="84" r="56" fill="#00B5AD" />
      {/* Gauge arc */}
      <path
        d="M34 104 A46 46 0 0 1 126 104"
        stroke="#0D1F33" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.3"
      />
      <path
        d="M34 104 A46 46 0 0 1 96 52"
        stroke="#0D1F33" strokeWidth="5" strokeLinecap="round" fill="none"
      />
      {/* Needle */}
      <line x1="80" y1="104" x2="98" y2="58" stroke="#0D1F33" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="80" cy="104" r="6" fill="#0D1F33" />
      {/* 5G label */}
      <text x="80" y="126" textAnchor="middle" fontSize="22" fontWeight="800" fill="#0D1F33" fontFamily="Inter, sans-serif">5G</text>
    </svg>
  );
}

function Data15GIllustration() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      {/* Teal circle background — matches other illustrations */}
      <circle cx="80" cy="80" r="56" fill="#00B5AD" />
      {/* Phone body centered in circle */}
      <rect x="57" y="44" width="46" height="72" rx="8" fill="#5BEBE4" />
      <rect x="57" y="44" width="46" height="72" rx="8" stroke="#0D1F33" strokeWidth="2" fill="none" />
      {/* Notch pill */}
      <rect x="70" y="48" width="20" height="4" rx="2" fill="#0D1F33" opacity="0.35" />
      {/* Screen */}
      <rect x="62" y="56" width="36" height="46" rx="3" fill="#0D1F33" opacity="0.12" />
      {/* Signal bars on screen */}
      <rect x="67" y="82" width="5" height="12" rx="2" fill="#0D1F33" opacity="0.8" />
      <rect x="75" y="76" width="5" height="18" rx="2" fill="#0D1F33" opacity="0.8" />
      <rect x="83" y="70" width="5" height="24" rx="2" fill="#0D1F33" opacity="0.8" />
      <rect x="91" y="64" width="5" height="30" rx="2" fill="#0D1F33" opacity="0.8" />
      {/* Home indicator */}
      <rect x="72" y="108" width="16" height="3" rx="1.5" fill="#0D1F33" opacity="0.3" />
    </svg>
  );
}

function DisneyIllustration() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <circle cx="80" cy="84" r="56" fill="#00B5AD" />
      <polygon points="60,56 110,84 60,112" fill="#0D1F33" opacity="0.8" />
      <circle cx="80" cy="84" r="56" stroke="#0D1F33" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

function ProtectIllustration() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <circle cx="80" cy="84" r="56" fill="#00B5AD" />
      <path d="M80 42L118 58V88C118 112 102 130 80 140C58 130 42 112 42 88V58L80 42Z"
        stroke="#0D1F33" strokeWidth="3" fill="none" />
      <path d="M62 86L74 98L100 72" stroke="#0D1F33" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloudIllustration() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <circle cx="80" cy="84" r="56" fill="#00B5AD" />
      <path d="M110 96H108C110 92 112 88 112 83C112 70 101 60 88 60C81 60 75 63 71 68C69 63 64 60 58 60C49 60 42 67 42 76V78H40C33 78 27 84 27 92C27 100 33 106 40 106H110C117 106 123 100 123 92C123 86 118 81 110 96Z"
        stroke="#0D1F33" strokeWidth="2.5" fill="rgba(13,31,51,0.15)" strokeLinejoin="round" />
      <path d="M80 93V112" stroke="#0D1F33" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M70 103L80 93L90 103" stroke="#0D1F33" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ILLUSTRATIONS = {
  intl:    <IntlIllustration />,
  autopay: <AutoPayIllustration />,
  data5g:  <Data5GIllustration />,
  data15g: <Data15GIllustration />,
  disney:  <DisneyIllustration />,
  protect: <ProtectIllustration />,
  cloud:   <CloudIllustration />,
};

export default function AddonCard({
  variant = 'intl',
  title,
  desc,
  price,
  isActive = false,
  recommended = false,
  ctaLabel = 'Shop now',
  onClick,
}) {
  const illustration = ILLUSTRATIONS[variant] || ILLUSTRATIONS.intl;

  return (
    <div
      className={styles.card}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Illustration — top portion, centered */}
      <div className={styles.visual}>
        {illustration}
      </div>

      {/* Text content — bottom portion */}
      <div className={styles.body}>
        {recommended && (
          <span className={styles.recommendedBadge}>Recommended</span>
        )}
        <div className={styles.title}>{title}</div>
        {price && <div className={styles.price}>{price}</div>}
        {desc && <div className={styles.desc}>{desc}</div>}

        {isActive ? (
          <span className={styles.activeBadge}>
            <Icons.Check size={10} weight="bold" />
            Active
          </span>
        ) : (
          <button
            className={styles.cta}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          >
            {ctaLabel}
            <Icons.ArrowRight size={10} weight="bold" />
          </button>
        )}
      </div>
    </div>
  );
}
