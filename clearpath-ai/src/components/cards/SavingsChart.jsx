import { Box, Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { useChat } from '../../context/ChatContext';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const saving = (payload[0]?.value || 0) - (payload[1]?.value || 0);
  return (
    <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1, minWidth: 140 }}>
      <Typography variant="caption" fontWeight={700} display="block">{label}</Typography>
      {payload.map((p) => (
        <Stack key={p.dataKey} direction="row" justifyContent="space-between" spacing={2}>
          <Typography variant="caption" sx={{ color: p.color }}>{p.name}</Typography>
          <Typography variant="caption" fontWeight={600}>${p.value}</Typography>
        </Stack>
      ))}
      {saving > 0 && (
        <Typography variant="caption" color="success.main" display="block" mt={0.25}>
          Saved so far: ${saving}
        </Typography>
      )}
    </Box>
  );
};

export default function SavingsChart({ data = {} }) {
  const { state } = useChat();
  const account = state.persona?.account || {};

  const currentPrice = data?.currentPrice
    || parseFloat(String(account.planPrice).replace(/[^0-9.]/g, ''))
    || 45;
  const newPrice = data?.newPrice || Math.max(20, currentPrice - 20);
  const newPlanName = data?.newPlanName || 'Total Base 5G';

  const totalSavings = (currentPrice - newPrice) * 12;

  const chartData = MONTHS.map((month, i) => ({
    month,
    [`Current ($${currentPrice}/mo)`]: currentPrice * (i + 1),
    [`${newPlanName} ($${newPrice}/mo)`]: newPrice * (i + 1),
  }));

  const currentKey = `Current ($${currentPrice}/mo)`;
  const newKey = `${newPlanName} ($${newPrice}/mo)`;

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
          <Typography variant="h6">12-Month Savings</Typography>
          <Chip
            label={`Save $${totalSavings}/year`}
            size="small"
            sx={{ backgroundColor: 'rgba(40,167,69,0.12)', color: '#28A745', fontWeight: 700 }}
          />
        </Stack>

        <Box sx={{ height: 190, mx: -1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 12, bottom: 0, left: 4 }}>
              <defs>
                <linearGradient id="gradCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC3545" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#DC3545" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00B5AD" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00B5AD" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey={currentKey} stroke="#DC3545" strokeWidth={2} fill="url(#gradCurrent)" dot={false} />
              <Area type="monotone" dataKey={newKey} stroke="#00B5AD" strokeWidth={2} fill="url(#gradNew)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <Stack direction="row" spacing={1.5} mt={2.5}>
          {[
            { label: 'Current Plan',   value: `$${currentPrice}/mo`, color: '#DC3545' },
            { label: newPlanName,      value: `$${newPrice}/mo`,     color: '#00B5AD' },
            { label: 'Annual Savings', value: `$${totalSavings}`,    color: '#28A745' },
          ].map((stat) => (
            <Box key={stat.label} sx={{ flex: 1, textAlign: 'center', p: 1.5, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Typography fontWeight={700} sx={{ color: stat.color, fontSize: '0.95rem', lineHeight: 1.2 }}>{stat.value}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', lineHeight: 1.3 }}>{stat.label}</Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
