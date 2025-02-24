import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'src'), // Carpeta raíz del proyecto
  build: {
    outDir: '../dist', // Carpeta de salida
  },
  server: {
    port: 5173, // Puerto del servidor de desarrollo de Vite
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // URL del backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});