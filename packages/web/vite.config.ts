import path from 'node:path'
import { defineConfig } from 'vite'

import { foldkit } from '@foldkit/vite-plugin'
import tailwindcss from '@tailwindcss/vite'

const here = import.meta.dirname

export default defineConfig({
  plugins: [
    tailwindcss(),
    foldkit({
      devToolsMcpPort: 9988,
      ssr: { serverEntry: '/src/entry.server.ts' },
    }),
  ],
  optimizeDeps: {
    entries: ['src/entry.ts'],
  },
  resolve: {
    alias: [
      {
        find: '@/components/ui',
        replacement: path.resolve(here, '../registry/registry/default/ui'),
      },
      {
        find: '@/',
        replacement: `${path.resolve(here, '../registry/registry/default')}/`,
      },
    ],
  },
})
