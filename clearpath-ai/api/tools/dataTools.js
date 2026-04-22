// Data tool definitions — each entry is a Gemini functionDeclaration.
// The LLM calls these to fetch data before deciding what UI to show.
//
// DB integration: replace the body of executeDataTool's switch cases
// with real DB queries. Tool definitions and the agentic loop stay unchanged.

export const DATA_TOOLS = [
  {
    name: 'fetch_account_summary',
    description: 'Fetch the customer\'s current account details: plan name, price, data balance, renewal date, autopay status, rewards points, device, and saved payment method.',
    parameters: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'Customer user ID' },
      },
    },
  },
  {
    name: 'fetch_usage_history',
    description: 'Fetch the customer\'s data usage over a time period. Use when the customer asks why they ran out of data, how fast they use data, or about usage trends.',
    parameters: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        days:   { type: 'number', description: 'Number of days of history to fetch. Default 30.' },
      },
    },
  },
  {
    name: 'fetch_available_plans',
    description: 'Fetch all available plans with pricing, data allowances, and features. Use before showing plan comparison or recommendations.',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'fetch_rewards_balance',
    description: 'Fetch the customer\'s rewards points balance and available redemption options.',
    parameters: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
      },
    },
  },
];

export const DATA_TOOL_NAMES = new Set(DATA_TOOLS.map(t => t.name));

/**
 * Execute a data tool call.
 * Currently reads from the persona object.
 * DB integration: replace each case body with an async DB query.
 * The function signature stays the same — agentLoop.js does not change.
 *
 * @param {string} toolName
 * @param {object} toolInput  - args the LLM passed
 * @param {object} persona    - current persona (remove when DB is live)
 * @returns {Promise<object>} - data returned to the LLM as tool result
 */
export async function executeDataTool(toolName, toolInput, persona) {
  const account = persona?.account || {};

  switch (toolName) {
    case 'fetch_account_summary':
      // DB: SELECT * FROM accounts WHERE user_id = toolInput.userId
      return {
        plan:             account.plan             || null,
        planPrice:        account.planPrice        || null,
        dataRemaining:    account.dataRemaining    || null,
        dataTotal:        account.dataTotal        || null,
        dataPercent:      account.dataPercent      ?? null,
        renewalDate:      account.renewalDate      || null,
        daysUntilRenewal: account.daysUntilRenewal ?? null,
        autoPayEnabled:   account.autoPayEnabled   ?? null,
        rewardsPoints:    account.rewardsPoints    ?? 0,
        device:           account.device           || null,
        savedCard:        account.savedCard        || null,
      };

    case 'fetch_usage_history':
      // DB: SELECT daily_usage FROM usage_log WHERE user_id = ... AND date >= NOW() - INTERVAL
      return {
        dataTotal:      account.dataTotal        || null,
        dataRemaining:  account.dataRemaining    || null,
        dataPercent:    account.dataPercent      ?? null,
        daysInCycle:    30,
        daysElapsed:    30 - (account.daysUntilRenewal ?? 14),
        daysUntilRenewal: account.daysUntilRenewal ?? 14,
      };

    case 'fetch_available_plans':
      // DB: SELECT * FROM plans WHERE active = true ORDER BY price ASC
      // For now return empty — system prompt already has plan data
      return { note: 'Plan data available in system context' };

    case 'fetch_rewards_balance':
      // DB: SELECT points FROM rewards WHERE user_id = toolInput.userId
      return {
        points:          account.rewardsPoints ?? 0,
        canRedeemAddon:  (account.rewardsPoints ?? 0) >= 1000,
        pointsToAddon:   Math.max(0, 1000 - (account.rewardsPoints ?? 0)),
      };

    default:
      return { error: `Unknown data tool: ${toolName}` };
  }
}
