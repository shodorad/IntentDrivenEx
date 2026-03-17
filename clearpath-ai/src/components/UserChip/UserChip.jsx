import { useTranslation } from '../../i18n/useTranslation';
import styles from './UserChip.module.css';

export default function UserChip() {
  const { t } = useTranslation();

  return (
    <div className={styles.chip}>
      <span className={styles.name}>{t('userChip.name')}</span>
      <div className={styles.avatarWrap}>
        <div className={styles.avatar}>{t('userChip.initials')}</div>
        <div className={styles.statusDot} />
      </div>
    </div>
  );
}
