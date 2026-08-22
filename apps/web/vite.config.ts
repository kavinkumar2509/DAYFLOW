import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    port: 5173,
    cors: true,
  },
  resolve: {
    alias: {
      '@dayflow/shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
    },
  },
});
