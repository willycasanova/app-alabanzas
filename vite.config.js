import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo192.png', 'logo512.png'],
      manifest: {
        name: 'Organizador de Canciones de Alabanza',
        short_name: 'CancionesAlabanza',
        description: 'Aplicación para organizar canciones de alabanza',
        theme_color: '#4F46E5',
        background_color: '#FFFFFF',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'logo192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  // AÑADIR ESTE BLOQUE PARA EXCLUIR FIREBASE/ANALYTICS DE LA COMPILACIÓN
  build: {
    rollupOptions: {
      external: ['firebase/analytics'], // Excluye explícitamente el módulo de Analytics
    },
  },
})
