import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // your backend
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    host: true,
    allowedHosts:  [
      'localhost',
      'b440-2409-40c2-103f-5a2f-b0da-c342-84f-5eaa.ngrok-free.app', // add this exact ngrok host here
    ], // for ngrok dynamic hosts
  },
  plugins: [
    react()
  ],
})
