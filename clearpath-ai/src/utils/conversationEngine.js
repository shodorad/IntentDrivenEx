/**
 * Phase 5: Generic conversation engine driven by JSON persona configs.
 * Runs alongside the existing scripted engine — returns null to fall through.
 *
 * Response format matches what useChat.js already knows how to parse:
 *   - [ACTION_PILLS][...][/ACTION_PILLS]  — quick reply chips
 *   - [FLOW_STATE:xxx]                    — advances named state machine
 *   - [REFILL_FLOW], [UPGRADE_FLOW], etc. — component triggers (parsed by parseResponse)
 */

/**
 * Interpolate {path.to.value} placeholders using the persona object.
 * Supports any depth: {account.renewalDate}, {account.savedCard}, etc.
 */
function interpolate(template, persona) {
  if (!template || typeof template !== 'string') return template;
  return template.replace(/\{([^}]+)\}/g, (_, path) => {
    const value = path.trim().split('.').reduce((obj, key) => obj?.[key], persona);
    return value != null ? String(value) : '';
  });
}

/** Interpolate all string fields in a pills array (labels may contain templates). */
function interpolatePills(pills, persona) {
  if (!pills) return pills;
  return pills.map(p => ({ ...p, label: interpolate(p.label, persona) }));
}

const buildMsg = (text, pills) =>
  pills && pills.length
    ? `${text}\n[ACTION_PILLS]${JSON.stringify(pills)}[/ACTION_PILLS]`
    : text;

/**
 * Build a full response string, optionally appending [FLOW_STATE:xxx].
 */
function buildResponse(message, pills, nextFlowState, persona) {
  const text = interpolate(message, persona);
  const resolvedPills = interpolatePills(pills, persona);
  let response = buildMsg(text, resolvedPills);
  if (nextFlowState !== undefined && nextFlowState !== null) {
    response += `\n[FLOW_STATE:${nextFlowState}]`;
  }
  return response;
}

/**
 * Main entry point. Returns a response string or null (falls through to old engine).
 *
 * @param {object}  config       - Parsed JSON persona config
 * @param {string}  activeIntent - Current intent from chat state (e.g. 'quick_refill')
 * @param {string}  flowState    - Current named flow state (e.g. 'asked_wifi'), or null
 * @param {Array}   userMessages - All messages filtered to role === 'user'
 * @param {object}  persona      - Full persona object (for template interpolation)
 * @returns {string|null}
 */
export function runConversationEngine(config, activeIntent, flowState, userMessages, persona) {
  if (!config) return null;

  const turn = userMessages.length;

  // ── OPENING ────────────────────────────────────────────────────────────────
  // Turn 1, no active intent → show persona opening message
  if (!activeIntent && turn === 1 && config.opening) {
    const o = config.opening;
    return buildResponse(o.message, o.pills, undefined, persona);
  }

  if (!activeIntent) return null;

  // ── FLOW ROUTING ───────────────────────────────────────────────────────────
  const flow = config.flows?.[activeIntent];
  if (!flow) return null;

  // Simple single-step flow (trigger only) — e.g. confirm_refill → [REFILL_FLOW]
  if (flow.trigger) {
    return interpolate(flow.trigger, persona);
  }

  // Simple single-step flow (message + pills, no states)
  if (!flow.states) {
    if (!flow.message) return null;
    return buildResponse(flow.message, flow.pills, undefined, persona);
  }

  // Multi-step flow with named states
  const currentStateName = flowState || 'start';
  const currentState = flow.states[currentStateName];
  if (!currentState) return null;

  // Terminal trigger state (e.g. a state that fires [REFILL_FLOW])
  if (currentState.trigger) {
    return `${interpolate(currentState.trigger, persona)}\n[FLOW_STATE:${currentStateName}]`;
  }

  if (!currentState.message) return null;

  // autoNextState: sequential flows where every answer advances to the next step.
  // The next turn will see this flow state and show the next question.
  const nextState = currentState.autoNextState ?? null;

  return buildResponse(currentState.message, currentState.pills, nextState, persona);
}
