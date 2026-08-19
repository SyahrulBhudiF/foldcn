import { spawnSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// One id names this build, and every command below is given that same id, so
// the client bundle and the server bundle of a deployment agree on which
// deployment they are. FOLDKIT_BUILD_ID is compiled into the bundle by
// @foldkit/vite-plugin; Runtime.hydrate compares it before adopting any DOM.
const supplied = process.env.FOLDKIT_BUILD_ID
const buildId =
  supplied === undefined || supplied === '' ? randomUUID() : supplied

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const WEB_DIR = resolve(SCRIPT_DIR, '..')
const REGISTRY_DIST = resolve(WEB_DIR, '../registry/dist/r')
const CLIENT_DIR = resolve(WEB_DIR, 'dist/client')

/** Recursively copy a directory of files (the built registry JSON). */
const copyDir = (fromDir, toDir) => {
  mkdirSync(toDir, { recursive: true })
  for (const entry of readdirSync(fromDir)) {
    const from = resolve(fromDir, entry)
    const to = resolve(toDir, entry)
    if (statSync(from).isDirectory()) {
      copyDir(from, to)
    } else {
      copyFileSync(from, to)
    }
  }
}

const steps = [
  ['vite', ['build', '--outDir', 'dist/client']],
  ['vite', ['build', '--ssr', 'src/entry.server.ts', '--outDir', 'dist/server']],
  ['tsx', ['scripts/prerender.ts']],
]

for (const [command, args] of steps) {
  const { status } = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, FOLDKIT_BUILD_ID: buildId },
  })
  if (status !== 0) {
    process.exit(status ?? 1)
  }
}

// The Cloudflare Worker serves `/r/{name}.json` from the static assets (which
// it reaches through `env.ASSETS`), so the compiled registry must ship inside
// the client output directory.
if (!existsSync(REGISTRY_DIST)) {
  throw new Error(`Registry build output not found at ${REGISTRY_DIST}. Run the registry build first.`)
}
copyDir(REGISTRY_DIST, resolve(CLIENT_DIR, 'r'))
console.log(`Copied registry → ${resolve(CLIENT_DIR, 'r')}`)