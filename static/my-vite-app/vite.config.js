import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/static/my-vite-app/dist/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    manifest: true,
  },
});