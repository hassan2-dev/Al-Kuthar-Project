import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || 'https://www.al-kuthar.com').replace(/\/$/, '')
  const ogImageUrl = `${siteUrl}/logo.png`

  return {
    plugins: [
      react(),
      {
        name: 'html-inject-og-urls',
        transformIndexHtml(html) {
          return html
            .replace(/__OG_SITE_URL__/g, siteUrl)
            .replace(/__OG_IMAGE_URL__/g, ogImageUrl)
        },
      },
    ],
  }
})
