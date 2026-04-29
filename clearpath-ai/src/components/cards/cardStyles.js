export const CARD_HEADER_TEAL = {
  background: 'linear-gradient(135deg, #009a93 0%, #00c9bf 50%, #00b5ad 100%)',
  color: '#fff',
  px: 2.5,
  py: 1.5,
  borderRadius: '12px 12px 0 0',
};

export const CARD_HEADER_NAVY = {
  background: 'linear-gradient(135deg, #0D2137 0%, #1a3a5c 100%)',
  color: '#fff',
  px: 2.5,
  py: 1.5,
  borderRadius: '12px 12px 0 0',
};

export const STAT_TILE = {
  flex: 1,
  p: 1.5,
  borderRadius: 2,
  border: '1px solid rgba(0,0,0,0.06)',
  backgroundColor: 'rgba(0,0,0,0.03)',
};

// Named segment colors for BillBreakdown — stable regardless of order
export const BILL_COLORS = {
  'Plan':             '#00B5AD',
  'Taxes & Fees':     '#0D2137',
  'Add-ons':          '#FFC107',
  'AutoPay Discount': '#28A745',
};

export const CHART_COLORS = ['#00B5AD', '#0D2137', '#FFC107', '#DC3545', '#28A745', '#6B7280'];

// White chip style for use on gradient headers
export const HEADER_CHIP_SX = {
  backgroundColor: 'rgba(255,255,255,0.15)',
  color: '#fff',
  fontWeight: 600,
  border: '1px solid rgba(255,255,255,0.25)',
  '& .MuiChip-icon': { color: '#fff' },
};

export const CARD_HOVER = {
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
  },
};
