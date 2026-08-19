import type { WorkerEnv } from '../../../alchemy.run'

/**
 * foldcn runs on Cloudflare Workers via alchemy (`Cloudflare.Website` with
 * `assets.runWorkerFirst`). Routing:
 *
 *   - `/r/{name}.json` and `/r/registry.json` — the shadcn install contract.
 *     The compiled registry is copied into the static assets during the build
 *     (`dist/client/r`), so we fetch it through `env.ASSETS` and attach cache
 *     headers tuned for an immutable, content-addressed-ish registry: clients
 *     revalidate every 10 minutes, CDN holds it for a day.
 *   - every other path falls through to the static site (SSG HTML + assets).
 */
const REGISTRY_CACHE = 'public, max-age=600, stale-while-revalidate=86400'

const registryPath = (pathname: string): string | undefined =>
  pathname === '/r/registry.json'
    ? '/r/registry.json'
    : /^\/r\/[a-z0-9-]+\.json$/i.test(pathname)
      ? pathname
      : undefined

const asRegistryResponse = (res: Response): Response => {
  const headers = new Headers(res.headers)
  headers.set('cache-control', REGISTRY_CACHE)
  headers.set('content-type', 'application/json; charset=utf-8')
  // Registry items are deterministic per build: never re-render, just revalidate.
  headers.set('vary', 'accept-encoding')
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  })
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 })
    }

    const url = new URL(request.url)
    const registryFile = registryPath(url.pathname)
    if (registryFile !== undefined) {
      // A 404 for `/r/unknown.json` (or a missing `registry.json`) should
      // surface as JSON, not fall through to an HTML 404 page.
      const res = await env.ASSETS.fetch(
        new Request(new URL(registryFile, request.url).toString(), request),
      )
      if (res.status === 404) {
        return new Response(JSON.stringify({ error: `Registry item not found: ${registryFile}` }), {
          status: 404,
          headers: { 'content-type': 'application/json; charset=utf-8' },
        })
      }
      return asRegistryResponse(res)
    }

    return env.ASSETS.fetch(request)
  },
}
