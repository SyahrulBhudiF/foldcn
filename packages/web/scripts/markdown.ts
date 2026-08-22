// Build-time helpers for the LLM-friendly output: turning each prerendered
// page's HTML into Markdown, and assembling the `llms.txt` / `llms-full.txt`
// index files. Everything here is derived from the rendered page and the
// registry manifest, so there is nothing to maintain by hand.

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { htmlToMarkdown } from '../src/markdown'

export { htmlToMarkdown, extractMain } from '../src/markdown'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const PROJECT_DIR = resolve(SCRIPT_DIR, '..')
const REGISTRY_DIR = resolve(PROJECT_DIR, '../registry/registry/default')

export type LlmItem = Readonly<{
  name: string
  title: string
  description: string
  category: string
}>

const TYPE_TO_CATEGORY: Readonly<Record<string, string>> = {
  'registry:style': 'Base',
  'registry:lib': 'Lib',
  'registry:ui': 'Components',
  'registry:block': 'Blocks',
}

const GROUP_FILES = ['style', 'lib', 'ui', 'blocks'] as const

/** Enumerate every registry item (name, title, description, category) straight
 *  from the manifest JSON — no `?raw` imports, so this runs under plain Node. */
export const loadRegistryItems = (): ReadonlyArray<LlmItem> => {
  const items: LlmItem[] = []
  for (const group of GROUP_FILES) {
    const file = resolve(REGISTRY_DIR, group, 'registry.json')
    const json = JSON.parse(readFileSync(file, 'utf8')) satisfies {
      items?: ReadonlyArray<{
        name?: string
        title?: string
        description?: string
        type?: string
      }>
    }
    for (const it of json.items ?? []) {
      const name = it.name
      if (name === undefined || name === '') continue
      items.push({
        name,
        title: it.title ?? name,
        description: it.description ?? '',
        category: TYPE_TO_CATEGORY[it.type ?? ''] ?? 'Components',
      })
    }
  }
  return items
}

/** Build the root `llms.txt` — the deterministic, agent-readable site map. */
export const buildLlmsTxt = (items: ReadonlyArray<LlmItem>, origin: string): string => {
  const lines: string[] = []
  lines.push('# foldcn')
  lines.push('')
  lines.push(
    '> Copy-paste components for Foldkit — a shadcn-style registry built on @foldkit/ui with Foldkit TEA architecture and Tailwind CSS. Install any item with `npx shadcn@latest add @foldcn/<name>`.',
  )
  lines.push('')
  lines.push('## Docs')
  lines.push(`- [Home](${origin}/index.md): shadcn components for Foldkit — the registry landing page.`)
  lines.push(
    `- [Components](${origin}/docs.md): Browse the full catalog of ${items.length} components, blocks and utilities.`,
  )
  lines.push('')

  for (const category of ['Base', 'Lib', 'Components', 'Blocks']) {
    const group = items.filter((item) => item.category === category)
    if (group.length === 0) continue
    lines.push(`## ${category}`)
    for (const item of group) {
      lines.push(`- [${item.title}](${origin}/docs/${item.name}.md): ${item.description}`)
    }
    lines.push('')
  }

  lines.push('## Optional')
  lines.push(
    `- [llms-full.txt](${origin}/llms-full.txt): Every page as a single concatenated Markdown file.`,
  )
  lines.push('')
  return lines.join('\n')
}

/** Build `llms-full.txt` — every page concatenated, each marked by source path. */
export const buildLlmsFull = (
  sections: ReadonlyArray<{ path: string; markdown: string }>,
  origin: string,
): string => {
  const parts: string[] = []
  parts.push('# foldcn — full Markdown')
  parts.push('')
  parts.push(
    `> Concatenation of every page on ${origin}, generated automatically from the rendered site. Each section is delimited by an HTML comment marking its source path.`,
  )
  for (const section of sections) {
    parts.push('')
    parts.push(`<!-- ${section.path} -->`)
    parts.push('')
    parts.push(section.markdown.trim())
  }
  return `${parts.join('\n')}\n`
}
