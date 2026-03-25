import { useChat } from '../../context/ChatContext';
import styles from './MiniDashboard.module.css';

function getDataColor(pct) {
  if (pct > 30) return '#00B5AD';
  if (pct >= 10) return '#FFC107';
  return '#DC3545';
}

function RingChart({ pct, color, size = 80 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e9ecef" strokeWidth={8} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

function SignalBars({ bars = 4, color = '#00B5AD' }) {
  return (
    <div className={styles.signalBars}>
      {[1, 2, 3, 4, 5].map((b) => (
        <div
          key={b}
          className={styles.signalBar}
          style={{
            height: `${b * 20}%`,
            background: b <= bars ? color : '#e0e0e0',
          }}
        />
      ))}
    </div>
  );
}

export default function MiniDashboard({ onAddOnClick }) {
  const { state } = useChat();
  const p = state.persona;

  const remaining = parseFloat(p.dataRemaining);
  const total = parseFloat(p.dataTotal);
  const pctRemaining = total > 0 ? (remaining / total) * 100 : 0;
  const dataColor = getDataColor(pctRemaining);

  const daysUntilRenewal = Math.ceil((new Date(p.renewalDate) - new Date()) / 86400000);
  const renewUrgent = daysUntilRenewal <= 7;

  const addons = p.addons || [];
  const handleAddOn = onAddOnClick || (() => {});

  // Urgency derived from persona data
  const urgency = remaining === 0 ? 'cap' : pctRemaining < 20 ? 'low' : addons.length > 0 ? 'intl' : 'normal';

  // Simulated monthly spend (plan price numeric)
  const spendNum = p.planPrice ? parseFloat(p.planPrice.replace(/[^0-9.]/g, '')) : 0;

  return (
    <>
      <div className={styles.mosaic}>
        {/* Tile A — Data (spans 2 rows) */}
        <div className={`${styles.tile} ${styles.tileData}`}>
          <div className={styles.tileLabel}>Data Left</div>
          <div className={styles.ringWrap}>
            <RingChart pct={pctRemaining} color={dataColor} size={68} />
            <div className={styles.ringCenter}>
              <span className={styles.ringValue} style={{ color: dataColor }}>
                {Math.round(pctRemaining)}%
              </span>
            </div>
          </div>
          <div className={styles.dataGB} style={{ color: dataColor }}>
            {p.dataRemaining} <span className={styles.dataUnit}>GB</span>
          </div>
          <div className={styles.dataSub}>of {p.dataTotal} GB total</div>
          {urgency === 'cap' && <div className={styles.statusBadge} style={{background:'#DC3545'}}>DATA CAP REACHED</div>}
          {urgency === 'low' && <div className={styles.statusBadge} style={{background:'#FFC107', color:'#7a5c00'}}>RUNNING LOW</div>}
        </div>

        {/* Tile B — Your Plan */}
        <div className={`${styles.tile} ${styles.tilePlan}`}>
          <div className={styles.planAccent} />
          <div className={styles.tileLabel}>Your Plan</div>
          <div className={styles.planName}>{p.planName}</div>
          {urgency === 'cap'
            ? <div className={styles.planBadge} style={{background:'rgba(255,255,255,0.35)'}}>UPGRADE?</div>
            : <div className={styles.planBadge}>5G</div>
          }
          {urgency === 'cap' && <div className={styles.planUpgrade}>Unlimited available</div>}
          <div className={styles.planPrice}>{p.planPrice || '—'}</div>
        </div>

        {/* Tile C — Network */}
        <div className={`${styles.tile} ${styles.tileNetwork}`}>
          <div className={styles.tileLabel}>Network</div>
          <SignalBars bars={urgency === 'cap' ? 2 : 4} color={urgency === 'cap' ? '#FFC107' : '#00B5AD'} />
          <div className={styles.networkBadge} style={{color: urgency === 'cap' ? '#FFC107' : '#00B5AD'}}>
            {urgency === 'cap' ? '2G' : '5G'}
          </div>
          <div className={styles.networkSub}>
            {urgency === 'cap' ? 'Speed throttled' : urgency === 'intl' ? 'Intl. ready' : 'Strong signal'}
          </div>
        </div>

        {/* Tile D — Renews In */}
        <div className={`${styles.tile} ${styles.tileRenew} ${renewUrgent ? styles.tileRenewUrgent : ''}`}>
          <div className={styles.tileLabel}>Renews In</div>
          <div className={styles.renewDays} style={{ color: renewUrgent ? '#FFC107' : '#00B5AD' }}>
            {daysUntilRenewal}<span className={styles.renewUnit}>d</span>
          </div>
          <div className={styles.renewDate}>{p.renewalDate}</div>
        </div>

        {/* Tile E — Monthly Spend */}
        <div className={`${styles.tile} ${styles.tileSpend}`}>
          <div className={styles.tileLabel}>Monthly</div>
          <div className={styles.spendAmount}>${spendNum}</div>
          <div className={styles.spendSub}>
            {urgency === 'cap' ? 'Upgrade saves you more' : urgency === 'low' ? 'Refill for $15' : 'No overage fees'}
          </div>
          <div className={styles.spendBar}>
            <div className={styles.spendFill} style={{ width: '70%' }} />
          </div>
        </div>
      </div>

      {/* Add-ons slim row */}
      <div className={styles.addonsRow}>
        <span className={styles.addonsRowLabel}>Add-ons</span>
        {addons.length > 0 ? (
          <div className={styles.addonList}>
            {addons.map((a) => <span key={a} className={styles.addonChip}>{a}</span>)}
          </div>
        ) : (
          <span className={styles.addonNone}>None active</span>
        )}
        <span className={styles.addLink} onClick={handleAddOn}>+ Add one</span>
      </div>
    </>
  );
}
