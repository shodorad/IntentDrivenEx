// UI tool definitions — each entry is a Gemini functionDeclaration.
// The LLM calls these to render MUI components.
// Adding a new card = add one entry here + matching key in CARD_REGISTRY.

export const UI_TOOLS = [
  {
    name: 'show_usage_chart',
    description: 'Render a data usage line chart with progress bar. Use when the customer asks about their data consumption, why they ran out, or usage trends.',
    parameters: {
      type: 'object',
      properties: {
        dataTotal:        { type: 'string', description: 'Total plan data, e.g. "5 GB"' },
        dataRemaining:    { type: 'string', description: 'Remaining data, e.g. "0.8 GB"' },
        daysUntilRenewal: { type: 'number', description: 'Days until plan renews' },
      },
      required: ['dataTotal', 'dataRemaining'],
    },
  },
  {
    name: 'show_account_snapshot',
    description: 'Render a full account overview card with data balance, renewal date, autopay status, rewards, device, and payment info. Use when the customer asks about their account or "my account".',
    parameters: {
      type: 'object',
      properties: {
        plan:             { type: 'string' },
        dataRemaining:    { type: 'string' },
        dataTotal:        { type: 'string' },
        dataPercent:      { type: 'number', description: 'Percentage of data remaining, 0-100' },
        renewalDate:      { type: 'string', description: 'e.g. "Apr 9"' },
        daysUntilRenewal: { type: 'number' },
        autoPayEnabled:   { type: 'boolean' },
        rewardsPoints:    { type: 'number' },
        device:           { type: 'string' },
        savedCard:        { type: 'string', description: 'Last 4 digits of saved card' },
      },
      required: ['plan', 'dataRemaining', 'dataTotal'],
    },
  },
  {
    name: 'show_plan_comparison',
    description: 'Render a plan comparison table. Use when the customer asks about plans, wants to compare, or is considering an upgrade.',
    parameters: {
      type: 'object',
      properties: {
        planIds: {
          type: 'array',
          items: { type: 'string', enum: ['base-5g', '5g-unlimited', '5g-plus-unlimited'] },
          description: 'Which plans to show. Omit to show all three.',
        },
        currentPlan: { type: 'string', description: 'Customer\'s current plan name' },
      },
    },
  },
  {
    name: 'show_step_timeline',
    description: 'Render an interactive step-by-step guide. Use for troubleshooting, setup instructions, or any multi-step process.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        steps: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              label:  { type: 'string', description: 'Short step title' },
              detail: { type: 'string', description: 'Detailed instructions for this step' },
            },
            required: ['label', 'detail'],
          },
        },
      },
      required: ['title', 'steps'],
    },
  },
  {
    name: 'show_insight',
    description: 'Render a highlighted insight, finding, tip, or warning. Use to surface a key fact the customer should know. Can appear alongside other cards.',
    parameters: {
      type: 'object',
      properties: {
        severity: {
          type: 'string',
          enum: ['info', 'tip', 'warning', 'critical', 'success'],
        },
        title:    { type: 'string' },
        insights: {
          type: 'array',
          items: {
            type: 'object',
            properties: { text: { type: 'string' } },
            required: ['text'],
          },
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional label chips shown at bottom of card',
        },
      },
      required: ['severity', 'title', 'insights'],
    },
  },
  {
    name: 'show_plan_recommendation',
    description: 'Recommend a specific plan. Mark isBest true on the most affordable option that solves the problem. Call multiple times to recommend multiple plans.',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          enum: ['base-5g', '5g-unlimited', '5g-plus-unlimited'],
        },
        reason: { type: 'string', description: 'One-line reason this plan fits the customer' },
        isBest: { type: 'boolean', description: 'True on exactly one plan — the recommended one' },
      },
      required: ['id', 'reason', 'isBest'],
    },
  },
  {
    name: 'trigger_refill',
    description: 'Open the refill / add data payment flow. Use when the customer confirms they want to add data or pay their bill.',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'trigger_upgrade',
    description: 'Open the plan upgrade flow. Use when the customer confirms they want to change or upgrade their plan.',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'trigger_redeem',
    description: 'Open the rewards redemption flow. Use when the customer wants to use their rewards points.',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'trigger_live_chat',
    description: 'Connect the customer to a live agent. Use when the customer explicitly asks for a person or when the issue cannot be resolved by AI.',
    parameters: { type: 'object', properties: {} },
  },
];

// Maps Gemini tool name → CARD_REGISTRY key (keeps registry keys unchanged)
export const UI_TOOL_TO_CARD_TYPE = {
  show_usage_chart:       'usage_chart',
  show_account_snapshot:  'account_snapshot',
  show_plan_comparison:   'plan_comparison',
  show_step_timeline:     'step_timeline',
  show_insight:           'insight',
  show_plan_recommendation: 'plan',
  trigger_refill:         'refill',
  trigger_upgrade:        'upgrade',
  trigger_redeem:         'redeem',
  trigger_live_chat:      'live_chat',
};

export const UI_TOOL_NAMES = new Set(Object.keys(UI_TOOL_TO_CARD_TYPE));
