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

  // Extract product images
  const imageMatch = text.match(/\[PRODUCT_IMAGES\](.*?)\[\/PRODUCT_IMAGES\]/s);
  let productImages = null;
  if (imageMatch) {
    try {
      productImages = JSON.parse(imageMatch[1]);
    } catch (e) {
      console.warn('Failed to parse product images:', e);
    }
  }

  // Clean message text (remove JSON blocks)
  const message = text
    .replace(/\[ACTION_PILLS\].*?\[\/ACTION_PILLS\]/s, '')
    .replace(/\[RECOMMENDATIONS?\].*?\[\/RECOMMENDATIONS?\]/s, '')
    .replace(/\[PRODUCT_IMAGES\].*?\[\/PRODUCT_IMAGES\]/s, '')
    .trim();

  return { message, actionPills, recommendations, productImages };
}
