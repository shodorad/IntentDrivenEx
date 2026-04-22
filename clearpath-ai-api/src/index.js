import 'dotenv/config';
import express from 'express';
import cors    from 'cors';
import chatRouter from './routes/chat.js';

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:5173',              // Vite dev (default port)
    'http://localhost:5174',              // Vite dev (fallback port)
    'http://localhost:5175',              // Vite dev (fallback port)
    'https://clearpath-ai-pearl.vercel.app', // Production frontend
  ],
}));

app.use(express.json({ limit: '1mb' }));

app.get('/health', (_, res) => res.json({ status: 'ok', model: 'gemma-4-31b-it' }));

app.use('/api/chat', chatRouter);

app.listen(PORT, () => {
  console.log(`ClearPath AI backend running on http://localhost:${PORT}`);
});
