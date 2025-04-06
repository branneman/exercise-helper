import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'

export default defineConfig({
  plugins: [eslint(), react(), tsconfigPaths()],
  define: {
    'import.meta.vitest': 'undefined',
  },
  test: {
    includeSource: ['src/**/*.{js,ts}'],
  },
})
