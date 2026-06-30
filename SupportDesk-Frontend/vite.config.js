import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The dev server proxies "/api" to the backend. The target is configurable so
// that inside Docker it points at the "backend" service, while locally it
// defaults to localhost. This keeps the browser talking to its own origin and
// avoids any hardcoded backend URLs in the frontend code.
const proxyTarget = process.env.BACKEND_URL || 'http://localhost:8000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // listen on 0.0.0.0 so the container is reachable
    port: 5173,
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
      },
    },
  },
})
