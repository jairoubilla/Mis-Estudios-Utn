import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  clearScreen: false,
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true
  },
  preview: {
    allowedHosts: [
      'aiturnos.up.railway.app'
    ],
    host: true,
    port: 4173
  }
})
