export const SIGNAL_BANNERS = {
  urgent: {
    type: 'urgent',
    color: 'red',
    flowId: 'refill',
    signalKey: 'urgent',
  },
  smartTip: {
    type: 'smart-tip',
    color: 'teal',
    flowId: 'upgrade',
    signalKey: 'smartTip',
  },
  savings: {
    type: 'savings',
    color: 'green',
    flowId: 'international',
    signalKey: 'savings',
  },
};

export const DEFAULT_SIGNAL = SIGNAL_BANNERS.urgent;
