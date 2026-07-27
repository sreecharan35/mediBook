import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const n8nUrl = env.VITE_N8N_WEBHOOK_URL || '';
  
  // Parse the n8n origin (e.g. https://workflow.ccbp.in) for the proxy target
  let n8nOrigin = '';
  let n8nPath = '';
  try {
    const parsed = new URL(n8nUrl);
    n8nOrigin = parsed.origin;
    n8nPath = parsed.pathname;
  } catch (_) {}

  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: false,
      hmr: {
        host: 'localhost',
        port: 5173,
        protocol: 'ws',
        clientPort: 5173,
      },
      proxy: n8nOrigin ? {
        '/api/n8n': {
          target: n8nOrigin,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/n8n/, n8nPath),
        },
      } : {},
    },
  };
});

