// ── Local Development Server ──
// Serves static files + proxies Claude API requests to avoid CORS issues
// Usage: ANTHROPIC_API_KEY=sk-... node server.js

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY || '';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const server = http.createServer(async (req, res) => {
  // ── API Proxy ──
  if (req.method === 'POST' && req.url === '/api/chat') {
    if (!API_KEY) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set. Run with: ANTHROPIC_API_KEY=sk-... node server.js' }));
      return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'content-length': Buffer.byteLength(body),
        },
      };

      const proxyReq = https.request(options, (proxyRes) => {
        let responseData = '';
        proxyRes.on('data', chunk => { responseData += chunk; });
        proxyRes.on('end', () => {
          res.writeHead(proxyRes.statusCode, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(responseData);
        });
      });

      proxyReq.on('error', (err) => {
        console.error('Proxy error:', err.message);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to reach Anthropic API' }));
      });

      proxyReq.write(body);
      proxyReq.end();
    });
    return;
  }

  // ── CORS Preflight ──
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // ── Static Files ──
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  ✦ Total Wireless Intent-Driven Experience`);
  console.log(`  ─────────────────────────────────────────`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  API Key: ${API_KEY ? '✓ Configured' : '✗ Not set (demo mode)'}`);
  if (!API_KEY) {
    console.log(`\n  To enable Claude AI, run:`);
    console.log(`  ANTHROPIC_API_KEY=sk-... node server.js\n`);
  }
  console.log('');
});
