// Shared helpers for all flow files

/**
 * Build a response string with optional action pills.
 */
export const msg = (text, pills) =>
  pills && pills.length
    ? `${text}\n[ACTION_PILLS]${JSON.stringify(pills)}[/ACTION_PILLS]`
    : text;

/**
 * Standard pills shown after any flow ends.
 */
export const POST_FLOW_PILLS = [
  { label: 'Ask something else', intent: 'show_options' },
  { label: 'Go back home',       intent: 'done'         },
  { label: "I'm done for now",   intent: 'done'         },
];

/**
 * Wrap a response in a terminal RouteResult.
 */
export const withEndFlow = (response, pills = POST_FLOW_PILLS) => ({
  response: msg(response, pills),
  nextFlowId:   null,
  nextStepId:   'flow_complete',
  contextPatch: {},
  endFlow:      true,
});

/**
 * Build a RouteResult for an in-progress step.
 */
export const step = (response, nextStepId, contextPatch = {}) => ({
  response,
  nextFlowId:   null,
  nextStepId,
  contextPatch,
  endFlow:      false,
});

/**
 * Interpolate {path.to.value} placeholders using the persona object.
 */
export function interpolate(template, persona) {
  if (!template || typeof template !== 'string') return template;
  return template.replace(/\{([^}]+)\}/g, (_, path) => {
    const value = path.trim().split('.').reduce((obj, key) => obj?.[key], persona);
    return value != null ? String(value) : '';
  });
}
