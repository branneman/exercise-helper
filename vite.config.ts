import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [eslint(), react()],
  define: {
       'import.meta.vitest': 'undefined',
     },
  test: {
    includeSource: ['src/**/*.{js,ts}'],
  }
})
