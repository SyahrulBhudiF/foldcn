// Shared Markdown helpers — used both at build time (prerender) and at
// request time (dev SSR via entry.server). Keep this free of Node file-system
// dependencies so it can be imported from the Vite SSR entry.

import { NodeHtmlMarkdown } from 'node-html-markdown'

// Elements that carry no prose value for an LLM: chrome, navigation, controls.
// (The sidebar `<aside>` and breadcrumb `<nav>` live inside `<main>` on item
// pages, so we drop them here rather than in the extraction step.)
const MD = new NodeHtmlMarkdown({
  codeFence: '```',
  codeBlockStyle: 'fenced',
  bulletMarker: '-',
  emDelimiter: '_',
  strongDelimiter: '**',
  useInlineLinks: true,
  ignore: ['button', 'script', 'style', 'aside', 'nav', 'svg', 'img'],
  maxConsecutiveNewlines: 2,
})

/** Pull the `<main>…</main>` region out of a rendered page (falls back to the
 *  whole document if, for some reason, no `<main>` was emitted). */
export const extractMain = (html: string): string => {
  const start = html.search(/<main[\s>]/i)
  if (start === -1) return html
  const end = html.indexOf('</main>', start)
  if (end === -1) return html
  return html.slice(start, end + '</main>'.length)
}

// node-html-markdown reads fence languages from a `language-*` class on the
// `<code>` element, but the registry code blocks carry the language on the
// wrapping `<pre data-language="ts">` with a bare `<code>` inside. Copy it
// across before translating.
const annotateCodeLanguages = (html: string): string =>
  html.replace(
    /(<pre[^>]*\bdata-language="([\w-]+)"[^>]*>\s*<code)>/g,
    (_match, open: string, language: string) => `${open} class="language-${language}">`,
  )

// Flex/grid layouts separate inline siblings with CSS `gap`, so the serialized
// HTML carries no whitespace between them and the converter would jam them
// into one word ("PreviewInteractive demo", "CtrlShift⌘K"). Inline elements
// closed immediately before another element get one space inserted. Void
// elements count as separators too ("<label>Email</label><input><span>…").
// Regions inside <pre> are skipped — highlighted tokens are adjacent spans
// whose spacing is significant source code.
const INLINE_SIBLINGS = 'span|code|kbd|a|strong|em|b|i|small|time|abbr|label|option'
const VOID_ELEMENTS = 'input|img|br|hr|select'
const JAMMED_SIBLINGS = new RegExp(
  `(</(?:${INLINE_SIBLINGS})>)\\s*(<(?:${INLINE_SIBLINGS}|${VOID_ELEMENTS})[\\s>/])`,
  'g',
)

const separateInlineSiblings = (html: string): string =>
  html
    .split(/(<pre[\s\S]*?<\/pre>)/g)
    .map((part, index) => (index % 2 === 1 ? part : part.replace(JAMMED_SIBLINGS, '$1 $2')))
    .join('')

/** Resolve root-relative Markdown links against the site origin so they keep
 *  working when the file is read outside the context of the page it came from
 *  (an agent fetching `/docs/button.md` has no base URL to resolve against).
 *  Applied to the translated Markdown rather than the source HTML so literal
 *  `href="…"` text inside code listings is never touched. */
const absolutizeLinks = (markdown: string, origin: string): string =>
  markdown.replace(/\]\((\/[^)\s]*)\)/g, (_match, path: string) => `](${origin}${path})`)

/** Convert a rendered page's HTML to clean Markdown. */
export const htmlToMarkdown = (html: string, origin: string): string => {
  const main = extractMain(html)
  const markdown = MD.translate(separateInlineSiblings(annotateCodeLanguages(main)))
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return `${absolutizeLinks(markdown, origin)}\n`
}
