const API_PROXY_URL = '/api/chat';

export async function callAPI(messages, systemPrompt) {
  const res = await fetch(API_PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 800,
      system: systemPrompt,
      messages
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || '';
}
