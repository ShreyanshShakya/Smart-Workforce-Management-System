import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    minify: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'recharts';
            if (id.includes('lucide-react')) return 'lucide';
            if (id.includes('axios')) return 'axios';
            return 'vendor';
          }
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
  }
})