import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// El Naranjo Conecta se construye como PWA sobre React: un solo código
// para web y para "app" instalable en el celular (ver sección Tecnología
// del documento del proyecto).
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'El Naranjo Conecta',
        short_name: 'El Naranjo',
        description: 'Plataforma comunitaria de El Naranjo, Burruyacú, Tucumán.',
        theme_color: '#ea580c',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // No cachear llamadas a la API: siempre datos frescos cuando hay señal.
        navigateFallbackDenylist: [/^\/api/],
      },
    }),
  ],
  server: {
    port: 5173,
  },
})
