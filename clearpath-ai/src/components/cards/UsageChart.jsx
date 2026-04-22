import { Box, Card, CardContent, Typography, Chip, LinearProgress, Stack } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useChat } from '../../context/ChatContext';

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

  // LLM mode: prefer data prop; fall back to persona
  const totalGB  = parseFloat(data.dataTotal   || account.dataTotal)     || 5;
  const remaining = parseFloat(data.dataRemaining || account.dataRemaining) || 0.8;
  const usedGB   = totalGB - remaining;
  const pctUsed  = Math.round((usedGB / totalGB) * 100);
  const daysLeft = data.daysUntilRenewal || account.daysUntilRenewal || 14;

  const usagePoints = generateUsageData(totalGB, usedGB);
  const xLabels     = usagePoints.map((_, i) => i === 0 ? 'Start' : i === 30 ? 'Today' : `Day ${i}`);

  const statusColor = pctUsed >= 90 ? '#DC3545' : pctUsed >= 70 ? '#FFC107' : '#00B5AD';
  const trending    = usedGB / (30 - daysLeft) > totalGB / 30;

  return (
    <Card sx={{ mt: 1, mb: 0.5 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Data Usage</Typography>
          <Chip
            icon={trending ? <TrendingUpIcon sx={{ fontSize: 14 }} /> : <TrendingDownIcon sx={{ fontSize: 14 }} />}
            label={trending ? 'Trending high' : 'On track'}
            size="small"
            sx={{
              backgroundColor: trending ? 'rgba(220,53,69,0.1)' : 'rgba(40,167,69,0.1)',
              color: trending ? '#DC3545' : '#28A745',
              fontWeight: 600,
            }}
          />
        </Stack>

        {/* Usage bar */}
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
          sx={{
            mb: 2,
            '& .MuiLinearProgress-bar': { backgroundColor: statusColor },
          }}
        />

        {/* Line chart */}
        <Box sx={{ height: 140, mx: -1 }}>
          <LineChart
            xAxis={[{ data: xLabels.filter((_, i) => i % 5 === 0 || i === 30), scaleType: 'point', tickLabelStyle: { fontSize: 10 } }]}
            series={[{
              data: usagePoints.filter((_, i) => i % 5 === 0 || i === 30),
              color: statusColor,
              area: true,
              showMark: false,
            }]}
            height={140}
            margin={{ top: 8, right: 8, bottom: 24, left: 32 }}
            sx={{
              '& .MuiAreaElement-root': { fill: `${statusColor}18` },
              '& .MuiLineElement-root': { strokeWidth: 2 },
            }}
          />
        </Box>

        {/* Stats row */}
        <Stack direction="row" spacing={2} mt={1.5}>
          {[
            { label: 'Remaining', value: `${data.dataRemaining || account.dataRemaining || '0.8 GB'}`, color: statusColor },
            { label: 'Days left',  value: `${daysLeft}d`,  color: '#6B7280' },
            { label: 'Daily avg',  value: `${(usedGB / Math.max(30 - daysLeft, 1)).toFixed(2)} GB`, color: '#6B7280' },
          ].map((stat) => (
            <Box key={stat.label} sx={{ flex: 1, textAlign: 'center', p: 1, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.03)' }}>
              <Typography variant="h6" sx={{ color: stat.color, fontSize: '1rem' }}>{stat.value}</Typography>
              <Typography variant="caption">{stat.label}</Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
