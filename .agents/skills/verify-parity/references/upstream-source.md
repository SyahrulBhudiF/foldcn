# Upstream Source

Foldcn derives from the shadcn v4 BASE registry, not the legacy inline registry.

## Canonical source

- Repo: `https://github.com/shadcn-ui/ui`
- Path: `apps/v4/registry/bases/base/ui/*.tsx` (components) + `apps/v4/registry/styles/style-*.css` (tokens)
- Docs: `https://ui.shadcn.com/docs/components` (rendered from same registry)
- Vendored copies: `packages/registry/registry/styles/style-*.css` (byte-identical, refreshed by `sync-styles.mjs`)
- Component sources: copy `cn-*` class strings verbatim per `docs/deriving-from-base.md`

## Sourcing options

### 1. Local checkout (preferred)

```bash
# default location used by sync-styles.mjs
ls ~/Development/repos/shadcn-ui/ui/apps/v4/registry/bases/base/ui

# or set explicitly
SHADCN_UI_DIR=/path/to/ui node .agents/skills/verify-parity/scripts/verify-parity.mjs --inventory
```

Record the commit:
```bash
git -C $SHADCN_UI_DIR rev-parse --short=7 HEAD
```

Compare vendored CSS drift:
```bash
node packages/registry/scripts/sync-styles.mjs --check
```

### 2. Live docs (no checkout)

```bash
node .agents/skills/verify-parity/scripts/fetch-upstream.mjs
```

This fetches `https://ui.shadcn.com/docs/components` and enumerates component pages. It writes `.tmp/upstream.json` with `{ name, url }` list for the inventory step. Use when the checkout is unavailable.

### 3. Existing audit

`docs/shadcn-base-parity-audit.md` already enumerates paired vs not-covered sets and verdicts (MATCHES/MINOR/MAJOR). Use it as baseline, but re-verify against live upstream — the audit's Status blockquote notes which gaps are FIXED post-migration.

## When to refresh vendored styles

```bash
node packages/registry/scripts/sync-styles.mjs
node packages/registry/scripts/sync-styles.mjs --check
pnpm --filter @foldcn/registry build
```

Keep vendored files byte-identical (ADR-015). Visual deltas go to `registry/default/style/cn-compat.css`.
