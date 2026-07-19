import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NimbleJS',
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'nimblejs.js' : 'nimblejs.cjs'
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    }
  },
  plugins: [dts({ bundleTypes: true, exclude: ['**/*.test.ts'] })]
});
