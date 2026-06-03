import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  server: {
    port: 5173, // <-- Forzamos a que siempre corra en el puerto 5173
    strictPort: true // <-- Si el puerto está ocupado, te avisa en vez de cambiarlo
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})