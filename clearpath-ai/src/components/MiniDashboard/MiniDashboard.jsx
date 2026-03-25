import { useChat } from '../../context/ChatContext';
import styles from './MiniDashboard.module.css';

function getDataColor(pctRemaining) {
  if (pctRemaining > 30) return '#00B5AD';
  if (pctRemaining >= 10) return '#FFC107';
  return '#DC3545';
}

export default function MiniDashboard({ onAddOnClick }) {
  const { state } = useChat();
  const persona = state.persona;

  const remaining = parseFloat(persona.dataRemaining);
  const total = parseFloat(persona.dataTotal);
  const pctUsed = total > 0 ? Math.round((remaining / total) * 100) : 0;
  const pctRemaining = total > 0 ? (remaining / total) * 100 : 0;
  const dataColor = getDataColor(pctRemaining);

  const daysUntilRenewal = Math.ceil(
    (new Date(persona.renewalDate) - new Date()) / 86400000
  );
  const renewColor = daysUntilRenewal <= 3 ? '#FFC107' : '#1a1a1a';

  const addons = persona.addons || [];
  const addonsText = addons.length > 0 ? addons.join(' · ') : 'None active';

  const handleAddOn = onAddOnClick || (() => {});

  return (
    <div className={styles.grid}>
      {/* Tile 1 — Data Left */}
      <div className={styles.tile}>
        <div className={styles.label}>📶 Data Left</div>
        <div className={styles.value} style={{ color: dataColor }}>
          {persona.dataRemaining} GB
        </div>
        <div className={styles.sub}>
          <div className={styles.barWrap}>
            <div className={styles.bar}>
              <div
                className={styles.fill}
                style={{ width: `${pctUsed}%`, background: dataColor }}
              />
            </div>
          </div>
          <span>{pctUsed}% left</span>
        </div>
      </div>

      {/* Tile 2 — Your Plan */}
      <div className={styles.tile}>
        <div className={styles.label}>📋 Your Plan</div>
        <div className={styles.value}>{persona.planName}</div>
        <div className={styles.sub}>{persona.planPrice || '—'}</div>
      </div>

      {/* Tile 3 — Renews In */}
      <div className={styles.tile}>
        <div className={styles.label}>🗓 Renews In</div>
        <div className={styles.value} style={{ color: renewColor }}>
          {daysUntilRenewal} days
        </div>
        <div className={styles.sub}>{persona.renewalDate}</div>
      </div>

      {/* Tile 4 — Add-ons */}
      <div className={styles.tile}>
        <div className={styles.label}>📞 Add-ons</div>
        <div className={styles.value}>{addonsText}</div>
        <div className={styles.sub}>
          <span className={styles.addLink} onClick={handleAddOn}>
            + Add one
          </span>
        </div>
      </div>
    </div>
  );
}
