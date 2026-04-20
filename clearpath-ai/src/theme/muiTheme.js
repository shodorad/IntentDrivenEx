import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main:        '#00B5AD',
      light:       '#33C4BD',
      dark:        '#008079',
      contrastText: '#ffffff',
    },
    secondary: {
      main:        '#CC0000',
      light:       '#D63333',
      dark:        '#990000',
      contrastText: '#ffffff',
    },
    success: { main: '#28A745' },
    warning: { main: '#FFC107' },
    error:   { main: '#DC3545' },
    background: {
      default: '#F8F9FA',
      paper:   '#FFFFFF',
    },
    text: {
      primary:   '#1A1A2E',
      secondary: '#6B7280',
      disabled:  '#9CA3AF',
    },
    divider: 'rgba(0,0,0,0.08)',
  },

  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontSize: '2rem',    fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.5rem',  fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.25rem', fontWeight: 600 },
    h4: { fontSize: '1.1rem',  fontWeight: 600 },
    h5: { fontSize: '1rem',    fontWeight: 600 },
    h6: { fontSize: '0.875rem',fontWeight: 600 },
    body1: { fontSize: '0.9rem',  lineHeight: 1.6 },
    body2: { fontSize: '0.8rem',  lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', color: '#6B7280' },
    button: { textTransform: 'none', fontWeight: 600 },
  },

  shape: { borderRadius: 12 },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.06)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 20, fontWeight: 600, fontSize: '0.75rem' },
        colorPrimary: { backgroundColor: 'rgba(0,181,173,0.12)', color: '#00B5AD' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 600,
          fontSize: '0.85rem',
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #00B5AD 0%, #008079 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #00C4BC 0%, #009088 100%)' },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 8, height: 6, backgroundColor: 'rgba(0,181,173,0.12)' },
        bar:  { borderRadius: 8, backgroundColor: '#00B5AD' },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: 'rgba(0,0,0,0.06)' } },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1A1A2E',
          fontSize: '0.75rem',
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700, fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' },
        body: { fontSize: '0.85rem' },
      },
    },
  },
});
