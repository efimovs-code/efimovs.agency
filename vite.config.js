import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue()
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true, // ВАЖНО: Разделяет CSS, чтобы не грузить один огромный файл
    chunkSizeWarningLimit: 600,
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