import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
      babel: {
        plugins: [
          ['@babel/plugin-transform-runtime'],
          process.env.NODE_ENV === 'production' && 
          ['transform-remove-console', { exclude: ['error', 'warn'] }]
        ].filter(Boolean)
      }
    }),
    // Compress only with gzip for Vercel
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240 // Only compress files > 10KB
    }),
    // Bundle analyzer - disabled in production
    process.env.ANALYZE === 'true' && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
  
  build: {
    target: 'es2015', // Better browser compatibility
    minify: 'esbuild', // Faster than terser
    sourcemap: false, // Disable sourcemaps in production
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom'
          ]
        },
        // Simpler naming pattern for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    assetsInlineLimit: 10240, // Inline assets < 10KB
    cssCodeSplit: true,
    cssMinify: true
  },

  // Development server config (won't affect production)
  server: {
    port: 3000,
    hmr: {
      overlay: true
    }
  }
});