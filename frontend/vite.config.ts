import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({
      root: path.resolve(__dirname),
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      src: path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  server: {
    port: 3001,
    host: true,
  },
  preview: {
    port: 3001,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    reportCompressedSize: false,
  },
});
