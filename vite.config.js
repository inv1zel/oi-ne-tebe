import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' — чтобы сборка работала и в корне домена, и в подпапке (GitHub Pages)
export default defineConfig({
  plugins: [react()],
  base: './',
});
