import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  publicDir: 'static',
  assetsInclude: ['**/*.PNG', '**/*.JPG', '**/*.JPEG', '**/*.GIF', '**/*.SVG', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '/static': path.resolve(__dirname, './static'),
    },
    extensions: ['.js', '.json', '.vue', '.jsx', '.ts', '.tsx']
  },
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
          'vendor': ['vue', 'vue-router', 'pinia', 'axios'],
          'charts': ['vue-google-charts', 'apexcharts', 'vue-apexcharts']
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // Fix Sass deprecation warnings
        additionalData: `@use "@/assets/scss/_variables.scss" as *;`,
      }
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios']
  }
})
