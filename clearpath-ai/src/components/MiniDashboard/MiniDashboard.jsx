import { useChat } from '../../context/ChatContext';
import styles from './MiniDashboard.module.css';

// R6 spec thresholds: red < 20%, amber 20–50%, green > 50%
function getDataColor(pct) {
  if (pct === null || pct === undefined) return '#9ca3af'; // neutral gray for null
  if (pct > 50) return '#00B5AD';  // teal
  if (pct > 20) return '#FFC107';  // amber
  return '#DC3545';                // red
}

function RingChart({ pct, color, size = 80 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - (pct || 0) / 100);
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

const SEVERITY_COLOR = {
  critical: '#DC3545',
  warning: '#FFC107',
  info: '#00B5AD',
};

const SEVERITY_BG = {
  critical: 'rgba(220,53,69,0.08)',
  warning: 'rgba(255,193,7,0.1)',
  info: 'rgba(0,181,173,0.08)',
};

export default function MiniDashboard({ onAddOnClick }) {
  const { state } = useChat();
  const persona = state.persona;
  // Support both new shape (persona.account) and legacy flat shape
  const account = persona.account || persona;

  const handleAddOn = onAddOnClick || (() => {});

  // Handle empty/activation state (us-004 James — no plan yet)
  const isEmpty = !account.plan && account.plan !== undefined;
  const addons = account.activeAddons || account.addons || [];

  // Data calculations — handle null gracefully
  const dataPercent = account.dataPercent !== undefined && account.dataPercent !== null
    ? account.dataPercent
    : (() => {
        const rem = parseFloat(account.dataRemaining);
        const tot = parseFloat(account.dataTotal);
        return (tot > 0 && !isNaN(rem) && !isNaN(tot)) ? (rem / tot) * 100 : null;
      })();

  const dataColor = getDataColor(dataPercent);
  const dataRemaining = account.dataRemaining || null;
  const dataTotal = account.dataTotal || null;

  const renewalDate = account.renewalDate || null;
  const daysUntilRenewal = account.daysUntilRenewal !== undefined && account.daysUntilRenewal !== null
    ? account.daysUntilRenewal
    : renewalDate
      ? Math.ceil((new Date(renewalDate) - new Date()) / 86400000)
      : null;
  const renewUrgent = daysUntilRenewal !== null && daysUntilRenewal <= 7;

  const spendNum = account.planPrice ? parseFloat(account.planPrice.replace(/[^0-9.]/g, '')) : null;

  // Urgency derived from account data
  const urgency = dataPercent === 0 ? 'cap'
    : dataPercent !== null && dataPercent < 20 ? 'low'
    : addons.length > 0 ? 'intl'
    : isEmpty ? 'empty'
    : 'normal';

  // Signals from persona (new full shape)
  const signals = persona.signals || [];

  if (isEmpty) {
    return (
      <>
        <div className={styles.mosaic}>
          <div className={`${styles.tile} ${styles.tileData}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className={styles.tileLabel}>Data</div>
            <div className={styles.dataGB} style={{ color: '#9ca3af', fontSize: '1rem' }}>No plan</div>
            <div className={styles.dataSub}>Activate to start</div>
          </div>
          <div className={`${styles.tile} ${styles.tilePlan}`}>
            <div className={styles.planAccent} />
            <div className={styles.tileLabel}>Your Plan</div>
            <div className={styles.planName} style={{ color: '#9ca3af' }}>Not activated</div>
            <div className={styles.planBadge} style={{ background: 'rgba(0,181,173,0.12)', color: '#00B5AD' }}>NEW</div>
          </div>
          <div className={`${styles.tile} ${styles.tileNetwork}`}>
            <div className={styles.tileLabel}>Network</div>
            <SignalBars bars={4} color="#00B5AD" />
            <div className={styles.networkBadge} style={{ color: '#00B5AD' }}>5G</div>
            <div className={styles.networkSub}>Ready to connect</div>
          </div>
          <div className={`${styles.tile} ${styles.tileRenew}`}>
            <div className={styles.tileLabel}>Renews In</div>
            <div className={styles.renewDays} style={{ color: '#9ca3af', fontSize: '1.2rem' }}>—</div>
            <div className={styles.renewDate}>After activation</div>
          </div>
          <div className={`${styles.tile} ${styles.tileSpend}`}>
            <div className={styles.tileLabel}>Monthly</div>
            <div className={styles.spendAmount} style={{ color: '#9ca3af' }}>—</div>
            <div className={styles.spendSub}>Choose a plan</div>
          </div>
        </div>
        {signals.length > 0 && <SignalRow signals={signals} />}
        <div className={styles.addonsRow}>
          <span className={styles.addonsRowLabel}>Add-ons</span>
          <span className={styles.addonNone}>None active</span>
          <span className={styles.addLink} onClick={handleAddOn}>+ Add one</span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.mosaic}>
        {/* Tile A — Data (spans 2 rows) */}
        <div className={`${styles.tile} ${styles.tileData}`}>
          <div className={styles.tileLabel}>Data Left</div>
          <div className={styles.ringWrap}>
            <RingChart pct={dataPercent || 0} color={dataColor} size={68} />
            <div className={styles.ringCenter}>
              <span className={styles.ringValue} style={{ color: dataColor }}>
                {dataPercent !== null ? `${Math.round(dataPercent)}%` : '—'}
              </span>
            </div>
          </div>
          <div className={styles.dataGB} style={{ color: dataColor }}>
            {dataRemaining ? parseFloat(dataRemaining).toFixed(1) : '—'}
            {dataRemaining && <span className={styles.dataUnit}> GB</span>}
          </div>
          <div className={styles.dataSub}>of {dataTotal ? parseFloat(dataTotal).toFixed(0) : '—'} GB total</div>
          {urgency === 'cap' && <div className={styles.statusBadge} style={{ background: '#DC3545' }}>DATA CAP REACHED</div>}
          {urgency === 'low' && <div className={styles.statusBadge} style={{ background: '#FFC107', color: '#7a5c00' }}>RUNNING LOW</div>}
        </div>

        {/* Tile B — Your Plan */}
        <div className={`${styles.tile} ${styles.tilePlan}`}>
          <div className={styles.planAccent} />
          <div className={styles.tileLabel}>Your Plan</div>
          <div className={styles.planName}>{account.plan || '—'}</div>
          {urgency === 'cap'
            ? <div className={styles.planBadge} style={{ background: 'rgba(255,255,255,0.35)' }}>UPGRADE?</div>
            : <div className={styles.planBadge}>5G</div>
          }
          {urgency === 'cap' && <div className={styles.planUpgrade}>Unlimited available</div>}
          <div className={styles.planPrice}>{account.planPrice || '—'}</div>
        </div>

        {/* Tile C — Network */}
        <div className={`${styles.tile} ${styles.tileNetwork}`}>
          <div className={styles.tileLabel}>Network</div>
          <SignalBars
            bars={account.avgSignalBars || (urgency === 'cap' ? 2 : 4)}
            color={urgency === 'cap' ? '#FFC107' : '#00B5AD'}
          />
          <div className={styles.networkBadge} style={{ color: urgency === 'cap' ? '#FFC107' : '#00B5AD' }}>
            {urgency === 'cap' ? '2G' : '5G'}
          </div>
          <div className={styles.networkSub}>
            {urgency === 'cap' ? 'Speed throttled'
              : account.avgSignalBars && account.avgSignalBars <= 2 ? 'Weak signal'
              : urgency === 'intl' ? 'Intl. ready'
              : 'Strong signal'}
          </div>
        </div>

        {/* Tile D — Renews In */}
        <div className={`${styles.tile} ${styles.tileRenew} ${renewUrgent ? styles.tileRenewUrgent : ''}`}>
          <div className={styles.tileLabel}>Renews In</div>
          <div className={styles.renewDays} style={{ color: renewUrgent ? '#FFC107' : '#00B5AD' }}>
            {daysUntilRenewal !== null ? daysUntilRenewal : '—'}
            {daysUntilRenewal !== null && <span className={styles.renewUnit}>d</span>}
          </div>
          <div className={styles.renewDate}>{renewalDate || '—'}</div>
        </div>

        {/* Tile E — Monthly Spend */}
        <div className={`${styles.tile} ${styles.tileSpend}`}>
          <div className={styles.tileLabel}>Monthly</div>
          <div className={styles.spendAmount}>{spendNum !== null ? `$${spendNum}` : '—'}</div>
          <div className={styles.spendSub}>
            {urgency === 'cap' ? 'Upgrade saves you more'
              : urgency === 'low' ? 'Refill for $15'
              : 'No overage fees'}
          </div>
          <div className={styles.spendBar}>
            <div className={styles.spendFill} style={{ width: '70%' }} />
          </div>
        </div>
      </div>

      {/* 3-signal composite display */}
      {signals.length > 0 && <SignalRow signals={signals.slice(0, 3)} />}

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

function SignalRow({ signals }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      margin: '10px 0 4px',
    }}>
      {signals.map((sig) => (
        <div
          key={sig.id}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '8px 12px',
            borderRadius: 10,
            background: SEVERITY_BG[sig.severity] || 'rgba(0,0,0,0.04)',
            borderLeft: `3px solid ${SEVERITY_COLOR[sig.severity] || '#9ca3af'}`,
          }}
        >
          <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: 1 }}>{sig.icon}</span>
          <div>
            <div style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: SEVERITY_COLOR[sig.severity] || '#374151',
              lineHeight: 1.3,
            }}>
              {sig.headline}
            </div>
            <div style={{
              fontSize: '0.72rem',
              color: '#6b7280',
              marginTop: 2,
              lineHeight: 1.4,
            }}>
              {sig.subtext}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
