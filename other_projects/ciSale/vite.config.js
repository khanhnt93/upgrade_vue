import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          // Don't transform absolute paths (images in public directory)
          includeAbsolute: false,
        },
      },
    })
  ],
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
    open: true,
    proxy: {
      // Add your API proxy configuration here if needed
      // '/api': {
      //   target: 'http://localhost:3000',
      //   changeOrigin: true,
      // },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'charts': ['apexcharts', 'vue-apexcharts', 'vue-google-charts'],
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // Fix Sass deprecation warnings
        additionalData: `@use "@/assets/scss/_variables.scss" as *;`
      }
    }
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'axios',
      'moment',
      'js-cookie'
    ],
  },
})
