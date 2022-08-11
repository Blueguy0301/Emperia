import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import pluginRewriteAll from 'vite-plugin-rewrite-all'
// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    pluginRewriteAll(),
    VitePWA({}),
  ],
  publicDir: 'public',
})
