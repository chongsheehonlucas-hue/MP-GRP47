
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000' // tells Vite to proxy request starting with /api toooo fast apiii backend insteaaad 
    }
  }
})
