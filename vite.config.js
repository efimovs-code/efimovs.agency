import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue()
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: 'esbuild', // ВАЖНО: Дополнительно ускоряем парсинг стилей
    cssCodeSplit: true, // ВАЖНО: Разделяет CSS, чтобы не грузить один огромный файл
    chunkSizeWarningLimit: 600,
    modulePreload: {
      polyfill: false // Отключаем ненужный код, так как target: 'esnext'
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'vendor-three';
            if (id.includes('vue')) return 'vendor-vue';
            if (id.includes('@studio-freight/lenis') || id.includes('lenis')) return 'vendor-lenis';
            if (id.includes('gsap')) return 'vendor-gsap'; // ВАЖНО: Изолируем GSAP
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