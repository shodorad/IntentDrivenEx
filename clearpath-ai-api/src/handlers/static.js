// Static mode — no AI call. Scripted responses based on keyword matching.
export function handleStaticChat(req, res) {
  const { messages = [] } = req.body;
  const lastUser = [...messages].reverse().find(m => m.role === 'user');
  const text = (lastUser?.content || '').toLowerCase();

  let response;

  if (text.includes('refill') || text.includes('data') || text.includes('ran out')) {
    response = {
      message:  "I can help with that. Are you looking for a quick one-time refill, or thinking about changing your plan?",
      cards:    [],
      followUp: [
        { label: 'Quick Refill — $15', intent: 'quick_refill'   },
        { label: 'Change My Plan',     intent: 'plan_change'     },
        { label: 'Check Usage',        intent: 'diagnose_usage'  },
      ],
    };
  } else if (text.includes('slow') || text.includes('signal') || text.includes('speed')) {
    response = {
      message:  "Let's figure out what's going on. Is the issue happening everywhere, or just in a specific spot?",
      cards:    [],
      followUp: [
        { label: 'Everywhere',           intent: 'support' },
        { label: 'Just at home',         intent: 'support' },
        { label: 'Only on certain apps', intent: 'support' },
      ],
    };
  } else if (text.includes('plan') || text.includes('upgrade') || text.includes('change')) {
    response = {
      message:  "Happy to walk you through your options. What's driving the change — more data, lower price, or something else?",
      cards:    [],
      followUp: [
        { label: 'Need more data',   intent: 'plan_change'  },
        { label: 'Lower my bill',    intent: 'plan_change'  },
        { label: 'See all plans',    intent: 'browse_plans' },
      ],
    };
  } else {
    response = {
      message:  "Got it — let me point you in the right direction. What would you like to do?",
      cards:    [],
      followUp: [
        { label: 'Quick Refill',  intent: 'quick_refill' },
        { label: 'Check My Plan', intent: 'browse_plans' },
        { label: 'Get Help',      intent: 'support'      },
      ],
    };
  }

  return res.status(200).json(response);
}
