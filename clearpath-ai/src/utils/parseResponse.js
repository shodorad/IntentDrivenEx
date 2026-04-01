export function parseResponse(text) {
  // Extract action pills
  const pillsMatch = text.match(/\[ACTION_PILLS\](.*?)\[\/ACTION_PILLS\]/s);
  let actionPills = null;
  if (pillsMatch) {
    try {
      actionPills = JSON.parse(pillsMatch[1]);
    } catch (e) {
      console.warn('Failed to parse action pills:', e);
    }
  }

  // Extract recommendations (supports both singular and plural tags)
  const recMatch = text.match(/\[RECOMMENDATIONS?\](.*?)\[\/RECOMMENDATIONS?\]/s);
  let recommendations = null;
  if (recMatch) {
    try {
      const parsed = JSON.parse(recMatch[1]);
      recommendations = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      console.warn('Failed to parse recommendations:', e);
    }
  }

  // Detect inline flow tags
  const refillFlow = text.includes('[REFILL_FLOW]');
  const liveChatFlow = text.includes('[LIVE_CHAT_FLOW]');

  // Extract phone order flow data
  const phoneOrderMatch = text.match(/\[PHONE_ORDER_FLOW\](.*?)\[\/PHONE_ORDER_FLOW\]/s);
  let phoneOrderFlow = null;
  if (phoneOrderMatch) {
    try { phoneOrderFlow = JSON.parse(phoneOrderMatch[1]); }
    catch { phoneOrderFlow = {}; }
  }

  // Clean message text (remove JSON blocks and flow tags)
  const message = text
    .replace(/\[ACTION_PILLS\].*?\[\/ACTION_PILLS\]/s, '')
    .replace(/\[RECOMMENDATIONS?\].*?\[\/RECOMMENDATIONS?\]/s, '')
    .replace(/\[REFILL_FLOW\]/g, '')
    .replace(/\[LIVE_CHAT_FLOW\]/g, '')
    .replace(/\[PHONE_ORDER_FLOW\].*?\[\/PHONE_ORDER_FLOW\]/s, '')
    .trim();

  return { message, actionPills, recommendations, refillFlow, liveChatFlow, phoneOrderFlow };
}
