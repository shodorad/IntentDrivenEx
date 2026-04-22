// Vite proxies /api/* → Express backend (localhost:3001) in dev.
// Vercel routes /api/* → serverless functions in production.
const API_URL = '/api/chat';

export async function callAPI(messages, systemPrompt, chatMode = 'static', persona = null) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chatMode,
      system: systemPrompt,
      messages,
      persona,  // used by agentLoop data tools; ignored in static mode
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  if (data.message !== undefined) return data;
  return data.content?.[0]?.text || '';
}
