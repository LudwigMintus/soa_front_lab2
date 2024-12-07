import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:41147/movies',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

