import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ProyectoBackend/', // Cambia esto por el nombre de tu repositorio
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})