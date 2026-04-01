import { useEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import { Star, CalendarBlank, WifiHigh } from '@phosphor-icons/react';
import { useChat } from '../../context/ChatContext';
import { useChatActions } from '../../hooks/useChat';
import AddonCard from '../AddonCard/AddonCard';
import styles from './MiniDashboard.module.css';
import disneyPlusLogo from './disney-plus-logo.png';

const EXTRAS_CATALOG = [
  {
    id:        'intl-calling',
    variant:   'intl',
    title:     'Add global calling time',
    price:     '$10',
    desc:      'More long distance minutes, one-time add-on.',
    ctaLabel:  'Add calling time',
    ctaPrompt: 'Tell me about international calling add-on options.',
  },
  {
    id:        'autopay',
    variant:   'autopay',
    title:     'Add Auto Pay & save',
    price:     'Save $5/mo',
    desc:      'Enroll in Auto Pay on Total 5G or Total 5G+ plans.',
    ctaLabel:  'Enroll now',
    ctaPrompt: 'Tell me about Auto Pay and how to save $5 per month.',
  },
  {
    id:        'data-5gb',
    variant:   'data5g',
    title:     'Add 5 GB of data',
    price:     '$10',
    desc:      'One-time data boost to get through the month.',
    ctaLabel:  'Add 5 GB now',
    ctaPrompt: 'I want to add a 5 GB data add-on to my plan.',
  },
  {
    id:        'data-15gb',
    variant:   'data15g',
    title:     'Add 15 GB of data',
    price:     '$20',
    desc:      'Larger boost for heavy usage months.',
    ctaLabel:  'Add 15 GB now',
    ctaPrompt: 'I want to add a 15 GB data add-on to my plan.',
  },
];

// R6 spec thresholds: red < 20%, amber 20–50%, green > 50%
function getDataColor(pct) {
  if (pct === null || pct === undefined) return '#6B7280'; // neutral gray for null
  if (pct > 50) return '#00B5AD';  // teal
  if (pct > 20) return '#FFC107';  // amber
  return '#DC3545';                // red
}

function HalfDialGauge({ pct, color, dataRemaining, dataTotal, urgency }) {
  const TICKS = 52;
  const outerR = 52;
  const P  = 8;
  const cx = 100;
  const cy = P + outerR;            // 60
  const W  = 200;
  const H  = cy + 30 + P;           // 98
  const filledRatio = Math.min(1, Math.max(0, (pct || 0) / 100));

  const ticks = Array.from({ length: TICKS }, (_, i) => {
    const ratio = i / (TICKS - 1);       // 0 = left/red, 1 = right/green
    const angleDeg = 180 - ratio * 180;  // 180° = 9-o'clock, 0° = 3-o'clock
    const rad = (angleDeg * Math.PI) / 180;
    const innerR = outerR - 9;
    return {
      x1: cx + innerR * Math.cos(rad),
      y1: cy - innerR * Math.sin(rad),
      x2: cx + outerR * Math.cos(rad),
      y2: cy - outerR * Math.sin(rad),
      isMajor: false,
      color: ratio > filledRatio ? '#e5e7eb'
        : ratio < 0.25 ? '#DC3545'
        : ratio < 0.55 ? '#FFC107'
        : '#00B5AD',
    };
  });

  const gbVal = (() => { const v = parseFloat(dataRemaining); return (!isNaN(v) && dataRemaining != null) ? v.toFixed(1) : '—'; })();
  const gbTot = dataTotal ? parseFloat(dataTotal).toFixed(0) : '—';
  const statusLabel = urgency === 'cap' ? 'At Cap'
    : urgency === 'low' ? 'Running Low'
    : (pct || 0) > 75 ? 'Good'
    : (pct || 0) > 40 ? 'Good'
    : 'Low';
  const badgeBg = color === '#DC3545' ? 'rgba(220,53,69,0.14)'
    : color === '#FFC107' ? 'rgba(255,193,7,0.14)'
    : 'rgba(0,181,173,0.14)';

  // Value baseline = cy so the number sits inside the arc opening
  const valY = cy;         // bottom of "0.8" aligns with arc bottom edge
  const subY = cy + 11;    // "of X GB total" just below arc
  const bH = 14, bW = 72;
  const bY  = cy + 23;     // status badge

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ display: 'block', overflow: 'visible', marginTop: 2 }}
      aria-label={`Data: ${gbVal} of ${gbTot} GB`}
    >
      {ticks.filter(t => !t.isMajor).map((t, i) => (
        <line
          key={i}
          x1={t.x1.toFixed(1)} y1={t.y1.toFixed(1)}
          x2={t.x2.toFixed(1)} y2={t.y2.toFixed(1)}
          stroke={t.color}
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      ))}

      {/* Large GB value — sits below the arc */}
      <text x={cx} y={valY} textAnchor="middle" dominantBaseline="auto"
        fontSize="24" fontWeight="800" fill={color}
        fontFamily="Inter, -apple-system, sans-serif">
        {gbVal}
      </text>

      {/* "of X GB total" */}
      <text x={cx} y={subY} textAnchor="middle"
        fontSize="11" fontWeight="500" fill="#6B7280"
        fontFamily="Inter, -apple-system, sans-serif">
        of {gbTot} GB total
      </text>

      {/* Status badge pill */}
      <rect x={cx - bW / 2} y={bY} width={bW} height={bH} rx={bH / 2} fill={badgeBg} />
      <text x={cx} y={bY + bH / 2 + 0.5} textAnchor="middle" dominantBaseline="middle"
        fontSize="10" fontWeight="700" fill={color}
        fontFamily="Inter, -apple-system, sans-serif">
        {statusLabel}
      </text>
    </svg>
  );
}

function DisneyPlusBadge() {
  return (
    <img
      src={disneyPlusLogo}
      alt="Disney+"
      style={{ width: 136, height: 'auto', filter: 'brightness(0) invert(1)', display: 'block' }}
    />
  );
}

function UsageTrend({ data = [], dataTotal }) {
  const chartRef = useRef(null);
  const rootRef  = useRef(null);

  const max      = parseFloat(dataTotal) || 5;
  const capHits  = data.filter(d => d.used >= max * 0.9).length;
  const lastUsed = data.length ? data[data.length - 1].used : 0;
  const lineColor = lastUsed >= max * 0.9 ? '#DC3545'
    : lastUsed >= max * 0.5 ? '#FFC107'
    : '#00B5AD';
  const insight = !data.length ? null
    : capHits >= data.length - 1
      ? `Hit cap ${capHits} of ${data.length} months`
      : data.length >= 2 && data[data.length - 1].used > data[data.length - 2].used
        ? 'Usage up vs last month'
        : `Avg ${(data.reduce((s, d) => s + d.used, 0) / data.length).toFixed(1)} GB/mo`;

  useEffect(() => {
    if (!data.length || !chartRef.current) return;

    const buildChart = () => {
      // Dispose previous instance
      if (rootRef.current) { rootRef.current.dispose(); }

      const root = am5.Root.new(chartRef.current);
      rootRef.current = root;

      // Remove amcharts logo
      root._logo?.dispose();

      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          paddingTop: 12, paddingBottom: 0, paddingLeft: 0, paddingRight: 0,
        })
      );

      // X axis — category (months)
      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: 'month',
          renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 20 }),
        })
      );
      xAxis.get('renderer').labels.template.setAll({
        fontSize: 10,
        fill: am5.color('#6B7280'),
        fontFamily: 'Inter, -apple-system, sans-serif',
        paddingTop: 4,
      });
      xAxis.get('renderer').grid.template.setAll({ stroke: am5.color('#e9ecef'), strokeOpacity: 0.6 });

      // Y axis — hidden (clean look)
      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          min: 0,
          max: max * 1.05,
          strictMinMax: true,
          renderer: am5xy.AxisRendererY.new(root, {}),
        })
      );
      yAxis.get('renderer').labels.template.setAll({ visible: false });
      yAxis.get('renderer').grid.template.setAll({ stroke: am5.color('#e9ecef'), strokeOpacity: 0.4, strokeDasharray: [3, 3] });

      // Cap line — dedicated LineSeries (always visible, dashed)
      const capSeries = chart.series.push(
        am5xy.LineSeries.new(root, {
          xAxis,
          yAxis,
          valueYField: 'cap',
          categoryXField: 'month',
          stroke: am5.color('#DC3545'),
        })
      );
      capSeries.strokes.template.setAll({
        strokeWidth: 1.5,
        strokeDasharray: [5, 4],
        strokeOpacity: 0.85,
      });
      capSeries.fills.template.set('visible', false);

      // Cap line bullet dots — always red
      capSeries.bullets.push(() => {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 3,
            fill: am5.color('#DC3545'),
            stroke: am5.color('#ffffff'),
            strokeWidth: 1.5,
          }),
        });
      });

      // Cap label is rendered as HTML overlay (see JSX return below).
      // amcharts axis-range labels were unreliable for positioning.

      // Area series
      const series = chart.series.push(
        am5xy.SmoothedXLineSeries.new(root, {
          xAxis,
          yAxis,
          valueYField: 'used',
          categoryXField: 'month',
          stroke: am5.color(lineColor),
          fill: am5.color(lineColor),
          tension: 0.6,
        })
      );
      series.strokes.template.setAll({ strokeWidth: 2, strokeLinecap: 'round' });
      series.fills.template.setAll({ visible: true, fillOpacity: 0 });
      series.fills.template.set('fillGradient', am5.LinearGradient.new(root, {
        stops: [
          { color: am5.color(lineColor), opacity: 0.18 },
          { color: am5.color(lineColor), opacity: 0.01 },
        ],
        rotation: 90,
      }));
      series.fills.template.set('visible', true);

      // Bullet dots — red if at or above cap, otherwise line color
      series.bullets.push((root, series, dataItem) => {
        const used = dataItem.get('valueY') ?? 0;
        const dotColor = used >= max ? '#DC3545' : lineColor;
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 3,
            fill: am5.color(dotColor),
            stroke: am5.color('#ffffff'),
            strokeWidth: 1.5,
          }),
        });
      });

      // Cursor
      chart.set('cursor', am5xy.XYCursor.new(root, { behavior: 'none', xAxis }));
      chart.get('cursor').lineY.set('visible', false);
      chart.get('cursor').lineX.setAll({
        stroke: am5.color(lineColor),
        strokeOpacity: 0.3,
        strokeDasharray: [3, 3],
      });

      // Load data
      const chartData = data.map(d => ({ month: d.month, used: d.used, cap: max }));
      xAxis.data.setAll(chartData);
      capSeries.data.setAll(chartData);
      series.data.setAll(chartData);
      series.appear(600);

    };

    buildChart();

    return () => { if (rootRef.current) { rootRef.current.dispose(); rootRef.current = null; } };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dataTotal]);

  if (!data.length) return <div className={styles.trendEmpty}>No history yet</div>;

  return (
    <>
      <div style={{ position: 'relative', width: '100%' }}>
        <div ref={chartRef} className={styles.amChart} />
        <span
          style={{
            position: 'absolute',
            top: 6,
            left: 2,
            fontSize: 11,
            fontWeight: 700,
            color: '#DC3545',
            fontFamily: 'Inter, -apple-system, sans-serif',
            background: 'rgba(255,255,255,0.85)',
            padding: '0 4px',
            borderRadius: 2,
            zIndex: 2,
            pointerEvents: 'none',
            lineHeight: 1,
          }}
        >
          {max} GB
        </span>
      </div>
      {insight && (
        <div className={styles.trendInsight}>
          {insight.split(/(\d+(?:\.\d+)?)/).map((part, i) =>
            /^\d/.test(part)
              ? <strong key={i}>{part}</strong>
              : part
          )}
        </div>
      )}
    </>
  );
}



function ExtrasGrid({ addons, urgency }) {
  const { startChat } = useChatActions();
  const dataUrgent = urgency === 'cap' || urgency === 'low';
  const sorted = dataUrgent
    ? [...EXTRAS_CATALOG].sort((a) => (a.id.startsWith('data') ? -1 : 1))
    : EXTRAS_CATALOG;
  return (
    <div className={styles.extrasSection}>
      <span className={styles.extrasLabel}>Extras you can add to your account</span>
      <div className={styles.extrasGrid}>
        {sorted.map((extra) => (
          <AddonCard
            key={extra.id}
            variant={extra.variant}
            title={extra.title}
            desc={extra.desc}
            price={extra.price}
            recommended={dataUrgent && extra.id.startsWith('data')}
            isActive={addons.includes(extra.id)}
            ctaLabel={extra.ctaLabel}
            onClick={() => startChat(extra.ctaPrompt)}
          />
        ))}
      </div>
    </div>
  );
}

export default function MiniDashboard({ onAddOnClick }) {
  const { state } = useChat();
  const persona = state.persona;
  // Support both new shape (persona.account) and legacy flat shape
  const account = persona.account || persona;

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

  // Urgency derived from account data
  const urgency = dataPercent === 0 ? 'cap'
    : dataPercent !== null && dataPercent < 20 ? 'low'
    : addons.length > 0 ? 'intl'
    : isEmpty ? 'empty'
    : 'normal';

  if (isEmpty) {
    return (
      <>
        <div className={styles.mosaic}>
          <div className={`${styles.tile} ${styles.tileData}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className={styles.tileLabel}>Data</div>
            <div className={styles.dataGB} style={{ color: '#6B7280', fontSize: '1rem' }}>No plan</div>
            <div className={styles.dataSub}>Activate to start</div>
          </div>
          <div className={`${styles.tile} ${styles.tilePlan}`}>
            <div className={styles.planAccent} />
            <div className={styles.tileLabel}>Your Plan</div>
            <div className={styles.planName} style={{ color: '#6B7280' }}>Not activated</div>
            <div className={styles.planBadge} style={{ background: 'rgba(0,181,173,0.12)', color: '#00B5AD' }}>NEW</div>
          </div>
          <div className={`${styles.tile} ${styles.tileNetwork}`}>
            <div className={styles.tileLabel}>Data Usage Trend</div>
            <UsageTrend data={account.usageHistory || []} dataTotal={account.dataTotal} />
          </div>
          <div className={`${styles.tile} ${styles.tileRenew}`}>
            <div className={styles.tileLabel}>Renews In</div>
            <div className={styles.renewDays} style={{ color: '#6B7280', fontSize: '1.2rem' }}>—</div>
            <div className={styles.renewDate}>After activation</div>
          </div>
          <div className={`${styles.tile} ${styles.tileRewards}`}>
            <div className={styles.tileLabel}>Rewards</div>
            <div className={styles.rewardsPoints} style={{ color: '#6B7280' }}>0</div>
            <div className={styles.rewardsUnit}>points</div>
          </div>
          <div className={`${styles.tile} ${styles.tileDisney}`}>
            <div className={styles.tileLabel} style={{ color: 'rgba(255,255,255,0.6)' }}>Entertainment</div>
            <div className={styles.disneyLogo}>
              <DisneyPlusBadge />
            </div>
            <div className={styles.disneySubtitle}>Included with your plan</div>
            <span className={styles.disneyActiveBadge}><span style={{ color: '#28A745' }}>●</span> Extras</span>
            <div className={styles.disneyStream}>Stream now →</div>
          </div>
        </div>
        {/* Extras / Add-ons — dark gradient visual cards */}
        <ExtrasGrid addons={addons} urgency="empty" />
      </>
    );
  }

  return (
    <>
      <div className={styles.mosaic}>
        {/* Tile A — Data */}
        <div className={`${styles.tile} ${styles.tileData}`}>
          <div className={styles.tileLabel}>Data Left</div>
          <HalfDialGauge
            pct={dataPercent || 0}
            color={dataColor}
            dataRemaining={dataRemaining}
            dataTotal={dataTotal}
            urgency={urgency}
          />
        </div>

        {/* Tile B — Your Plan */}
        <div className={`${styles.tile} ${styles.tilePlan}`}>
          {/* Label left, pill top-right */}
          <div className={styles.planHeader}>
            <div className={styles.tileLabelLight}>Your Plan</div>
            <div className={urgency === 'cap' ? styles.planNamePillUrgent : styles.planNamePill}>
              {account.plan || '—'}
            </div>
          </div>
          <div className={styles.planPriceHero}>{account.planPrice || '—'}</div>
          {dataTotal && <div className={styles.planDataLineDark}>{parseFloat(dataTotal).toFixed(0)} GB / month</div>}
          {/* Plan benefit */}
          <div className={styles.planBenefitLine}>Unlimited Talk &amp; Text</div>
          {urgency === 'cap' && <div className={styles.planUpgradeDark}>Unlimited available →</div>}
          {account.autoPayEnabled === false && (
            <div className={styles.planAutoPayDark}>AutoPay off — save $5/mo</div>
          )}
        </div>

        {/* Tile C — Usage Trend */}
        <div className={`${styles.tile} ${styles.tileNetwork}`}>
          <div className={styles.tileLabel}>Data Usage Trend</div>
          <UsageTrend data={account.usageHistory || []} dataTotal={account.dataTotal} />
        </div>

        {/* Tile D — Renews In */}
        <div className={`${styles.tile} ${styles.tileRenew} ${renewUrgent ? styles.tileRenewUrgent : ''}`}>
          <div className={styles.tileHeader}>
            <div className={styles.tileLabel}>Renews In</div>
            <div className={styles.tileIconWrap} style={{
              background: renewUrgent ? 'rgba(255,193,7,0.12)' : 'rgba(0,181,173,0.1)',
              border: renewUrgent ? '1px solid rgba(255,193,7,0.28)' : '1px solid rgba(0,181,173,0.2)',
            }}>
              <CalendarBlank size={13} weight="duotone" color={renewUrgent ? '#FFC107' : '#00B5AD'} />
            </div>
          </div>
          <div className={styles.renewDays} style={{ color: renewUrgent ? '#FFC107' : '#00B5AD' }}>
            {daysUntilRenewal !== null ? daysUntilRenewal : '—'}
            {daysUntilRenewal !== null && <span className={styles.renewUnit}>d</span>}
          </div>
          <div className={styles.renewDate}>{renewalDate || '—'}</div>
          {daysUntilRenewal !== null && (
            <div className={styles.renewCycleBar}>
              <div className={styles.renewCycleFill}
                style={{
                  width: `${Math.max(5, Math.min(95, ((30 - daysUntilRenewal) / 30) * 100))}%`,
                  background: renewUrgent
                    ? 'linear-gradient(90deg, #FFC107, #FFD54F)'
                    : 'linear-gradient(90deg, #00B5AD, #00d4cb)',
                }} />
            </div>
          )}
          {account.planPrice && renewalDate && (
            <div className={styles.renewDue}>{account.planPrice} due {renewalDate}</div>
          )}
          {account.autoPayEnabled === false && (
            <div className={styles.renewAutoPay}>AutoPay off</div>
          )}
        </div>

        {/* Tile E — Rewards */}
        <div className={`${styles.tile} ${styles.tileRewards}`}>
          <div className={styles.tileHeader}>
            <div className={styles.tileLabel}>Rewards</div>
            <div className={styles.tileIconWrap} style={{ background: 'rgba(0,181,173,0.1)', border: '1px solid rgba(0,181,173,0.2)' }}>
              <Star size={13} weight="fill" color="#00B5AD" />
            </div>
          </div>
          <div className={styles.rewardsPoints} style={{ color: '#00B5AD' }}>
            {account.rewardsPoints?.toLocaleString() || '0'}
          </div>
          <div className={styles.rewardsUnit}>points toward free add-on</div>
          <div className={styles.rewardsProgress}>
            <div className={styles.rewardsProgressFill}
              style={{ width: `${Math.min(100, ((account.rewardsPoints || 0) / 1000) * 100)}%` }} />
          </div>
          {account.rewardsPoints >= 1000 ? (
            <div className={styles.rewardsBadge}>FREE ADD-ON READY</div>
          ) : (
            <div className={styles.rewardsToGo}>
              <span className={styles.rewardsToGoNum}>{(1000 - (account.rewardsPoints || 0)).toLocaleString()}</span> pts to go
            </div>
          )}
          {account.rewardsExpiring && account.rewardsExpiringDays !== undefined ? (
            <div className={styles.rewardsExpiry}>
              {account.rewardsExpiring} pts expiring in {account.rewardsExpiringDays}d
            </div>
          ) : null}
        </div>

        {/* Tile F — Disney+ */}
        <div className={`${styles.tile} ${styles.tileDisney}`}>
          <div className={styles.tileLabel} style={{ color: 'rgba(255,255,255,0.6)' }}>Entertainment</div>
          <div className={styles.disneyLogo}>
            <DisneyPlusBadge />
          </div>
          <div className={styles.disneySubtitle}>Included with your plan</div>
          <span className={styles.disneyActiveBadge}><span style={{ color: '#28A745' }}>●</span> Extras</span>
          <div className={styles.disneyStream}>Stream now →</div>
        </div>
      </div>

      {/* Extras / Add-ons — AddonCard components */}
      <ExtrasGrid addons={addons} urgency={urgency} />
    </>
  );
}

