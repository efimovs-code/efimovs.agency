import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue()
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'vendor-three';
            if (id.includes('vue')) return 'vendor-vue';
            if (id.includes('@studio-freight/lenis')) return 'vendor-lenis';
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