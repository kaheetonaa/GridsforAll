import { VitePWA } from 'vite-plugin-pwa'

export default {
  build: {
    sourcemap: false,
    assetsInclude: ['./assets']
  },
  plugins: [
    VitePWA({ registerType: 'autoUpdate' })
  ]
}
