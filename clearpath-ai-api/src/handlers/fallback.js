export function getFallbackResponse() {
  return {
    message:  "I'm having a moment — let me get back on track. What can I help you with?",
    cards:    [],
    followUp: [
      { label: 'Quick Refill — $15', intent: 'quick_refill' },
      { label: 'Check My Data',      intent: 'diagnose_usage' },
      { label: 'Talk to a Person',   intent: 'live_chat'     },
    ],
  };
}
