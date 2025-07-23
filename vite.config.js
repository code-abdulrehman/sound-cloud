import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.mp3', '**/*.wav', '**/*.ogg'], // Include audio files as assets
  server: {
    fs: {
      allow: ['..']
    }
  }
})
