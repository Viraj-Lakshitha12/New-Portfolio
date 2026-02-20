import { defineConfig } from 'vite';
import react            from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Split vendor chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-core':   ['three'],
        },
      },
    },
    // Slightly increase chunk size warning limit for Three.js
    chunkSizeWarningLimit: 600,
  },
});