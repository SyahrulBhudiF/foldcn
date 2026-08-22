import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'

import { foldkit } from '@foldkit/vite-plugin'
import tailwindcss from '@tailwindcss/vite'

const here = import.meta.dirname

/**
 * In dev, the Foldkit host refuses requests that don't accept HTML (e.g.
 * `Accept: text/markdown`). This middleware makes markdown-preferring requests
 * look like they also accept HTML so the host forwards them to the SSR entry,
 * which then returns the Markdown representation directly. Production does the
 * same via the Cloudflare Worker; this keeps dev and prod behavior aligned.
 */
const markdownDevPlugin = (): Plugin => ({
  name: 'foldcn-markdown-dev',
  configureServer(server) {
    server.middlewares.use((nodeRequest, _nodeResponse, next) => {
      const accept = nodeRequest.headers.accept
      const headerValue = Array.isArray(accept) ? accept.join(', ') : accept
      if (headerValue !== undefined && /text\/markdown/i.test(headerValue)) {
        // Ensure the host's `acceptsHtml` check passes, but keep Markdown
        // weighted higher so the SSR entry still prefers it.
        if (!/text\/html/i.test(headerValue)) {
          const separator = headerValue !== '' ? ', ' : ''
          nodeRequest.headers.accept = `${headerValue}${separator}text/html;q=0.1`
        }
      }
      next()
    })
  },
})

export default defineConfig({
  plugins: [
    tailwindcss(),
    foldkit({
      devToolsMcpPort: 9988,
      ssr: { serverEntry: '/src/entry.server.ts' },
    }),
    markdownDevPlugin(),
  ],
  optimizeDeps: {
    entries: ['src/entry.ts'],
  },
  resolve: {
    alias: [
      {
        // Blocks compose components via the user-facing `@/components/ui`
        // alias (kept intact for shadcn installs); in the demo app it resolves
        // to the resolved tree.
        find: '@/components/ui',
        replacement: path.resolve(here, '../registry/styles/default/ui'),
      },
      {
        // Everything the demos render resolves inside the resolved tree:
        // components import `@/lib/utils`, lib helpers import `@/ui/*` —
        // all served from styles/default so no raw cn-* code ever loads.
        find: '@/',
        replacement: `${path.resolve(here, '../registry/styles/default')}/`,
      },
    ],
  },
})
