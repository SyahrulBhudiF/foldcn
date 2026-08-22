# Deriving foldcn components from the shadcn v4 base registry

Since ADR-014, foldcn components are **derivations of the shadcn v4 BASE registry**
(`shadcn-ui/ui/apps/v4/registry/bases/base/ui/*.tsx`, styled by `style-nova.css`) —
not of the legacy inline-class registry. This doc is the recipe.

## Architecture

```
shadcn/ui checkout (upstream)
  bases/base/ui/button.tsx          ← class strings to copy verbatim
  styles/style-nova.css             ← .cn-* token definitions
        │
        │  packages/registry/scripts/sync-cn-tokens.mjs
        ▼
registry/default/style/cn-tokens.css    ← GENERATED token layer (do not edit)
registry/default/style/cn-compat.css    ← hand-written foldkit deltas (edit here)
        │
        │  packages/registry/scripts/resolve-styles.mjs
        ▼
styles/default/{ui,lib,blocks}/         ← RESOLVED tree (gitignored, regenerate)
  component sources with every cn-* token substituted by its concrete
  Tailwind classes — shadcn parity: this is what demos render and what
  `shadcn build` ships to users (dist/r/*.json)
```

**Authored component files emit only token classes** (`cn-button
-cn-button-variant-default …`), so a component's class strings stay diffable
against upstream and visual changes are one CSS edit away. Never inline resolved
utilities in authored files. The resolved tree is derived: `resolve-styles.mjs`
merges compat CSS ahead of the generated tokens into a style map and rewrites
every string literal (same mechanism as upstream's `build-registry.mts`).

## Deriving a component (recipe)

1. Read upstream `bases/base/ui/<name>.tsx`. Note its parts, variants, sizes,
   defaults, `data-slot` names, and every `cn-*` class it references.
2. Rewrite the foldcn file so each part's class string is **character-identical**
   to upstream's (minus React-isms). Keep foldcn's config/view factory shape
   (ADR-011) — only the emitted classes and attributes change.
3. Emit the same `data-slot` attributes as upstream on every part.
4. Map state attributes per the table below.
5. If upstream relies on an attribute foldkit cannot emit, add a rule to
   `cn-compat.css` (see "Compat conventions") instead of editing the classes.
6. Run `pnpm --filter @foldcn/registry build && pnpm --filter @foldcn/web build`
   (the web predev/prebuild hooks re-resolve automatically), then check the
   demo page visually.

Worked example: `ui/button.ts` vs upstream `button.tsx`.

## State attribute mapping

| Base UI emits            | foldkit emits                                   | What to do |
| ------------------------ | ----------------------------------------------- | ---------- |
| `data-open` (persistent) | `data-open` (same name, also present during leave) | nothing |
| `data-open:<enter anim>` | `data-enter` / `data-leave` transition windows  | handled mechanically by the sync script |
| `data-closed:<exit anim>`| same                                            | handled mechanically by the sync script |
| `data-starting-style` / `data-ending-style` | nothing equivalent           | adapt at migration time (transition-based tokens: sheet, drawer, select) |
| `data-side="bottom"`     | `data-placement="bottom-start"`                 | emit `data-side` yourself when building the view (values derive from anchor placement); logical sides (`inline-start/end`) have no foldkit equivalent |
| native `disabled`        | `aria-disabled` + `data-disabled` (stays focusable) | add aria-/data- twins in `cn-compat.css` |
| `data-highlighted` / `focus:` item states | `data-active`                  | keep foldkit's attr, adjust the variant prefix in the copied string |

The sync script rewrites exactly this pattern inside extracted tokens:

```
data-open:<animate-in|fade-in-*|zoom-in-*|spin-in-*|slide-in-from-*|animate-accordion-down>
  → data-enter:<same>
data-closed:<animate-out|fade-out-*|zoom-out-*|spin-out-*|slide-out-to-*|animate-accordion-up>
  → data-leave:<same>
```

Persistent open styling keyed on `data-open:` is intentionally untouched.

## Compat conventions (`cn-compat.css`)

Hand-maintained foldkit deltas. `resolve-styles.mjs` concatenates this file
AHEAD of `cn-tokens.css` when building the style map, so delta utilities win
tailwind-merge conflicts and land at the end of each resolved string. Put a
rule here when:

- foldkit cannot emit an attribute upstream styles (e.g. `.cn-button` gained
  `aria-disabled:`/`data-disabled:` twins because foldkit never sets native
  `disabled`);
- upstream defines a token outside style-nova.css (e.g. `cn-font-heading`,
  `cn-rtl-flip`, the `no-scrollbar` utility).

Comment every rule with the reason. If you find yourself wanting to edit a
generated token instead — move the delta here.

## Refreshing upstream

```bash
# point at your shadcn/ui checkout (default: ~/Development/repos/shadcn-ui/ui)
node packages/registry/scripts/sync-cn-tokens.mjs
pnpm --filter @foldcn/registry build   # resolve styles → dist/r (asserts no unresolved literals)
pnpm --filter @foldcn/web build && pnpm --filter @foldcn/web test
```

The script reports tokens referenced upstream but missing from nova.css
(intentional no-op hooks there too — they are listed in the generated file's
header, not emitted).

## Theme variables

Component tokens assume the full shadcn v4 variable set. When a migration needs
a family foldcn doesn't define yet (e.g. `--sidebar-*` was added for sidebar
tokens), copy the values from upstream `registry/themes.ts` (neutral theme)
into:

1. the style item's `cssVars` (`registry/default/style/registry.json`), and
2. `packages/web/src/styles.css` (`:root`, `.dark`, and `@theme inline`
   `--color-*` mappings).

Both must stay in sync — the manifest feeds users, styles.css feeds the showcase.

## Known no-op hooks

These tokens are referenced by upstream components but defined by no style;
they exist as extension points there (`cn-tabs-list-variant-{default,line}`,
`cn-progress-root`, `cn-resizable-{panel-group,handle}`,
`cn-marker-variant-default`, `cn-sidebar-trigger`, `cn-calendar-day-button`,
`cn-pagination*` and others — see the header of `cn-tokens.css` for the
authoritative list). nova deliberately leaves them unstyled, and so does
foldcn: `resolve-styles.mjs` strips them from resolved output (render-neutral,
identical to how the pages rendered before) and prints a warning listing any
token it stripped, so genuine sync drift stays loud.

The style item carries only theme setup (`@import`, `@custom-variant dark`,
`@theme inline`, `:root`, `@layer base`, plus the top-level `@utility
no-scrollbar` that resolved sidebar/command classes reference) — matching the
upstream shape where installed components arrive pre-resolved instead of
receiving a token CSS blob in globals.css.
