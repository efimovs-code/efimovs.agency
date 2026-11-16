import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue()
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: 'esbuild',
    cssCodeSplit: false, // Весь CSS собирается в один файл — стили секций не отвалятся после деплоя
    chunkSizeWarningLimit: 600,
    modulePreload: {
      polyfill: false
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'vendor-three';
            if (id.includes('vue')) return 'vendor-vue';
            if (id.includes('@studio-freight/lenis') || id.includes('lenis')) return 'vendor-lenis';
            if (id.includes('gsap')) return 'vendor-gsap';
            return 'vendor-core';
          }
        }
      }
    }
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
})
