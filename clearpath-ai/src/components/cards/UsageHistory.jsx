import { Box, Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts';
import { useChat } from '../../context/ChatContext';

function generateSyntheticHistory(usedGB, totalGB) {
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  return months.map((month, i) => ({
    month,
    used: Math.min(
      totalGB,
      Math.max(0.1, +(usedGB * (0.8 + Math.random() * 0.4)).toFixed(1))
    ),
  }));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}>
      <Typography variant="caption" fontWeight={700}>{label}</Typography>
      <Typography variant="caption" display="block" color="text.secondary">
        {payload[0]?.value} GB used
      </Typography>
    </Box>
  );
};

export default function UsageHistory({ data = {} }) {
  const { state } = useChat();
  const account = state.persona?.account || {};

  const totalGB = parseFloat(account.dataTotal) || 5;
  const usedGB = totalGB - (parseFloat(account.dataRemaining) || 0.8);

  const history = account.usageHistory?.length
    ? account.usageHistory
    : generateSyntheticHistory(usedGB, totalGB);

  const avg = +(history.reduce((s, h) => s + h.used, 0) / history.length).toFixed(1);
  const overCount = history.filter(h => h.used >= totalGB).length;

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
          <Typography variant="h6">Usage History</Typography>
          <Chip
            label={`${history.length}-month avg: ${avg} GB`}
            size="small"
            sx={{ backgroundColor: 'rgba(0,181,173,0.1)', color: '#00B5AD', fontWeight: 600 }}
          />
        </Stack>

        <Box sx={{ height: 180, mx: -1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={history} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, totalGB + 0.5]} unit=" GB" width={42} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <ReferenceLine y={totalGB} stroke="#DC3545" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: `${totalGB} GB limit`, position: 'insideTopRight', fontSize: 10, fill: '#DC3545' }} />
              <Bar dataKey="used" radius={[4, 4, 0, 0]} maxBarSize={36}>
                {history.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.used >= totalGB ? '#DC3545' : entry.used >= totalGB * 0.8 ? '#FFC107' : '#00B5AD'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Stack direction="row" spacing={1.5} mt={2.5}>
          {[
            { label: 'Monthly Avg', value: `${avg} GB`, color: '#00B5AD' },
            { label: 'Plan Limit',  value: `${totalGB} GB`, color: '#6B7280' },
            { label: 'Months Over', value: overCount > 0 ? `${overCount}x` : 'None', color: overCount > 0 ? '#DC3545' : '#28A745' },
          ].map((stat) => (
            <Box key={stat.label} sx={{ flex: 1, textAlign: 'center', p: 1.5, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Typography fontWeight={700} sx={{ color: stat.color, fontSize: '1rem', lineHeight: 1.2 }}>{stat.value}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>{stat.label}</Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
