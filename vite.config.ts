import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  server: {
    port: 5173, // 开发服务器端口
    proxy: {
      // 代理所有 /api 请求到后端服务器
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8080',
        changeOrigin: true,
        // 如果后端API路径不是 /api，可以在这里重写路径
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
})


