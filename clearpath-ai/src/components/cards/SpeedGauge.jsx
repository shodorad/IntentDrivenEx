import { useEffect, useRef, useState } from 'react';
import { Box, Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useChat } from '../../context/ChatContext';

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    const id = setInterval(() => {
      step++;
      current = Math.min(target, Math.round(increment * step));
      setValue(current);
      if (step >= steps) clearInterval(id);
    }, duration / steps);
    return () => clearInterval(id);
  }, [target, duration]);
  return value;
}

function speedColor(mbps, max) {
  const ratio = mbps / max;
  if (ratio >= 0.6) return '#00B5AD';
  if (ratio >= 0.3) return '#FFC107';
  return '#DC3545';
}

export default function SpeedGauge({ data = {} }) {
  const { state } = useChat();
  const account = state.persona?.account || {};

  const is5G = account.plan?.toLowerCase().includes('5g') ?? true;
  const maxDown = is5G ? 300 : 50;
  const maxUp   = is5G ? 100 : 20;

  // Stable synthetic values seeded by plan name length to avoid re-randomising on re-render
  const seed    = (account.plan?.length || 5);
  const download = data?.download ?? Math.min(maxDown, Math.floor(((seed * 37) % 200) + (is5G ? 80 : 12)));
  const upload   = data?.upload   ?? Math.floor(download * 0.28 + seed % 10);
  const ping     = is5G ? 18 : 42;

  const dlDisplay = useCountUp(download);
  const ulDisplay = useCountUp(upload, 1400);

  const dlColor = speedColor(download, maxDown);
  const ulColor = speedColor(upload, maxUp);

  const chartData = [
    { name: 'Upload',   value: Math.round((upload   / maxUp)   * 100), fill: ulColor },
    { name: 'Download', value: Math.round((download / maxDown) * 100), fill: dlColor },
  ];

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Network Speed</Typography>
          <Chip
            label={is5G ? '5G' : 'LTE'}
            size="small"
            sx={{
              backgroundColor: is5G ? 'rgba(99,102,241,0.12)' : 'rgba(0,181,173,0.1)',
              color: is5G ? '#6366F1' : '#00B5AD',
              fontWeight: 700,
              fontSize: '0.7rem',
            }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Radial rings */}
          <Box sx={{ width: 150, height: 150, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="95%"
                startAngle={210}
                endAngle={-30}
                data={chartData}
                barSize={14}
              >
                <RadialBar
                  background={{ fill: 'rgba(0,0,0,0.06)' }}
                  dataKey="value"
                  cornerRadius={6}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </Box>

          {/* Speed readouts */}
          <Stack spacing={2} flex={1}>
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Stack direction="row" alignItems="baseline" spacing={0.5}>
                <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: dlColor, lineHeight: 1 }}>
                  {dlDisplay}
                </Typography>
                <Typography variant="caption" color="text.secondary">Mbps</Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">↓ Download</Typography>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <Stack direction="row" alignItems="baseline" spacing={0.5}>
                <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: ulColor, lineHeight: 1 }}>
                  {ulDisplay}
                </Typography>
                <Typography variant="caption" color="text.secondary">Mbps</Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">↑ Upload</Typography>
            </motion.div>

            <Box sx={{ p: 0.75, borderRadius: 1.5, backgroundColor: 'rgba(0,0,0,0.03)', display: 'inline-block' }}>
              <Typography variant="caption" color="text.secondary">Ping: </Typography>
              <Typography variant="caption" fontWeight={700}>{ping} ms</Typography>
            </Box>
          </Stack>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2.5, display: 'block', fontStyle: 'italic' }}>
          Estimated based on your {is5G ? '5G' : 'LTE'} plan. Run a live speed test for precise results.
        </Typography>
      </CardContent>
    </Card>
  );
}
