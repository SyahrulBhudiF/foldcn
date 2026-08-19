import { highlight } from '@tanstack/highlight'
import type { Attribute, Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Styled class constants — override these to re-skin the code block.
// ---------------------------------------------------------------------------

export const codeBlockWrapperClass =
  'overflow-hidden rounded-lg border border-border'

export const codeBlockHeaderClass =
  'flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-2'

export const codeBlockFilePathClass =
  'truncate font-mono text-xs text-muted-foreground'

export const codeBlockMetaClass = 'flex items-center gap-2'

export const codeBlockLineCountClass =
  'text-xs text-muted-foreground'

export const codeBlockCopyButtonClass =
  'inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer'

// ---------------------------------------------------------------------------
// Code block view — provides syntax highlighting, file header, and copy.
// ---------------------------------------------------------------------------

export type CodeBlockConfig<M> = Readonly<{
  /** File path shown in the header (e.g. "registry/default/ui/button.ts"). */
  path: string
  /** Source code to highlight. */
  code: string
  /** Language for syntax highlighting (default: inferred from path extension). */
  lang?: string
  /** Message dispatched when the user clicks the copy button. */
  onCopy?: M
  /** Whether the copy button should show a checkmark (copied state). */
  isCopied?: boolean
  /** Additional class names for the outer wrapper. */
  className?: string
}>

const LANG_BY_EXT: Record<string, string> = {
  ts: 'ts',
  tsx: 'tsx',
  js: 'js',
  jsx: 'jsx',
  css: 'css',
  html: 'html',
  json: 'json',
  jsonc: 'json',
  md: 'markdown',
  markdown: 'markdown',
  sh: 'shell',
  shell: 'shell',
  bash: 'shell',
  zsh: 'shell',
  py: 'python',
  python: 'python',
  yaml: 'yaml',
  yml: 'yaml',
  toml: 'toml',
  dockerfile: 'dockerfile',
  docker: 'dockerfile',
  sql: 'sql',
  xml: 'html',
  svelte: 'svelte',
  vue: 'vue',
  ejs: 'ejs',
  env: 'env',
  dotenv: 'env',
  diff: 'diff',
  patch: 'diff',
  nginx: 'nginx',
  http: 'http',
  scheme: 'scheme',
  scm: 'scheme',
  racket: 'scheme',
  mermaid: 'mermaid',
}

const inferLang = (path: string): string => {
  const ext = path.split('.').pop()?.toLowerCase() ?? ''
  return LANG_BY_EXT[ext] ?? 'plaintext'
}

/** Render a highlighted code block with file header and copy button. */
export const codeBlock = <M>(
  config: CodeBlockConfig<M>,
  h: HtmlBuilder<M>,
): Html => {
  const lang = config.lang ?? inferLang(config.path)
  const result = highlight(config.code, { lang })
  const lineCount = config.code.split('\n').length

  const copyAttrs: ReadonlyArray<Attribute<M>> = config.onCopy !== undefined
    ? [h.OnClick(config.onCopy)]
    : []

  // TanStack Highlight emits <pre class="th-code th-code--{lang}" data-language="{lang}">
  // with inner <span class="th-token th-{token}"> for each tokenized range.
  // The theme CSS (createThemeCss) maps th-* classes to CSS custom properties.
  return h.div(
    [h.Class(cn(codeBlockWrapperClass, config.className))],
    [
      // Header bar: file path + line count + copy button
      h.div([h.Class(codeBlockHeaderClass)], [
        h.code([h.Class(codeBlockFilePathClass)], [config.path]),
        h.span([h.Class(codeBlockMetaClass)], [
          h.span([h.Class(codeBlockLineCountClass)], [`${lineCount} lines`]),
          h.button(
            [
              h.Class(codeBlockCopyButtonClass),
              h.OnCopyText(config.code),
              h.AriaLabel('Copy source code'),
              ...copyAttrs,
            ],
            [
              config.isCopied
                ? h.span([h.Class('size-4')], ['✓'])
                : h.span([h.Class('size-4')], ['⧉']),
            ],
          ),
        ]),
      ]),
      // Highlighted code body — the pre.th-code from highlight() is injected
      // via InnerHTML. Theme CSS provides background, padding, and token colors.
      h.div([h.InnerHTML(result.html)],
      ),
    ],
  )
}
