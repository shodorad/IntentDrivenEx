// Local Express dev server — wraps Vercel serverless functions for local development.
// Runs on port 3001; Vite proxies /api/* here.
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Load .env.local before anything else
const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const dotenv = require('dotenv');
dotenv.config({ path: join(__dirname, '.env.local') });

import express from 'express';

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use((req, _res, next) => { console.log(`[${req.method}] ${req.path}`); next(); });

// Import handlers at top level (top-level await, supported in Node ESM)
const { default: chatHandler }     = await import('./api/chat.js');
const { default: bigqueryHandler } = await import('./api/bigquery.js');

app.all('/api/chat',     (req, res) => chatHandler(req, res));
app.all('/api/bigquery', (req, res) => bigqueryHandler(req, res));

app.use((req, res) => res.status(404).json({ error: `No API handler for ${req.path}` }));

const PORT = parseInt(process.env.API_PORT) || 3001;
const server = app.listen(PORT, () => {
  console.log(`\n  ✦ ClearPath AI — API Dev Server`);
  console.log(`  ─────────────────────────────────`);
  console.log(`  Listening: http://localhost:${PORT}`);
  console.log(`  GOOGLE_AI_API_KEY:  ${process.env.GOOGLE_AI_API_KEY ? '✓' : '✗ not set'}`);
  console.log(`  ANTHROPIC_API_KEY:  ${process.env.ANTHROPIC_API_KEY ? '✓' : '✗ not set'}\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  ✗ Port ${PORT} is already in use. Kill the existing server first:\n  lsof -ti:${PORT} | xargs kill\n`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
