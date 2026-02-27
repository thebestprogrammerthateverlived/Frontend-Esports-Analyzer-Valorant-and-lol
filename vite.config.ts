import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — cached forever once downloaded
          'vendor-react': ['react', 'react-dom'],

          // Router — changes rarely
          'vendor-router': ['react-router-dom'],

          // Data-fetching — changes rarely
          'vendor-query': ['@tanstack/react-query'],

          // Animation — large, cache separately
          'vendor-motion': ['motion'],

          // Charts — large, only needed on trend pages
          'vendor-charts': ['recharts'],
        },
      },
    },

    // Raise the warning threshold slightly; our chunks are intentional
    chunkSizeWarningLimit: 600,
  },

  // Faster dev-server cold starts
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', 'motion'],
  },
});