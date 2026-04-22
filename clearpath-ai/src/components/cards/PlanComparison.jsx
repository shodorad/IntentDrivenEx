import {
  Box, Card, CardContent, Typography, Chip, Stack, Divider, Button, Table,
  TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutlined';
import StarIcon from '@mui/icons-material/Star';
import { useChat } from '../../context/ChatContext';
import { PLANS } from '../../data/products';

export default function PlanComparison({ data = {} }) {
  const { state } = useChat();
  const currentPlan = data.currentPlan || state.persona?.account?.plan || '';

  // LLM mode: optionally filter/order plans via data.planIds
  const plans = data.planIds?.length
    ? data.planIds.map(id => PLANS.find(p => p.id === id)).filter(Boolean)
    : PLANS.slice(0, 3);
  const features = ['Data', 'Network', 'Talk & Text', 'Hotspot', 'International', 'Disney+'];

  const getFeatureValue = (plan, feature) => {
    const map = {
      'Data':          plan.data        || 'Unlimited',
      'Network':       plan.network     || '5G',
      'Talk & Text':   plan.talkText    || 'Unlimited',
      'Hotspot':       plan.hotspot     || plan.features?.find(f => f.includes('hotspot') || f.includes('Hotspot')) || '—',
      'International': plan.features?.find(f => f.toLowerCase().includes('international')) || '—',
      'Disney+':       plan.features?.find(f => f.toLowerCase().includes('disney')) ? 'Included' : '—',
    };
    return map[feature] || '—';
  };

  return (
    <Card sx={{ mt: 1, mb: 0.5, overflow: 'auto' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h6" mb={2}>Plan Comparison</Typography>

        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 420 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 100 }}>Feature</TableCell>
                {plans.map((plan) => (
                  <TableCell key={plan.id} align="center">
                    <Stack alignItems="center" spacing={0.5}>
                      {plan.id === 'base-5g' && (
                        <Chip label="Best Deal" size="small" color="primary" icon={<StarIcon sx={{ fontSize: 12 }} />} />
                      )}
                      <Typography variant="body2" fontWeight={700} noWrap>{plan.name}</Typography>
                      <Typography variant="h6" sx={{ color: '#00B5AD' }}>${plan.price}<Typography component="span" variant="caption" color="text.secondary">/mo</Typography></Typography>
                      {plan.name === currentPlan && (
                        <Chip label="Current" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
                      )}
                    </Stack>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {features.map((feature) => (
                <TableRow key={feature} sx={{ '&:last-child td': { border: 0 } }}>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{feature}</Typography>
                  </TableCell>
                  {plans.map((plan) => {
                    const val = getFeatureValue(plan, feature);
                    const included = val !== '—';
                    return (
                      <TableCell key={plan.id} align="center">
                        {included ? (
                          <Stack alignItems="center" spacing={0.25}>
                            <CheckCircleIcon sx={{ fontSize: 16, color: '#28A745' }} />
                            {val !== 'Included' && val !== 'Unlimited' && (
                              <Typography variant="caption" noWrap>{val}</Typography>
                            )}
                          </Stack>
                        ) : (
                          <RemoveCircleOutlineIcon sx={{ fontSize: 16, color: '#D1D5DB' }} />
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={1.5}>
          {plans.map((plan) => (
            <Button
              key={plan.id}
              variant={plan.id === 'base-5g' ? 'contained' : 'outlined'}
              color="primary"
              size="small"
              fullWidth
              sx={{ fontSize: '0.75rem' }}
            >
              {plan.name === currentPlan ? 'Keep Plan' : `Switch — $${plan.price}`}
            </Button>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
