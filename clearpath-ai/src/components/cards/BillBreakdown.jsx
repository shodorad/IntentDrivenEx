import { Box, Card, CardContent, Typography, Chip, Stack, Divider } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useChat } from '../../context/ChatContext';
import { CARD_HEADER_TEAL, CARD_HOVER, BILL_COLORS, CHART_COLORS, HEADER_CHIP_SX } from './cardStyles';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}>
      <Typography variant="caption" fontWeight={700}>{payload[0].name}</Typography>
      <Typography variant="caption" display="block" color="text.secondary">
        ${payload[0].value.toFixed(2)} ({Math.round(payload[0].payload.percent * 100)}%)
      </Typography>
    </Box>
  );
};

export default function BillBreakdown({ data = {} }) {
  const { state } = useChat();
  const account = state.persona?.account || {};

  const planCost       = parseFloat(String(account.planPrice).replace(/[^0-9.]/g, '')) || 20;
  const taxes          = +(planCost * 0.15).toFixed(2);
  const addons         = data?.addons || 0;
  const autopayDiscount = account.autoPayEnabled ? 5 : 0;
  const total          = +(planCost + taxes + addons - autopayDiscount).toFixed(2);

  const segments = [
    { name: 'Plan',             value: planCost },
    { name: 'Taxes & Fees',     value: taxes    },
    ...(addons > 0             ? [{ name: 'Add-ons',          value: addons          }] : []),
    ...(autopayDiscount > 0    ? [{ name: 'AutoPay Discount', value: -autopayDiscount }] : []),
  ].filter(s => s.value > 0);

  const segmentsWithPercent = segments.map(s => ({
    ...s,
    percent: s.value / segments.reduce((a, b) => a + b.value, 0),
  }));

  return (
    <Card sx={{ ...CARD_HOVER, boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
      {/* Gradient header */}
      <Box sx={CARD_HEADER_TEAL}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Bill Breakdown</Typography>
          {account.autoPayEnabled && (
            <Chip label="AutoPay —$5" size="small" sx={HEADER_CHIP_SX} />
          )}
        </Stack>
      </Box>

      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Donut chart */}
          <Box sx={{ width: 140, height: 140, flexShrink: 0, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segmentsWithPercent}
                  cx="50%"
                  cy="50%"
                  innerRadius={44}
                  outerRadius={66}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {segmentsWithPercent.map((seg) => (
                    <Cell key={seg.name} fill={BILL_COLORS[seg.name] || CHART_COLORS[0]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <Typography fontWeight={800} sx={{ fontSize: '1.3rem', lineHeight: 1, color: 'text.primary' }}>${total}</Typography>
              <Typography variant="caption" color="text.secondary">total</Typography>
            </Box>
          </Box>

          {/* Legend */}
          <Stack spacing={1} flex={1}>
            {segmentsWithPercent.map((seg) => (
              <Stack key={seg.name} direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: BILL_COLORS[seg.name] || CHART_COLORS[0], flexShrink: 0 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78rem' }}>{seg.name}</Typography>
                </Stack>
                <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.78rem' }}>${seg.value.toFixed(2)}</Typography>
              </Stack>
            ))}
            <Divider sx={{ my: 0.25 }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" fontWeight={700}>Total</Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: CHART_COLORS[0] }}>${total}</Typography>
            </Stack>
          </Stack>
        </Stack>

        {autopayDiscount > 0 && (
          <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, backgroundColor: 'var(--teal-subtle)', textAlign: 'center' }}>
            <Typography variant="caption" color="success.main">
              You save $5/mo with AutoPay — that's $60/year
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
