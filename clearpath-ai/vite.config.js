import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);
  return {
    plugins: [react()],
    server: {
      port: parseInt(process.env.PORT) || 5173,
      proxy: {
        // All /api/* calls → Express backend on :3001
        '/api': {
          target:       'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    optimizeDeps: {
      include: ['@amcharts/amcharts5', '@amcharts/amcharts5/xy'],
    },
  }
})
