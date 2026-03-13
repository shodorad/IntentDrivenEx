// ── Cloudflare Worker — Anthropic API Proxy ──
// Deploy: wrangler deploy worker.js
// Set secret: wrangler secret put ANTHROPIC_API_KEY
//
// Update your index.html API_PROXY_URL to your worker URL:
//   const API_PROXY_URL = 'https://your-worker.your-subdomain.workers.dev';

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: corsHeaders,
      });
    }

    try {
      const body = await request.json();

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: corsHeaders,
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: 'Proxy error: ' + err.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};
