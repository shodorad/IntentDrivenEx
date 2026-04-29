import { Box, Card, CardContent, Typography, Stack, Chip, LinearProgress, Grid } from '@mui/material';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StarIcon from '@mui/icons-material/Star';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useChat } from '../../context/ChatContext';
import { CARD_HEADER_NAVY, CARD_HOVER, CHART_COLORS, HEADER_CHIP_SX } from './cardStyles';

function StatTile({ icon, label, value, sub, color = '#00B5AD', progress }) {
  return (
    <Box sx={{
      p: 1.5,
      borderRadius: 2,
      border: '1px solid rgba(0,0,0,0.06)',
      backgroundColor: '#fff',
      height: '100%',
    }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
        <Box sx={{
          width: 28, height: 28, borderRadius: 1.5,
          backgroundColor: `${color}18`,
          border: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </Box>
        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.65rem' }}>
          {label}
        </Typography>
      </Stack>
      <Typography fontWeight={700} sx={{ color, fontSize: '0.95rem', mt: 0.5, lineHeight: 1.2 }}>
        {value}
      </Typography>
      {sub && (
        <Typography variant="caption" color="text.secondary" sx={{
          display: 'block', mt: 0.25,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {sub}
        </Typography>
      )}
      {progress !== undefined && (
        <LinearProgress variant="determinate" value={progress} sx={{ mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: color } }} />
      )}
    </Box>
  );
}

export default function AccountSnapshot({ data = {} }) {
  const { state } = useChat();
  const a = state.persona?.account || {};

  const pct         = parseFloat(a.dataPercent) || 16;
  const statusColor = pct <= 20 ? CHART_COLORS[3] : pct <= 50 ? CHART_COLORS[2] : CHART_COLORS[0];

  const tiles = [
    {
      icon: <DataUsageIcon sx={{ fontSize: 16, color: statusColor }} />,
      label: 'Data Left',
      value: a.dataRemaining || '0.8 GB',
      sub:   `of ${a.dataTotal || '5 GB'} plan`,
      color: statusColor,
      progress: pct,
    },
    {
      icon: <CalendarTodayIcon sx={{ fontSize: 16, color: CHART_COLORS[5] }} />,
      label: 'Renews',
      value: a.renewalDate || 'Apr 9',
      sub:   `${a.daysUntilRenewal || 14} days away`,
      color: CHART_COLORS[5],
    },
    {
      icon: <AutorenewIcon sx={{ fontSize: 16, color: CHART_COLORS[0] }} />,
      label: 'AutoPay',
      value: a.autoPayEnabled ? 'On' : 'Off',
      sub:   a.autoPayEnabled ? 'Saving $5/mo' : 'Enable to save $5/mo',
      color: a.autoPayEnabled ? CHART_COLORS[4] : CHART_COLORS[2],
    },
    {
      icon: <StarIcon sx={{ fontSize: 16, color: CHART_COLORS[2] }} />,
      label: 'Rewards',
      value: `${a.rewardsPoints || 0} pts`,
      sub:   a.rewardsPoints >= 1000 ? 'Enough for free add-on!' : `${1000 - (a.rewardsPoints || 0)} pts to free add-on`,
      color: CHART_COLORS[2],
      progress: Math.min((a.rewardsPoints || 0) / 10, 100),
    },
    {
      icon: <PhoneAndroidIcon sx={{ fontSize: 16, color: CHART_COLORS[5] }} />,
      label: 'Device',
      value: a.device || 'Unknown',
      sub:   'Your current device',
      color: CHART_COLORS[5],
    },
    {
      icon: <CreditCardIcon sx={{ fontSize: 16, color: CHART_COLORS[5] }} />,
      label: 'Payment',
      value: a.savedCard ? `····${a.savedCard.slice(-4)}` : 'On file',
      sub:   'Saved card',
      color: CHART_COLORS[5],
    },
  ];

  return (
    <Card sx={{ mt: 1, mb: 0.5, ...CARD_HOVER, boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
      {/* Gradient header */}
      <Box sx={CARD_HEADER_NAVY}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Account Overview</Typography>
          <Chip
            label={a.plan || 'Total Base 5G'}
            size="small"
            sx={HEADER_CHIP_SX}
          />
        </Stack>
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Grid container spacing={1.5}>
          {tiles.map((tile) => (
            <Grid item xs={6} sm={4} key={tile.label}>
              <StatTile {...tile} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
