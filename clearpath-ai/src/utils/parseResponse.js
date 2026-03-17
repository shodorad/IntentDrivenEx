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
  const upgradeFlow = text.includes('[UPGRADE_FLOW]');
  const internationalFlow = text.includes('[INTERNATIONAL_FLOW]');

  // Clean message text (remove JSON blocks and flow tags)
  const message = text
    .replace(/\[ACTION_PILLS\].*?\[\/ACTION_PILLS\]/s, '')
    .replace(/\[RECOMMENDATIONS?\].*?\[\/RECOMMENDATIONS?\]/s, '')
    .replace(/\[(REFILL|UPGRADE|INTERNATIONAL)_FLOW\]/g, '')
    .trim();

  return { message, actionPills, recommendations, refillFlow, upgradeFlow, internationalFlow };
}
