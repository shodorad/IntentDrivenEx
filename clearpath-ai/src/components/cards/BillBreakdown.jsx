import { Box, Card, CardContent, Typography, Chip, Stack, Divider } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useChat } from '../../context/ChatContext';

const COLORS = ['#00B5AD', '#0D2137', '#FFC107', '#DC3545'];

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

  const planCost = parseFloat(String(account.planPrice).replace(/[^0-9.]/g, '')) || 20;
  const taxes    = +(planCost * 0.15).toFixed(2);
  const addons   = data?.addons || 0;
  const autopayDiscount = account.autoPayEnabled ? 5 : 0;
  const total    = +(planCost + taxes + addons - autopayDiscount).toFixed(2);

  const segments = [
    { name: 'Plan', value: planCost },
    { name: 'Taxes & Fees', value: taxes },
    ...(addons > 0    ? [{ name: 'Add-ons', value: addons }] : []),
    ...(autopayDiscount > 0 ? [{ name: 'AutoPay Discount', value: -autopayDiscount }] : []),
  ].filter(s => s.value > 0);

  const segmentsWithPercent = segments.map(s => ({
    ...s,
    percent: s.value / segments.reduce((a, b) => a + b.value, 0),
  }));

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
          <Typography variant="h6">Bill Breakdown</Typography>
          {account.autoPayEnabled && (
            <Chip
              label="AutoPay —$5"
              size="small"
              sx={{ backgroundColor: 'rgba(40,167,69,0.1)', color: '#28A745', fontWeight: 600 }}
            />
          )}
        </Stack>

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
                  {segmentsWithPercent.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1.1rem', lineHeight: 1 }}>${total}</Typography>
              <Typography variant="caption" color="text.secondary">total</Typography>
            </Box>
          </Box>

          {/* Legend */}
          <Stack spacing={1} flex={1}>
            {segmentsWithPercent.map((seg, i) => (
              <Stack key={seg.name} direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <Typography variant="caption" color="text.secondary">{seg.name}</Typography>
                </Stack>
                <Typography variant="caption" fontWeight={700}>${seg.value.toFixed(2)}</Typography>
              </Stack>
            ))}
            <Divider sx={{ my: 0.25 }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" fontWeight={700}>Total</Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: '#00B5AD' }}>${total}</Typography>
            </Stack>
          </Stack>
        </Stack>

        {autopayDiscount > 0 && (
          <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, backgroundColor: 'rgba(40,167,69,0.06)', textAlign: 'center' }}>
            <Typography variant="caption" color="success.main">
              You save $5/mo with AutoPay — that's $60/year
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
