// Parse AI response — handles both:
// 1. JSON format { message, cards[], followUp[] }  — LLM mode (registry-driven)
// 2. Tag-based format [ACTION_PILLS]...[/ACTION_PILLS] — static flows

function parseJsonResponse(json) {
  const { message = '', cards = [], followUp = [] } = json;

  const actionPills = followUp.length ? followUp : null;

  // Pass cards[] raw — ChatArea renders via CARD_REGISTRY
  // Also populate legacy flags for backward compat with static flows
  let recommendations   = null;
  let refillFlow        = false;
  let upgradeFlow       = false;
  let redeemFlow        = false;
  let liveChatFlow      = false;
  let phoneOrderFlow    = null;
  let internationalFlow = false;
  let activationFlow    = false;
  let byopFlow          = false;

  for (const card of cards) {
    switch (card.type) {
      case 'plan':
      case 'phone':
        recommendations = recommendations || [];
        recommendations.push(card);
        break;
      case 'refill':        refillFlow = true;          break;
      case 'upgrade':       upgradeFlow = true;         break;
      case 'redeem':        redeemFlow = true;          break;
      case 'live_chat':     liveChatFlow = true;        break;
      case 'phone_order':   phoneOrderFlow = card;      break;
      case 'international': internationalFlow = true;   break;
      case 'activation':    activationFlow = true;      break;
      case 'byop':          byopFlow = true;            break;
    }
  }

  return {
    message, actionPills,
    cards: cards.length ? cards : null,      // raw cards[] for registry
    recommendations,
    refillFlow, upgradeFlow, redeemFlow, liveChatFlow,
    phoneOrderFlow, internationalFlow, activationFlow, byopFlow,
  };
}

function parseTagResponse(text) {
  const pillsMatch = text.match(/\[ACTION_PILLS\](.*?)\[\/ACTION_PILLS\]/s);
  let actionPills = null;
  if (pillsMatch) {
    try { actionPills = JSON.parse(pillsMatch[1]); }
    catch (e) { console.warn('Failed to parse action pills:', e); }
  }

  const recMatch = text.match(/\[RECOMMENDATIONS?\](.*?)\[\/RECOMMENDATIONS?\]/s);
  let recommendations = null;
  if (recMatch) {
    try {
      const parsed = JSON.parse(recMatch[1]);
      recommendations = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) { console.warn('Failed to parse recommendations:', e); }
  }

  const refillFlow        = text.includes('[REFILL_FLOW]');
  const upgradeFlow       = text.includes('[UPGRADE_FLOW]');
  const liveChatFlow      = text.includes('[LIVE_CHAT_FLOW]');
  const redeemFlow        = text.includes('[REDEEM_FLOW]');
  const internationalFlow = text.includes('[INTERNATIONAL_FLOW]');
  const activationFlow    = text.includes('[ACTIVATION_FLOW]');
  const byopFlow          = text.includes('[BYOP_FLOW]');

  const phoneOrderMatch = text.match(/\[PHONE_ORDER_FLOW\](.*?)\[\/PHONE_ORDER_FLOW\]/s);
  let phoneOrderFlow = null;
  if (phoneOrderMatch) {
    try { phoneOrderFlow = JSON.parse(phoneOrderMatch[1]); }
    catch { phoneOrderFlow = {}; }
  }

  const message = text
    .replace(/\[ACTION_PILLS\].*?\[\/ACTION_PILLS\]/s, '')
    .replace(/\[RECOMMENDATIONS?\].*?\[\/RECOMMENDATIONS?\]/s, '')
    .replace(/\[REFILL_FLOW\]/g, '')
    .replace(/\[UPGRADE_FLOW\]/g, '')
    .replace(/\[LIVE_CHAT_FLOW\]/g, '')
    .replace(/\[REDEEM_FLOW\]/g, '')
    .replace(/\[INTERNATIONAL_FLOW\]/g, '')
    .replace(/\[ACTIVATION_FLOW\]/g, '')
    .replace(/\[BYOP_FLOW\]/g, '')
    .replace(/\[PHONE_ORDER_FLOW\].*?\[\/PHONE_ORDER_FLOW\]/s, '')
    .trim();

  return {
    message, actionPills, recommendations,
    refillFlow, upgradeFlow, redeemFlow, liveChatFlow,
    phoneOrderFlow, internationalFlow, activationFlow, byopFlow,
  };
}

export function parseResponse(input) {
  // JSON object (LLM mode — Gemma 4 returns structured JSON)
  if (input && typeof input === 'object') {
    return parseJsonResponse(input);
  }

  // JSON string (API response body)
  if (typeof input === 'string' && input.trimStart().startsWith('{')) {
    try {
      const parsed = JSON.parse(input);
      if (parsed.message !== undefined) return parseJsonResponse(parsed);
    } catch { /* fall through to tag parser */ }
  }

  // Tag-based string (static flows + legacy)
  return parseTagResponse(typeof input === 'string' ? input : '');
}
