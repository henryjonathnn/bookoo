// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    react({
      // Enable fast refresh
      fastRefresh: true,
      // Babel options for optimization
      babel: {
        plugins: [
          ['@babel/plugin-transform-runtime'],
          // Remove console.log in production
          ['transform-remove-console', { exclude: ['error', 'warn'] }]
        ]
      }
    }),
    // Generate gzip files
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    // Generate brotli files
    compression({
      algorithm: 'brotli',
      ext: '.br'
    }),
    // Bundle size analyzer
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true
    }),
    // Legacy browsers support
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks
          vendor: [
            'react',
            'react-dom',
            'react-router-dom'
          ],
          // Split features
          features: [
            './src/features/'
          ]
        },
        // Optimize chunk size
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // Enable source maps for production debugging
    sourcemap: true,
    // Reduce chunk size warnings limit
    chunkSizeWarningLimit: 1000,
    // Asset optimization
    assetsInlineLimit: 4096,
    // CSS optimization
    cssCodeSplit: true,
    cssMinify: true
  },
  // Development server configuration
  server: {
    host: true,
    port: 3000,
    // Enable HMR
    hmr: {
      overlay: true
    }
  }
});