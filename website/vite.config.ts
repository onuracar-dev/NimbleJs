import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The site runs the real library source, so the playground cannot drift from it.
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@onuracar-dev/nimblejs': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
    },
  },
});
