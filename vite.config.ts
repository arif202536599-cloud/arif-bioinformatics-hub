import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  base: './', // Using relative base allows deployment on any subpath or GitHub Pages repository without path breakages
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
