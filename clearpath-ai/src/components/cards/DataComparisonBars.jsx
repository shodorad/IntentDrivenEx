import { Box, Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { useChat } from '../../context/ChatContext';
import { PLANS } from '../../data/products';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const plan = payload[0]?.payload;
  return (
    <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1, minWidth: 150 }}>
      <Typography variant="caption" fontWeight={700} display="block">{label}</Typography>
      <Typography variant="caption" color="text.secondary">{plan?.dataLabel}</Typography>
      {plan?.price != null && (
        <Typography variant="caption" display="block" fontWeight={600}>
          ${plan.price}/mo
        </Typography>
      )}
    </Box>
  );
};

export default function DataComparisonBars({ data = {} }) {
  const { state } = useChat();
  const account = state.persona?.account || {};

  const plans = PLANS?.length ? PLANS : [
    { name: 'Total Base 5G',         data: 'Unlimited', hotspot: '5GB',   price: 20 },
    { name: 'Total 5G Unlimited',    data: 'Unlimited', hotspot: '15GB',  price: 35 },
    { name: 'Total 5G+ Unlimited',   data: 'Unlimited', hotspot: '30GB',  price: 50 },
  ];

  const hotspotValues = { '5GB': 5, '10GB': 10, '15GB': 15, '20GB': 20, '30GB': 30, 'None': 0, 'Unlimited': 60 };

  const chartData = plans.map((plan) => {
    const hotspotGB = hotspotValues[plan.hotspot] ?? parseInt(plan.hotspot) ?? 0;
    const isCurrent = plan.name === account.plan || plan.id === account.planId;
    return {
      name: plan.name.replace('Total ', '').replace(' Unlimited', ' Unl.'),
      fullName: plan.name,
      hotspot: hotspotGB,
      dataLabel: plan.data === 'Unlimited' ? `Unlimited data • ${plan.hotspot || 'N/A'} hotspot` : `${plan.data} data`,
      price: plan.price,
      isCurrent,
    };
  });

  const maxHotspot = Math.max(...chartData.map(d => d.hotspot), 1);

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">Plans Compared</Typography>
          <Chip
            label="All plans: Unlimited data"
            size="small"
            sx={{ backgroundColor: 'rgba(0,181,173,0.1)', color: '#00B5AD', fontWeight: 600, fontSize: '0.65rem' }}
          />
        </Stack>
        <Typography variant="caption" color="text.secondary" mb={2.5} display="block">
          Hotspot allowance by plan — all include unlimited talk, text & data
        </Typography>

        <Box sx={{ height: 180, mx: -0.5 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 56, bottom: 0, left: 4 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.06)" />
              <XAxis type="number" domain={[0, maxHotspot + 5]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} unit=" GB" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Bar dataKey="hotspot" radius={[0, 4, 4, 0]} maxBarSize={28}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.isCurrent ? '#00B5AD' : '#CBD5E1'}
                  />
                ))}
                <LabelList
                  dataKey="price"
                  position="right"
                  formatter={(v) => v > 0 ? `$${v}/mo` : 'See site'}
                  style={{ fontSize: 11, fontWeight: 600, fill: '#6B7280' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* "You are here" indicator */}
        {chartData.some(d => d.isCurrent) && (
          <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, backgroundColor: 'rgba(0,181,173,0.06)', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#00B5AD', flexShrink: 0 }} />
            <Typography variant="caption" color="text.secondary">
              Teal bar = your current plan ({account.plan})
            </Typography>
          </Box>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontStyle: 'italic' }}>
          * All plans include unlimited data. Hotspot uses high-speed data; additional usage may be throttled.
        </Typography>
      </CardContent>
    </Card>
  );
}
