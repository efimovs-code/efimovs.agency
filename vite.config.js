import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  // --- VITE PLUGINS
  plugins: [vue()],

  // --- PRODUCTION BUILD SETTINGS
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: 'esbuild',
    // Bundle all CSS into a single file to prevent missing styles after deployment
    cssCodeSplit: false,
    chunkSizeWarningLimit: 600,
    modulePreload: {
      polyfill: false,
    },

    // --- VENDOR CODE SPLITTING
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('three')) return 'vendor-three';
          if (id.includes('vue')) return 'vendor-vue';
          if (id.includes('lenis')) return 'vendor-lenis';
          if (id.includes('gsap')) return 'vendor-gsap';

          return 'vendor-core';
        },
      },
    },
  },

  // --- STRIP CONSOLE & DEBUGGER IN PRODUCTION
  esbuild: {
    drop: ['console', 'debugger'],
  },
});