/**
 * resolve-styles.mjs — emit installable component trees with `cn-*` utility
 * tokens pre-resolved into concrete Tailwind classes.
 *
 * This mirrors the shadcn v4 registry pipeline (apps/v4/scripts/build-registry.mts):
 * authored components reference semantic `cn-*` token classes; a style map built
 * from the style CSS (`cn-tokens.css` + `cn-compat.css`) substitutes every token
 * occurrence inside string literals with its resolved utilities. Demos render the
 * resolved tree and the registry build ships it, so neither needs the token CSS
 * loaded at runtime — exactly how ui.shadcn.com demos work.
 *
 * Outputs (gitignored, regenerate via this script or `pnpm --filter @foldcn/registry build`):
 *   styles/<style>/ui/*.ts       transformed component sources
 *   styles/<style>/lib/*.ts      verbatim copies (no tokens to resolve)
 *   styles/<style>/blocks/**     verbatim copies (no tokens to resolve)
 *
 * The transform is intentionally simpler than upstream's ts-morph transformer:
 * foldcn sources are plain `.ts` view factories whose class strings only ever
 * appear as static string literals (variable/object-literal initializers,
 * `cn(...)` arguments), so walking every string literal subsumes upstream's
 * cva/className/mergeProps appliers. Unlike upstream we keep NO allowlist —
 * foldcn resolves every token, including `cn-font-heading` / `cn-rtl-flip`
 * which are defined in cn-compat.css rather than left for CLI-side rewriting.
 *
 * Usage: node scripts/resolve-styles.mjs
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Node, Project } from 'ts-morph'
import { twMerge } from 'tailwind-merge'

import { createStyleMap } from './lib/create-style-map.mjs'

const REGISTRY_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DEFAULT_DIR = join(REGISTRY_DIR, 'registry', 'default')
const STYLES_OUT_ROOT = join(REGISTRY_DIR, 'styles')

/**
 * Style combinations to emit. foldcn currently derives a single style from the
 * shadcn `nova` tokens (see scripts/sync-cn-tokens.mjs); add entries here when
 * additional styles are derived. Compat CSS concatenates FIRST so its deltas
 * win tailwind-merge conflicts against the generated token layer.
 */
const STYLES = [
  {
    name: 'default',
    title: 'Default',
    cssFiles: ['cn-compat.css', 'cn-tokens.css'],
  },
]

// Directories copied verbatim into each style tree. They contain no `cn-*`
// references today; the assertion below keeps that guarantee honest.
const VERBATIM_DIRS = ['lib', 'blocks']
const TOKEN_DIR = 'ui'
const TOKEN_SOURCE_EXT = '.ts'

export function resolveStyles() {
  const created = []

  for (const style of STYLES) {
    const cssText = style.cssFiles
      .map((file) => {
        const path = join(DEFAULT_DIR, 'style', file)
        if (!existsSync(path)) throw new Error(`missing style css: ${path}`)
        return readFileSync(path, 'utf8')
      })
      .join('\n')

    const styleMap = createStyleMap(cssText)
    if (Object.keys(styleMap).length === 0) {
      throw new Error(`style "${style.name}" produced an empty cn-* map`)
    }

    const outDir = join(STYLES_OUT_ROOT, style.name)
    rmSync(outDir, { recursive: true, force: true })

    created.push(...transformTokenDir(style, styleMap, outDir))
    for (const dir of VERBATIM_DIRS) created.push(...copyVerbatim(style, dir, outDir))
  }

  return created
}

function transformTokenDir(style, styleMap, outDir) {
  const sourceDir = join(DEFAULT_DIR, TOKEN_DIR)
  const files = readdirSync(sourceDir).filter(
    (file) => file.endsWith('.ts') && file !== 'registry.json',
  )

  // One shared in-memory project: edits stay formatted because only literal
  // contents change.
  const project = new Project({ useInMemoryFileSystem: true })
  const unmappedTokens = new Set()

  const written = []
  for (const file of files) {
    const source = readFileSync(join(sourceDir, file), 'utf8')
    const sourceFile = project.createSourceFile(file, source, { overwrite: true })
    transformSourceFile(sourceFile, styleMap, unmappedTokens)

    const output = sourceFile.getFullText()
    assertNoTokenLiterals(file, output)

    const outPath = join(outDir, TOKEN_DIR, file)
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath, output)
    written.push(join(style.name, TOKEN_DIR, file))
  }

  if (unmappedTokens.size > 0) {
    console.warn(
      `resolve-styles [${style.name}]: tokens referenced by components but absent from the style map ` +
        `(stripped from output — check cn-tokens.css/cn-compat.css for drift):\n  ${[...unmappedTokens].join('\n  ')}`,
    )
  }

  return written
}

function copyVerbatim(style, dir, outDir) {
  const sourceDir = join(DEFAULT_DIR, dir)
  if (!existsSync(sourceDir)) return []

  const targetDir = join(outDir, dir)
  cpSync(sourceDir, targetDir, { recursive: true })

  // Drop registry manifests from the verbatim copy — they are authoring
  // metadata, not shippable source.
  rmSync(join(targetDir, 'registry.json'), { force: true })
  return []
}

// --- string-literal transformer ---------------------------------------------
// Adapted from shadcn-ui/ui packages/shadcn/src/styles/transform-style-map.ts
// (MIT): same extraction/removal/merge helpers, applied to every string
// literal instead of only cva/className/mergeProps positions.

function transformSourceFile(sourceFile, styleMap, unmappedTokens) {
  sourceFile.forEachDescendant((node) => {
    if (!isStringLiteralLike(node)) return

    const value = node.getLiteralText()
    const tokens = extractCnClasses(value)
    if (tokens.length === 0) return

    for (const token of tokens) {
      if (!(token in styleMap)) unmappedTokens.add(token)
    }

    const resolution = tokens
      .map((token) => styleMap[token])
      .filter((classes) => Boolean(classes))
      .join(' ')

    node.setLiteralValue(removeCnClasses(mergeClasses(resolution, value)))
  })
}

function isStringLiteralLike(node) {
  return Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node)
}

function extractCnClasses(str) {
  return Array.from(str.matchAll(/\bcn-[\w-]+\b/g), (match) => match[0])
}

function removeCnClasses(str) {
  return str
    .replace(/\bcn-[\w-]+\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function mergeClasses(newClasses, existing) {
  return twMerge(newClasses, existing)
}

function assertNoTokenLiterals(file, output) {
  const project = new Project({ useInMemoryFileSystem: true })
  const check = project.createSourceFile(`${file}.check`, output, { overwrite: true })
  const offenders = []

  check.forEachDescendant((node) => {
    if (isStringLiteralLike(node) && /\bcn-[\w-]+\b/.test(node.getLiteralText())) {
      offenders.push(node.getLiteralText().slice(0, 120))
    }
  })

  if (offenders.length > 0) {
    throw new Error(
      `resolve-styles: ${file} still contains cn-* string literals after transform:\n  ${offenders.join('\n  ')}`,
    )
  }
}

// --- CLI entry ---------------------------------------------------------------

const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href

if (isMain) {
  const written = resolveStyles()
  console.log(`resolve-styles: emitted ${written.length} transformed files for ${STYLES.map((s) => s.name).join(', ')}`)
}
