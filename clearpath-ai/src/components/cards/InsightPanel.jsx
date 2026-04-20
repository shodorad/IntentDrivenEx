import { Box, Card, CardContent, Typography, Stack, Chip } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SEVERITY_CONFIG = {
  info:    { icon: InfoIcon,          color: '#00B5AD', bg: 'rgba(0,181,173,0.08)',   border: 'rgba(0,181,173,0.2)'   },
  tip:     { icon: LightbulbIcon,     color: '#FFC107', bg: 'rgba(255,193,7,0.08)',   border: 'rgba(255,193,7,0.2)'   },
  warning: { icon: WarningAmberIcon,  color: '#FFC107', bg: 'rgba(255,193,7,0.08)',   border: 'rgba(255,193,7,0.2)'   },
  success: { icon: CheckCircleIcon,   color: '#28A745', bg: 'rgba(40,167,69,0.08)',   border: 'rgba(40,167,69,0.2)'   },
  critical:{ icon: WarningAmberIcon,  color: '#DC3545', bg: 'rgba(220,53,69,0.08)',   border: 'rgba(220,53,69,0.2)'   },
};

export default function InsightPanel({ data = {} }) {
  const severity = data.severity || 'info';
  const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.info;
  const Icon = cfg.icon;

  const insights = data.insights || (data.insight ? [{ text: data.insight }] : [
    { text: 'Only 22% of your usage goes through Wi-Fi — your phone is using cellular most of the time.' },
    { text: 'You\'ve hit your data cap 11 of the last 12 months — a plan upgrade may save money long-term.' },
  ]);

  return (
    <Card sx={{ mt: 1, mb: 0.5, border: `1px solid ${cfg.border}`, backgroundColor: cfg.bg, boxShadow: 'none' }}>
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box sx={{
            width: 32, height: 32, borderRadius: 2,
            backgroundColor: `${cfg.color}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, mt: 0.25,
          }}>
            <Icon sx={{ fontSize: 18, color: cfg.color }} />
          </Box>
          <Box flex={1}>
            {data.title && (
              <Typography variant="body2" fontWeight={700} sx={{ color: cfg.color, mb: 0.75 }}>
                {data.title}
              </Typography>
            )}
            <Stack spacing={0.75}>
              {insights.map((item, idx) => (
                <Typography key={idx} variant="body2" color="text.primary" lineHeight={1.5}>
                  {item.text}
                </Typography>
              ))}
            </Stack>
            {data.tags && (
              <Stack direction="row" spacing={0.75} mt={1} flexWrap="wrap">
                {data.tags.map((tag, i) => (
                  <Chip key={i} label={tag} size="small" sx={{ fontSize: '0.7rem', height: 20, backgroundColor: `${cfg.color}15`, color: cfg.color }} />
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
