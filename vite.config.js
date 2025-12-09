import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { codeInspectorPlugin } from 'code-inspector-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), codeInspectorPlugin({
    bundler: 'vite',
    showSwitch: true
  })],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:7023',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  // 配置静态资源服务
  build: {
    assetsDir: 'assets'
  },
  // 开发服务器静态资源服务配置
  preview: {
    port: 3000
  }
})