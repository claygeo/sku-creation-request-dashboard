import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  root: 'renderer', // Tell Vite to use the renderer directory as the root
  build: {
    outDir: 'dist', // Output build files to renderer/dist
  },
});