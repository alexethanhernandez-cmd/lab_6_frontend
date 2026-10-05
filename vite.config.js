import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
      '/create': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
      '/logout': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
      '/refresh': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
})