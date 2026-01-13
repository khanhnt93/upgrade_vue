import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env': {},
    global: 'globalThis'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.json', '.vue', '.jsx', '.ts', '.tsx']
  },
  publicDir: 'public',
  server: {
    port: 8080,
    host: true,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'utils': ['axios', 'moment', 'js-cookie']
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: `@use "@/assets/scss/_variables.scss" as *;`
      }
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios']
  }
})
