import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'core/index': 'src/core/index.ts',
    'ui/index': 'src/ui/index.tsx',
    'next/index': 'src/next/index.ts',
    'vite/index': 'src/vite/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  external: ['react', 'react-dom', 'react-markdown'],
  outDir: 'dist',
  banner: {
    js: '#!/usr/bin/env node',
  },
})