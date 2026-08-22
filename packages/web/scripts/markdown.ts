import { Effect, FileSystem } from 'effect'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

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

export const loadRegistryItems = Effect.fn(function* () {
  const fs = yield* FileSystem.FileSystem
  const items = yield* Effect.all(
    GROUP_FILES.map((group) =>
      Effect.gen(function* () {
        const file = yield* fs.readFileString(resolve(REGISTRY_DIR, group, 'registry.json'))
        // oxlint-disable-next-line
        const json = JSON.parse(file) as {
          items?: ReadonlyArray<{
            name?: string
            title?: string
            description?: string
            type?: string
          }>
        }

        return (
          json.items
            ?.filter((it) => it.name !== undefined && it.name !== '')
            .map((it) => ({
              name: it.name ?? '',
              title: it.title ?? it.name ?? '',
              description: it.description ?? '',
              category: TYPE_TO_CATEGORY[it.type ?? ''] ?? 'Components',
            })) ?? []
        )
      }),
    ),
    { concurrency: 'unbounded' },
  )
  return items.flat()
})

export const buildLlmsTxt = (items: ReadonlyArray<LlmItem>, origin: string) => {
  const lines: string[] = []
  lines.push('# foldcn')
  lines.push('')
  lines.push(
    '> Copy-paste components for Foldkit — a shadcn-style registry built on @foldkit/ui with Foldkit TEA architecture and Tailwind CSS. Install any item with `npx shadcn@latest add @foldcn/<name>`.',
  )
  lines.push('')
  lines.push('## Docs')
  lines.push(
    `- [Home](${origin}/index.md): shadcn components for Foldkit — the registry landing page.`,
  )
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
