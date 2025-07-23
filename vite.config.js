import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.mp3', '**/*.wav', '**/*.ogg', '**/*.m4a', '**/*.aac'], // Include audio files as assets
  server: {
    fs: {
      allow: ['..']
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Keep audio files with their original names for better caching
          if (assetInfo.name && /\.(mp3|wav|ogg|m4a|aac)$/i.test(assetInfo.name)) {
            return 'assets/audio/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
