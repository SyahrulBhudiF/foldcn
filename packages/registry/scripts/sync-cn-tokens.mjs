/**
 * sync-cn-tokens.mjs — regenerate the foldcn `cn-*` token layer from a local
 * shadcn/ui checkout.
 *
 * The base registry components (apps/v4/registry/bases/base/ui/*.tsx) style
 * themselves exclusively with `cn-*` utility-token classes. Those tokens are
 * defined per style in apps/v4/registry/styles/style-<name>.css. foldcn
 * derives from the `nova` style.
 *
 * What this script does:
 *   1. Scans every base ui component for referenced `cn-*` tokens.
 *   2. Extracts their definitions from styles/style-nova.css (in file order,
 *      preserving the upstream MARK section comments).
 *   3. Applies the foldkit animation-state transform (see FOLDKIT_COMPAT
 *      below): Base UI's enter/exit animation hooks `data-open:` /
 *      `data-closed:` are rewritten to foldkit's transition-scoped
 *      `data-enter:` / `data-leave:` so exit animations can play at all
 *      (foldkit keeps panels mounted through the leave phase and drops
 *      `data-open` conflicts by scoping animations to the transition).
 *   4. Emits registry/default/style/cn-tokens.css.
 *
 * Downstream, scripts/resolve-styles.mjs merges cn-tokens.css with the
 * hand-written foldkit deltas in cn-compat.css into a style map and resolves
 * every `cn-*` occurrence in component sources into concrete Tailwind classes
 * (shadcn parity: demos and installs never need the token CSS loaded).
 *
 * Tokens referenced upstream but not defined in nova.css are emitted as
 * commented placeholders — they are intentional no-op extension hooks in
 * shadcn too (e.g. cn-tabs-list-variant-line).
 *
 * Usage:
 *   node scripts/sync-cn-tokens.mjs [--shadcn-dir <path>]
 *
 * SHADCN_UI_DIR env var or --shadcn-dir must point at the shadcn/ui repo
 * checkout (the directory containing apps/v4).
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const REGISTRY_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const STYLE_DIR = join(REGISTRY_DIR, 'registry', 'default', 'style')
const TOKENS_FILE = join(STYLE_DIR, 'cn-tokens.css')

// --- args -----------------------------------------------------------------

const args = process.argv.slice(2)
const readFlag = (name) => {
  const i = args.indexOf(name)
  return i === -1 ? undefined : args[i + 1]
}
const shadcnDir = resolve(
  readFlag('--shadcn-dir') ?? process.env.SHADCN_UI_DIR ?? '/Users/elianiva/Development/repos/shadcn-ui/ui',
)
const baseUiDir = join(shadcnDir, 'apps', 'v4', 'registry', 'bases', 'base', 'ui')
const novaCssPath = join(shadcnDir, 'apps', 'v4', 'registry', 'styles', 'style-nova.css')

for (const p of [join(baseUiDir, 'button.tsx'), novaCssPath]) {
  if (!existsSync(p)) {
    console.error(`shadcn checkout not usable — missing ${p}`)
    console.error('pass --shadcn-dir <path to shadcn/ui repo containing apps/v4>')
    process.exit(1)
  }
}

// --- foldkit compat -------------------------------------------------------

/**
 * tw-animate-css utilities + project keyframe animations whose Base UI
 * `data-open:` / `data-closed:` hooks must be re-keyed for foldkit.
 *
 * foldkit overlay/panel state machine (verified in @foldkit/ui dist):
 *   EnterStart     → data-closed data-enter  data-transition
 *   EnterAnimating →           data-enter  data-transition
 *   LeaveStart     →           data-leave  data-transition
 *   LeaveAnimating → data-closed data-leave data-transition
 *   idle open      → data-open
 *
 * Re-keying animations onto data-enter/data-leave means each animation plays
 * exactly once during its transition window; persistent open styling keyed on
 * `data-open:` keeps working because foldkit emits that attribute verbatim.
 */
const ENTER_UTILITIES =
  /^(animate-in|fade-in-[\w.]+|zoom-in-[\w.]+|spin-in-[\w.]+|slide-in-from-[\w.-]+|animate-accordion-down)$/
const EXIT_UTILITIES =
  /^(animate-out|fade-out-[\w.]+|zoom-out-[\w.]+|spin-out-[\w.]+|slide-out-to-[\w.-]+|animate-accordion-up)$/

const foldkitCompat = (applyBody) =>
  applyBody
    .split(/\s+/)
    .map((utility) => {
      const m = utility.match(/^(data-open|data-closed):([\w./-]+)$/)
      if (!m) return utility
      const [, state, value] = m
      if (state === 'data-open' && ENTER_UTILITIES.test(value)) return `data-enter:${value}`
      if (state === 'data-closed' && EXIT_UTILITIES.test(value)) return `data-leave:${value}`
      return utility
    })
    .join(' ')

// --- extraction ------------------------------------------------------------

const referencedTokens = new Map() // token -> Set(component file names)
for (const file of listTsFiles(baseUiDir)) {
  const src = readFileSync(join(baseUiDir, file), 'utf8')
  for (const match of src.matchAll(/\bcn-[a-z0-9-]+\b/g)) {
    const token = match[0]
    if (!referencedTokens.has(token)) referencedTokens.set(token, new Set())
    referencedTokens.get(token).add(file.replace(/\.tsx$/, ''))
  }
}

// Ordered parse of `.token { @apply ... }` rules inside `.style-nova { }`,
// keeping upstream MARK comments as section boundaries.
const novaSrc = readFileSync(novaCssPath, 'utf8')
const bodyStart = novaSrc.indexOf('.style-nova {')
if (bodyStart === -1) {
  console.error(`no .style-nova block found in ${novaCssPath}`)
  process.exit(1)
}
const novaBody = novaSrc.slice(bodyStart)

const sections = [] // { mark: string|null, rules: Array<{token, apply}> }
let currentSection = { mark: null, rules: [] }
const ruleRe =
  /(\/\*\s*MARK:\s*([\w /-]+?)\s*\*\/|\.([a-zA-Z0-9_-]+)\s*\{\s*@apply([^}]*?)\})/g
for (const match of novaBody.matchAll(ruleRe)) {
  if (match[2] !== undefined) {
    if (currentSection.rules.length > 0 || currentSection.mark !== null) {
      sections.push(currentSection)
    }
    currentSection = { mark: match[2].trim(), rules: [] }
  } else {
    currentSection.rules.push({
      token: match[3],
      apply: match[4].trim().replace(/;+$/, ''),
      transformed: foldkitCompat(match[4].trim().replace(/;+$/, '')),
    })
  }
}
if (currentSection.rules.length > 0) sections.push(currentSection)

const definedTokens = new Map() // token -> rule
for (const section of sections) {
  for (const rule of section.rules) {
    definedTokens.set(rule.token, rule)
  }
}

const missing = [...referencedTokens.keys()].filter((t) => !definedTokens.has(t))
const unusedDefined = [...definedTokens.keys()].filter((t) => !referencedTokens.has(t))

// --- emit cn-tokens.css ----------------------------------------------------

const header = `/* Generated by scripts/sync-cn-tokens.mjs — do not edit by hand.
 *
 * Source: ${relShadcn(shadcnDir)}/apps/v4/registry/{bases/base/ui,styles/style-nova.css}
 * (${new Date().toISOString().slice(0, 10)})
 *
 * The classes below are the utility tokens referenced by the shadcn v4 BASE
 * registry components. foldcn component files emit these token classes
 * verbatim so their class strings stay diffable against upstream.
 *
 * foldkit adaptation applied mechanically by the sync script:
 *   data-open:<enter animation>  -> data-enter:<enter animation>
 *   data-closed:<exit animation> -> data-leave:<exit animation>
 * (foldkit scopes panel animations to its enter/leave transition windows;
 *  persistent state styling keyed on data-open: is untouched — foldkit
 *  emits data-open while open.)
 *
 * Hand-maintained foldkit deltas live in cn-compat.css (merged ahead of
 * these rules by scripts/resolve-styles.mjs), e.g. aria-disabled/data-disabled
 * twins for controls where foldkit cannot emit the native disabled attribute.
 *
 * Referenced upstream but NOT defined in style-nova.css (intentional no-op
 * hooks there too): ${missing.length > 0 ? missing.join(', ') : '(none)'}
 */
`

let out = header
for (const section of sections) {
  const rules = section.rules.filter((r) => referencedTokens.has(r.token))
  if (rules.length === 0) continue
  out += `\n/* MARK: ${section.mark ?? 'Uncategorized'} */\n`
  for (const { token, transformed } of rules) {
    out += `.${token} {\n  @apply ${transformed};\n}\n\n`
  }
}

writeFileSync(TOKENS_FILE, out)

console.log(`cn-tokens.css written: ${definedTokens.size} defined / ${referencedTokens.size} referenced tokens`)
if (missing.length > 0) console.log(`  missing from nova (kept as no-op hooks): ${missing.join(', ')}`)
if (unusedDefined.length > 0) {
  console.log(`  defined but unused by base ui (skipped): ${unusedDefined.join(', ')}`)
}

// --- helpers ----------------------------------------------------------------

function listTsFiles(dir) {
  try {
    return readdirSync(dir).filter((f) => f.endsWith('.tsx'))
  } catch {
    console.error(`cannot read directory ${dir}`)
    process.exit(1)
  }
}

function relShadcn(p) {
  return p.replace(/\/+$/, '')
}
