import { Effect } from 'effect'
import { Server } from 'foldkit/experimental'

import { items } from './catalog'
import { init } from './init'
import { htmlToMarkdown } from './markdown'
import { view } from './view'

export const prerenderPaths: ReadonlyArray<string> = [
  '/',
  '/docs',
  ...items.map((item) => `/docs/${item.name}`),
]

/** Parse the `q` parameter for a media type in an `Accept` header, or null. */
const qValue = (accept: string, type: string): number | null => {
  const re = new RegExp(`${type.replace('/', '\\/')}\\s*(?:;\\s*q=([0-9.]+))?`, 'i')
  const match = accept.match(re)
  if (match === null) return null
  return match[1] === undefined ? 1 : Number(match[1])
}

/**
 * True when the client explicitly prefers Markdown over HTML: it lists
 * `text/markdown` and either sends no `text/html`, or weights Markdown higher.
 * Browsers (which send `text/html, …`) therefore keep getting HTML.
 */
const prefersMarkdown = (request: Request): boolean => {
  const accept = request.headers.get('accept') ?? ''
  if (!/text\/markdown/i.test(accept)) return false
  const htmlQ = qValue(accept, 'text/html')
  if (htmlQ === null) return true
  const markdownQ = qValue(accept, 'text/markdown') ?? 1
  return markdownQ > htmlQ
}

const isMarkdownPath = (pathname: string): boolean => pathname.endsWith('.md')

const sourcePathForMarkdown = (pathname: string): string => {
  if (pathname === '/index.md') return '/'
  if (pathname.endsWith('.md')) return pathname.slice(0, -3)
  return pathname
}

const originOf = (request: Request): string => {
  try {
    return new URL(request.url).origin
  } catch {
    return 'https://foldcn.elianiva.com'
  }
}

export const renderPage = (request: Request): Promise<Server.EntryResult> =>
  Effect.runPromise(
    Effect.gen(function* () {
      const url = new URL(request.url)
      const wantsMarkdown = isMarkdownPath(url.pathname) || prefersMarkdown(request)

      // Normalize `.md` URLs to their source page before routing. `/docs/avatar.md`
      // renders the same as `/docs/avatar`, and `/index.md` maps to `/`.
      const renderUrl = wantsMarkdown && isMarkdownPath(url.pathname)
        ? new URL(sourcePathForMarkdown(url.pathname) + url.search, request.url).toString()
        : request.url

      const renderedApplication = yield* Server.renderToString(
        { routing: {}, init, view },
        { url: renderUrl, buildId: import.meta.env.FOLDKIT_BUILD_ID },
      )

      if (wantsMarkdown) {
        const markdown = htmlToMarkdown(renderedApplication.html, originOf(request))
        return Server.Responded(
          new Response(markdown, {
            headers: {
              'content-type': 'text/markdown; charset=utf-8',
              vary: 'accept',
            },
          }),
        )
      }

      return Server.Rendered(renderedApplication)
    }),
  )
