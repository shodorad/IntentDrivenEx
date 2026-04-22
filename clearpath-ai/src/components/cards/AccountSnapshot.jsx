import { Box, Card, CardContent, Typography, Stack, Chip, LinearProgress, Divider, Grid } from '@mui/material';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StarIcon from '@mui/icons-material/Star';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useChat } from '../../context/ChatContext';

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
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </Box>
        <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.05em">
          {label}
        </Typography>
      </Stack>
      <Typography variant="h5" fontWeight={700} sx={{ color, fontSize: '1.1rem', mt: 0.5 }}>
        {value}
      </Typography>
      {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
      {progress !== undefined && (
        <LinearProgress variant="determinate" value={progress} sx={{ mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: color } }} />
      )}
    </Box>
  );
}

export default function AccountSnapshot({ data = {} }) {
  const { state } = useChat();
  const account = state.persona?.account || {};

  // LLM mode: prefer data prop; fall back to persona
  const a = {
    plan:             data.plan             || account.plan,
    dataRemaining:    data.dataRemaining    || account.dataRemaining,
    dataTotal:        data.dataTotal        || account.dataTotal,
    dataPercent:      data.dataPercent      ?? account.dataPercent,
    renewalDate:      data.renewalDate      || account.renewalDate,
    daysUntilRenewal: data.daysUntilRenewal ?? account.daysUntilRenewal,
    autoPayEnabled:   data.autoPayEnabled   ?? account.autoPayEnabled,
    rewardsPoints:    data.rewardsPoints    ?? account.rewardsPoints,
    device:           data.device           || account.device,
    savedCard:        data.savedCard        || account.savedCard,
  };

  const pct    = parseFloat(a.dataPercent) || 16;
  const statusColor = pct <= 20 ? '#DC3545' : pct <= 50 ? '#FFC107' : '#00B5AD';

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
      icon: <CalendarTodayIcon sx={{ fontSize: 16, color: '#6B7280' }} />,
      label: 'Renews',
      value: a.renewalDate || 'Apr 9',
      sub:   `${a.daysUntilRenewal || 14} days away`,
      color: '#6B7280',
    },
    {
      icon: <AutorenewIcon sx={{ fontSize: 16, color: '#00B5AD' }} />,
      label: 'AutoPay',
      value: a.autoPayEnabled ? 'On' : 'Off',
      sub:   a.autoPayEnabled ? 'Saving $5/mo' : 'Enable to save $5/mo',
      color: a.autoPayEnabled ? '#28A745' : '#FFC107',
    },
    {
      icon: <StarIcon sx={{ fontSize: 16, color: '#FFC107' }} />,
      label: 'Rewards',
      value: `${a.rewardsPoints || 0} pts`,
      sub:   a.rewardsPoints >= 1000 ? 'Enough for free add-on!' : `${1000 - (a.rewardsPoints || 0)} pts to free add-on`,
      color: '#FFC107',
      progress: Math.min((a.rewardsPoints || 0) / 10, 100),
    },
    {
      icon: <PhoneAndroidIcon sx={{ fontSize: 16, color: '#6B7280' }} />,
      label: 'Device',
      value: (a.device || 'Unknown').split(' ').slice(-1)[0],
      sub:   a.device || 'Unknown device',
      color: '#6B7280',
    },
    {
      icon: <CreditCardIcon sx={{ fontSize: 16, color: '#6B7280' }} />,
      label: 'Payment',
      value: a.savedCard ? `····${a.savedCard.slice(-4)}` : 'On file',
      sub:   'Saved card',
      color: '#6B7280',
    },
  ];

  return (
    <Card sx={{ mt: 1, mb: 0.5 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Account Overview</Typography>
          <Chip label={a.plan || 'Total Base 5G'} size="small" color="primary" />
        </Stack>
        <Divider sx={{ mb: 2 }} />
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
