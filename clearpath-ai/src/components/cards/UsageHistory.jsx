import { Box, Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts';
import { useChat } from '../../context/ChatContext';
import { CARD_HEADER_TEAL, CARD_HOVER, STAT_TILE, CHART_COLORS, HEADER_CHIP_SX } from './cardStyles';

function generateSyntheticHistory(usedGB, totalGB) {
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  return months.map((month) => ({
    month,
    used: Math.min(totalGB, Math.max(0.1, +(usedGB * (0.8 + Math.random() * 0.4)).toFixed(1))),
  }));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}>
      <Typography variant="caption" fontWeight={700}>{label}</Typography>
      <Typography variant="caption" display="block" color="text.secondary">{payload[0]?.value} GB used</Typography>
    </Box>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}>
      <Typography variant="caption" fontWeight={700}>{payload[0].name}</Typography>
      <Typography variant="caption" display="block" color="text.secondary">{payload[0].value} GB</Typography>
    </Box>
  );
};

export default function UsageHistory({ data = {} }) {
  const { state } = useChat();
  const account = state.persona?.account || {};
  const chartType = data.chartType || 'bar';

  const totalGB = parseFloat(account.dataTotal) || 5;
  const usedGB  = totalGB - (parseFloat(account.dataRemaining) || 0.8);

  const history   = account.usageHistory?.length ? account.usageHistory : generateSyntheticHistory(usedGB, totalGB);
  const avg       = +(history.reduce((s, h) => s + h.used, 0) / history.length).toFixed(1);
  const overCount = history.filter(h => h.used >= totalGB).length;

  const statsRow = (
    <Stack direction="row" spacing={1.5} mt={2.5}>
      {[
        { label: 'Monthly Avg', value: `${avg} GB`,    color: CHART_COLORS[0] },
        { label: 'Plan Limit',  value: `${totalGB} GB`, color: CHART_COLORS[5] },
        { label: 'Months Over', value: overCount > 0 ? `${overCount}x` : 'None', color: overCount > 0 ? CHART_COLORS[3] : CHART_COLORS[4] },
      ].map((stat) => (
        <Box key={stat.label} sx={{ ...STAT_TILE, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography fontWeight={700} sx={{ color: stat.color, fontSize: '1rem', lineHeight: 1.2 }}>{stat.value}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</Typography>
        </Box>
      ))}
    </Stack>
  );

  // ── Shared card shell ──────────────────────────────────────────────────────
  const Wrapper = ({ children }) => (
    <Card sx={{ ...CARD_HOVER, boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
      <Box sx={CARD_HEADER_TEAL}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Usage History</Typography>
          <Chip
            label={`${history.length}-month avg: ${avg} GB`}
            size="small"
            sx={HEADER_CHIP_SX}
          />
        </Stack>
      </Box>
      <CardContent sx={{ p: 2.5 }}>
        {children}
        {statsRow}
      </CardContent>
    </Card>
  );

  // ── Pie / Donut ────────────────────────────────────────────────────────────
  if (chartType === 'pie' || chartType === 'donut') {
    const innerRadius = chartType === 'donut' ? 44 : 0;
    const pieData = history.map(h => ({ name: h.month, value: h.used }));

    return (
      <Wrapper>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ width: 160, height: 160, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={innerRadius}
                  outerRadius={70}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {/* Legend — each row is a full-width flex row so space-between works */}
          <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
            {pieData.map((d, i) => (
              <Box
                key={d.name}
                sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: '6px' }}
              >
                <Box sx={{
                  width: 8, height: 8, borderRadius: '50%',
                  backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                  flexShrink: 0,
                }} />
                <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
                  {d.name}
                </Typography>
                <Typography variant="caption" fontWeight={700}>
                  {d.value} GB
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Wrapper>
    );
  }

  // ── Line ──────────────────────────────────────────────────────────────────
  if (chartType === 'line') {
    return (
      <Wrapper>
        <Box sx={{ height: 180, mx: -1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, totalGB + 0.5]} unit=" GB" width={42} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={totalGB} stroke={CHART_COLORS[3]} strokeDasharray="4 3" strokeWidth={1.5} />
              <Line type="monotone" dataKey="used" stroke={CHART_COLORS[0]} strokeWidth={2} dot={{ fill: CHART_COLORS[0], r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Wrapper>
    );
  }

  // ── Bar (default) ─────────────────────────────────────────────────────────
  return (
    <Wrapper>
      <Box sx={{ height: 180, mx: -1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={history} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, totalGB + 0.5]} unit=" GB" width={42} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
            <ReferenceLine
              y={totalGB}
              stroke={CHART_COLORS[3]}
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{ value: `${totalGB} GB limit`, position: 'insideTopRight', fontSize: 10, fill: CHART_COLORS[3] }}
            />
            <Bar dataKey="used" radius={[4, 4, 0, 0]} maxBarSize={36}>
              {history.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    entry.used >= totalGB       ? CHART_COLORS[3] :
                    entry.used >= totalGB * 0.8 ? CHART_COLORS[2] :
                                                  CHART_COLORS[0]
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Wrapper>
  );
}
