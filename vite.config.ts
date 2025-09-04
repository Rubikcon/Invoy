import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      global: 'globalThis',
      'process.env.RESEND_API_KEY': JSON.stringify(env.RESEND_API_KEY)
    },
    resolve: {
      alias: {
        buffer: 'buffer'
      }
    },
    server: {
      host: true
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
      include: ['buffer']
    }
  };
});
