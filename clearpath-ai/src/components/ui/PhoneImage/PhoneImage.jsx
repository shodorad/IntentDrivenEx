import { useState } from 'react';
import { DeviceMobile } from '@phosphor-icons/react';
import styles from './PhoneImage.module.css';

const BRAND_COLORS = {
  Apple:    { bg: '#1d1d1f', text: '#f5f5f7' },
  Samsung:  { bg: '#1428A0', text: '#ffffff' },
  Google:   { bg: '#4285F4', text: '#ffffff' },
  Motorola: { bg: '#E1000F', text: '#ffffff' },
};

export default function PhoneImage({ src, alt, brand, className }) {
  const [failed, setFailed] = useState(false);

  const colors = BRAND_COLORS[brand] || { bg: '#0D2137', text: '#ffffff' };

  if (!src || failed) {
    return (
      <div
        className={`${styles.placeholder} ${className || ''}`}
        style={{ background: colors.bg }}
      >
        <DeviceMobile size={36} color={colors.text} weight="light" />
        {brand && <span className={styles.brandLabel} style={{ color: colors.text }}>{brand}</span>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${styles.image} ${className || ''}`}
      onError={() => setFailed(true)}
    />
  );
}
