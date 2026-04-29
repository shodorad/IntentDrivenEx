import { Box, Card, CardContent, Typography, Chip, LinearProgress, Stack } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useChat } from '../../context/ChatContext';
import { CARD_HEADER_TEAL, CARD_HOVER, STAT_TILE, CHART_COLORS, HEADER_CHIP_SX } from './cardStyles';

function generateUsageData(totalGB, usedGB) {
  const days = 30;
  const points = [];
  for (let i = 0; i <= days; i++) {
    const progress = i / days;
    const noise = (Math.random() - 0.5) * 0.3;
    points.push(Math.max(0, Math.round((usedGB * progress + noise) * 10) / 10));
  }
  return points;
}

export default function UsageChart({ data = {} }) {
  const { state } = useChat();
  const account = state.persona?.account || {};
  const chartType = data.chartType || 'line';

  const totalGB  = parseFloat(account.dataTotal)     || 5;
  const usedGB   = totalGB - (parseFloat(account.dataRemaining) || 0.8);
  const pctUsed  = Math.round((usedGB / totalGB) * 100);
  const daysLeft = account.daysUntilRenewal || 14;

  const usagePoints = generateUsageData(totalGB, usedGB);

  const statusColor = pctUsed >= 90 ? CHART_COLORS[3] : pctUsed >= 70 ? CHART_COLORS[2] : CHART_COLORS[0];
  const chartColor  = CHART_COLORS[0];
  const trending    = usedGB / (30 - daysLeft) > totalGB / 30;

  // Area chart data (Recharts format)
  const lineData = usagePoints
    .filter((_, i) => i % 5 === 0 || i === 30)
    .map((v, i, arr) => ({
      label: i === 0 ? 'Start' : i === arr.length - 1 ? 'Today' : `Day ${i * 5}`,
      value: v,
    }));

  // Bar chart data — day-by-day usage deltas
  const barData = usagePoints
    .filter((_, i) => i % 5 === 0 || i === 30)
    .map((v, i, arr) => ({
      label: i === 0 ? 'Start' : `Day ${i * 5}`,
      delta: Math.max(0, +(v - (arr[i - 1] ?? 0)).toFixed(2)),
    }));

  const statsRow = (
    <Stack direction="row" spacing={1.5} mt={2}>
      {[
        { label: 'Remaining', value: `${account.dataRemaining || '0.8 GB'}`, color: statusColor },
        { label: 'Days left', value: `${daysLeft}d`,                         color: CHART_COLORS[5] },
        { label: 'Daily avg', value: `${(usedGB / Math.max(30 - daysLeft, 1)).toFixed(2)} GB`, color: CHART_COLORS[5] },
      ].map((stat) => (
        <Box key={stat.label} sx={{ ...STAT_TILE, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography fontWeight={700} sx={{ color: stat.color, fontSize: '1rem', lineHeight: 1.2 }}>{stat.value}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</Typography>
        </Box>
      ))}
    </Stack>
  );

  return (
    <Card sx={{ ...CARD_HOVER, boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
      {/* Gradient header */}
      <Box sx={CARD_HEADER_TEAL}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Data Usage</Typography>
          <Chip
            icon={trending ? <TrendingUpIcon sx={{ fontSize: 14 }} /> : <TrendingDownIcon sx={{ fontSize: 14 }} />}
            label={trending ? 'Trending high' : 'On track'}
            size="small"
            sx={HEADER_CHIP_SX}
          />
        </Stack>
      </Box>

      <CardContent sx={{ p: 2.5 }}>
        {/* Usage progress bar */}
        <Stack direction="row" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2" color="text.secondary">
            {usedGB.toFixed(1)} GB used
          </Typography>
          <Typography variant="body2" fontWeight={700} sx={{ color: statusColor }}>
            {pctUsed}% of {totalGB} GB
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={Math.min(pctUsed, 100)}
          sx={{ mb: 2, '& .MuiLinearProgress-bar': { backgroundColor: statusColor } }}
        />

        {chartType === 'bar' ? (
          <Box sx={{ height: 150, mx: -1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} unit=" GB" width={38} />
                <Tooltip formatter={(v) => [`${v} GB`, 'Used']} />
                <Bar dataKey="delta" radius={[4, 4, 0, 0]} maxBarSize={28}>
                  {barData.map((_, i) => <Cell key={i} fill={chartColor} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box sx={{ height: 150, mx: -1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={chartColor} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} unit=" GB" width={38} />
                <Tooltip formatter={(v) => [`${v} GB`, 'Used']} />
                <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} fill="url(#usageGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        )}

        {statsRow}
      </CardContent>
    </Card>
  );
}
