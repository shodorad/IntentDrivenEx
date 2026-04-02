import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);
  return {
  plugins: [
    react(),
    {
      name: 'api-dev-server',
      configureServer(server) {
        server.middlewares.use('/api/chat', (req, res) => {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              req.body = JSON.parse(body || '{}');
              // Shim res to match Next.js API route conventions
              res.status = (code) => {
                res.statusCode = code;
                return {
                  json: (data) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                  },
                  end: () => res.end(),
                };
              };
              const { default: handler } = await import('./api/chat.js');
              await handler(req, res);
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        });
      }
    }
  ],
  server: {
    port: parseInt(process.env.PORT) || 5173,
  },
  optimizeDeps: {
    include: ['@amcharts/amcharts5', '@amcharts/amcharts5/xy'],
  },
  }
})
