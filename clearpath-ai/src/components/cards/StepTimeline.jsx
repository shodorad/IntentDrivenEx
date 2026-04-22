import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Stack, Chip, Button, Collapse,
  Stepper, Step, StepLabel, StepContent,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

export default function StepTimeline({ data = {} }) {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

  const steps = data.steps || [
    { label: 'Restart your device', detail: 'Hold power button → Restart. Wait 60 seconds for network to reconnect.' },
    { label: 'Toggle Airplane Mode', detail: 'Settings → Airplane Mode ON for 10 seconds → OFF. Forces network re-registration.' },
    { label: 'Check APN Settings',   detail: 'Settings → Mobile Data → APN → ensure "totalwireless" is set.' },
    { label: 'Reset Network Settings', detail: 'Settings → General → Reset → Reset Network Settings. Re-enter Wi-Fi passwords after.' },
  ];

  const title = data.title || 'Step-by-Step Fix';

  const handleDone = (idx) => {
    setCompleted(prev => ({ ...prev, [idx]: true }));
    if (idx < steps.length - 1) setActiveStep(idx + 1);
  };

  const allDone = Object.keys(completed).length === steps.length;

  return (
    <Card sx={{ mt: 1, mb: 0.5 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{title}</Typography>
          <Chip
            label={`${Object.keys(completed).length} / ${steps.length} done`}
            size="small"
            color={allDone ? 'success' : 'primary'}
            variant={allDone ? 'filled' : 'outlined'}
          />
        </Stack>

        <Stepper activeStep={activeStep} orientation="vertical" sx={{
          '& .MuiStepConnector-line': { borderColor: 'rgba(0,181,173,0.2)' },
        }}>
          {steps.map((step, idx) => (
            <Step key={idx} completed={!!completed[idx]}>
              <StepLabel
                icon={completed[idx]
                  ? <CheckCircleIcon sx={{ color: '#28A745', fontSize: 22 }} />
                  : <RadioButtonUncheckedIcon sx={{ color: idx === activeStep ? '#00B5AD' : '#D1D5DB', fontSize: 22 }} />
                }
                sx={{
                  '& .MuiStepLabel-label': {
                    fontWeight: idx === activeStep ? 700 : 500,
                    color: completed[idx] ? '#28A745' : idx === activeStep ? '#1A1A2E' : '#6B7280',
                    fontSize: '0.875rem',
                  },
                }}
              >
                {step.label}
              </StepLabel>
              <StepContent>
                <Collapse in={idx === activeStep}>
                  <Box sx={{ p: 1.5, backgroundColor: 'rgba(0,181,173,0.05)', borderRadius: 2, mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">{step.detail}</Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleDone(idx)}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      Done ✓
                    </Button>
                    {idx > 0 && (
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setActiveStep(idx - 1)}
                        sx={{ fontSize: '0.75rem', color: 'text.secondary' }}
                      >
                        Back
                      </Button>
                    )}
                  </Stack>
                </Collapse>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {allDone && (
          <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'rgba(40,167,69,0.08)', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="body2" fontWeight={600} color="success.main">
              All steps complete — issue resolved?
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
