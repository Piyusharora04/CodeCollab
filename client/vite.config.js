import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Allows access from Docker
    port: 5173,       // Make sure this matches your docker-compose.yml
    strictPort: true,
    watch: {
      usePolling: true // Fixes issues in Docker where changes might not reflect
    }
  }
})
