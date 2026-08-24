# foldcn — Domain Model

## What

A **shadcn-style component registry** for the Foldkit ecosystem. Users install copy-paste component source code via the `shadcn` CLI, styled with Tailwind CSS, built on `@foldkit/ui` (headless, Elm-architecture components using Effect-TS).

## Glossary

| Term               | Definition                                                                                                                                               |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **registry**       | A collection of JSON manifests describing distributable code items (components, styles, utilities, blocks). Served via static JSON or a hosted endpoint. |
| **registry item**  | A single distributable unit (e.g., `button`, `dialog`, `login-form`). Defined by a `registry-item.json` with files, deps, CSS vars.                      |
| **registry:style** | A base style item that installs CSS variables, core dependencies, and theme tokens. The foundation users install first.                                  |
| **registry:ui**    | A UI component item. Single file, self-contained module with types + logic + styled view.                                                                |
| **registry:block** | A composed, multi-file item that combines multiple registry:ui components into a ready-to-use page or section.                                           |
| **registry:lib**   | A utility library item (e.g., `cn()` class merger).                                                                                                      |
| **submodel**       | A Foldkit UI stateful component pattern: Model + Message + update + OutMessage + view. Wired via `h.submodel`.                                           |
| **helper**         | A Foldkit UI stateless component pattern: called directly with ViewConfig + builder callback, returns Html. No Model/Message.                            |
| **namespace**      | A registry identifier prefixed with `@` (e.g., `@foldcn`). Users configure it in `components.json` to install items by name.                             |
| **base trio**      | The three core peer dependencies every foldcn component assumes: `foldkit`, `effect`, `@foldkit/ui`. Installed by the base style.                        |

## Architecture Decisions

### ADR-001: Full design system, not just themes

foldcn provides a complete design system: a base `registry:style` (CSS vars, core deps, base CSS) PLUS individual `registry:ui` items for every @foldkit/ui component. Not just color tokens.

### ADR-002: Pure Foldkit, no React

Target audience: Foldkit projects using `foldkit` + `effect` + `@foldkit/ui`. No React component variants. Registry items assume the Elm architecture pattern (Model/Message/update/View).

### ADR-003: Hosted registry with `@foldcn` namespace

Users configure `components.json` with `"@foldcn": "https://foldcn.elianiva.com/r/{name}.json"` and install via `shadcn add @foldcn/button`. Hosted on static hosting (Cloudflare Pages / Vercel / GitHub Pages) — built with `shadcn build`, zero server logic.

### ADR-004: Self-contained component modules

Each `registry:ui` item is a single `.ts` file containing everything: Model type, Message type, update function, and styled view function. Users copy the file and it works — no manual wiring of types. For stateless helpers (Button, Input, etc.), the file exports a view function. For stateful submodels (Dialog, Menu, etc.), the file exports Model/Message/OutMessage/init/update/view wired via `h.submodel` — either re-exported from a backing @foldkit/ui submodel or, when no such primitive exists (toggle, toggle-group, accordion, collapsible, resizable), authored in the file itself following the same conventions.

### ADR-005: Tailwind CSS with shadcn's token vocabulary

Base style mirrors shadcn's full CSS variable set: `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `ring`, `card`, `popover`, `sidebar-*`, etc. Uses `oklch()` color values. Users customize by editing CSS vars — same mental model as shadcn.

### ADR-006: Dependency strategy

Base `registry:style` installs the "base trio" (`foldkit`, `effect`, `@foldkit/ui`) plus `tailwind-merge`, `clsx`, `tw-animate-css`. Individual `registry:ui` items only declare extra deps they need beyond the base (e.g., `lucide` for icons). Avoids version conflicts and redundant installs.

### ADR-007: `lucide` for icons, wrapped with `h.`

Uses vanilla `lucide` (not `lucide-react`). SVGs are wrapped via Foldkit's `h.svg` / `h.path` functions. Components that include icons (Select chevron, etc.) import from `lucide` and render via `h.`.

### ADR-008: Animations — dual approach

Base style includes `tw-animate-css` for Tailwind animation classes. Components that need enter/leave transitions use Foldkit's `Animation` submodel to trigger those CSS animations. CSS defines keyframes, Foldkit triggers them.

### ADR-009: 2-3 showcase blocks

Registry includes composed blocks: `login-form`, `settings-page`, `data-table`. Multi-file `registry:block` items that demonstrate component composition. Serve as copy-paste starters and documentation.

### ADR-010: `components.json` template

Ship a recommended `components.json` for Foldkit projects with `@foldcn` namespace pre-configured and aliases (`@ui`, `@lib`, `@hooks`) pointing to standard directories. Uses `style: "default"` (the only schema-valid value) and `tsx: true` so source files install as `.ts`.

### ADR-011: Styled view factories

Stateful submodels (Dialog, Popover, Tooltip, Tabs, RadioGroup, Slider, Calendar, DatePicker, FileDrop) ship their `@foldkit/ui` `view` re-exported plus a `styledViewInputs` factory: `X.styledViewInputs({...}, h)` returns the styled `ViewInputs`. The caller passes their own `h` so content callbacks can dispatch parent messages (the `toView` callbacks of these components receive no `h`). List-style submodels (Menu, Listbox, Combobox, Tabs, RadioGroup) use the `create<Value>()` bundle pattern from `@foldkit/ui` and a `viewInputs` factory that fills in the styled class names.

### ADR-012: `card` primitive

`card` is a pure layout component (no `@foldkit/ui` backing) shipped as `registry:ui` with styled class constants — used by the blocks.

### ADR-013: Registry items are `.ts`, source is the build input

The registry repo's source files live under `registry/default/` and are the input to the build pipeline (`scripts/build.mjs`: resolve-styles → shadcn build → token swap), which emits the flattened catalog + per-item JSON into `packages/registry/dist/r/` — the deploy copies it into the web assets. Imports use `@/` aliases (`@/lib/utils`, `@/components/ui/*`) so the CLI rewrites them per the user's `components.json` on install.

### ADR-014: Derive from the shadcn v4 BASE registry via a `cn-*` token layer

foldcn components are derivations of `shadcn-ui/ui` `apps/v4/registry/bases/base/ui/*.tsx` (Base UI registry, `nova` style) — not the legacy inline-class registry they were originally seeded from. Authored component files emit only `cn-*` utility-token classes, kept character-identical to upstream so class strings stay diffable. The token definitions are vendored verbatim from upstream (`registry/styles/style-*.css`, see ADR-015), merged with hand-written foldkit deltas (`style/cn-compat.css`). Matching shadcn's own pipeline, `scripts/resolve-styles.mjs` substitutes every token occurrence with its resolved Tailwind classes into the gitignored `styles/default/{ui,lib,blocks}` tree — that tree is what the web demo renders and what `shadcn build` ships, so neither demos nor installs need the token CSS loaded (the style item carries only theme setup). foldkit state-attribute differences (enter/leave animation windows, aria-disabled instead of native disabled, placement vs side) are resolved in the compat layer, by emitting derived attributes in the view, or by rewriting animation-state hooks in the resolve step — never by editing copied class strings or vendored CSS. Recipe: `docs/deriving-from-base.md`.

### ADR-015: Vendor shadcn's per-style token CSS verbatim

The shadcn token layers (`apps/v4/registry/styles/style-*.css`, one file per style) are vendored **byte-identical** into `packages/registry/registry/styles/` and credited to shadcn (MIT). We deliberately do NOT build runtime compatibility against the live shadcn registry: vendored copies keep foldcn self-contained and make syncing a dumb copy (`scripts/sync-styles.mjs`, run periodically against a local checkout; provenance commit + date recorded in `registry/styles/README.md`). Byte-identity is the contract: no headers, no reformatting, no foldkit rewrites inside these files — drift against a fresh checkout is always reviewable with plain `diff`. The foldkit animation-state rewrite (`data-open:`/`data-closed:` → `data-enter:`/`data-leave:`) therefore happens at resolve time in `resolve-styles.mjs`, not in the artifact.

`style-nova.css` is wired as foldcn's default style today. The other seven styles (vega, maia, lyra, mira, luma, sera, rhea) ship as inert data so a future opt-in style needs no new sourcing step — only pipeline wiring (resolved tree + registry item), which is intentionally deferred until there is a product reason.

## Component Inventory

All 60 `registry:ui` items from `packages/registry/registry/default/ui/registry.json`, organized by pattern — plus the lib utilities, base style and blocks.

### Stateless helpers (registry:ui)

| Component   | Description                                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------------- |
| button      | Styled button with variants and sizes, built on the @foldkit/ui Button helper.                             |
| input       | Styled text input with label and description, built on the @foldkit/ui Input helper.                       |
| textarea    | Styled multi-line textarea with label and description, built on the @foldkit/ui Textarea helper.           |
| select      | Styled native select with label, chevron and description, built on the @foldkit/ui Select helper.          |
| card        | Composable card primitives (Card…CardFooter). A pure layout primitive.                                     |
| checkbox    | Styled checkbox with label, indeterminate state and description, built on the @foldkit/ui Checkbox helper. |
| switch      | Styled switch toggle with label and description, built on the @foldkit/ui Switch helper.                   |
| fieldset    | Styled fieldset with legend and description, built on the @foldkit/ui Fieldset helper.                     |
| nav         | Styled navigation landmark with current-page marking, built on the @foldkit/ui Nav helper.                 |

### Stateful submodels (registry:ui)

| Component     | Description                                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| dialog        | Composable modal dialog (header/title/description/footer/closeButton), built on the @foldkit/ui Dialog submodel. |
| popover       | Composable floating panel (header/title/description), built on the @foldkit/ui Popover submodel.                 |
| tooltip       | Styled tooltip with trigger and hover/focus reveal, built on the @foldkit/ui Tooltip submodel.                   |
| menu          | Styled dropdown menu with keyboard navigation and typeahead, built on the @foldkit/ui Menu submodel.             |
| listbox       | Styled custom select with single and multi selection, built on the @foldkit/ui Listbox submodel.                 |
| combobox      | Styled autocomplete input with filtering, built on the @foldkit/ui Combobox submodel.                            |
| tabs          | Composable tabbed interface (list/trigger/content), built on the @foldkit/ui Tabs submodel.                      |
| radio-group   | Styled radio options with roving tabindex, built on the @foldkit/ui RadioGroup submodel.                         |
| slider        | Styled numeric range slider, built on the @foldkit/ui Slider submodel.                                           |
| calendar      | Styled inline calendar grid with locale support, built on the @foldkit/ui Calendar submodel.                     |
| date-picker   | Styled date picker combining trigger, popover and calendar, built on the @foldkit/ui DatePicker submodel.        |
| toast         | Styled transient notification stack with auto-dismiss, built on the @foldkit/ui Toast component.                 |
| animation     | Styled enter/leave animation coordinator, built on the @foldkit/ui Animation submodel.                           |
| drag-and-drop | Styled sortable lists and cross-container movement, built on the @foldkit/ui DragAndDrop submodel.               |
| file-drop     | Styled file input with drag-and-drop support, built on the @foldkit/ui FileDrop submodel.                        |
| virtual-list  | Styled virtualized list for large datasets, built on the @foldkit/ui VirtualList submodel.                       |
| collapsible   | Stateful single-section collapsible panel, built on the @foldkit/ui Disclosure helper.                           |
| accordion     | Vertical stack of collapsible sections with single or multi-open semantics, built on the @foldkit/ui Disclosure helper. |
| toggle        | Stateful two-state toggle button marked with aria-pressed and data-state.                                        |
| toggle-group  | Stateful group of toggles with shared single or multiple selection.                                              |
| resizable     | Stateful two-pane split with a draggable, keyboard-accessible handle.                                            |

### Presentational ports (registry:ui)

Pure-layout ports of shadcn's presentational components — no submodel backing (no Model/Message/init/update).

| Component       | Description                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------- |
| badge           | Styled inline badge with variant support, built as a themed span.                                           |
| skeleton        | Styled pulsing placeholder block.                                                                           |
| separator       | Styled divider with horizontal/vertical orientation.                                                        |
| kbd             | Styled keyboard key(s) with grouping support.                                                               |
| avatar          | Styled avatar with image, fallback, badge and grouping.                                                     |
| aspect-ratio    | Styled aspect-ratio box wrapper.                                                                            |
| alert           | Styled alert with title and description sub-builders.                                                       |
| empty           | Styled empty state with header, media, title, description and content.                                      |
| spinner         | Styled loading spinner (Loader2 icon in a status wrapper).                                                  |
| marker          | Styled marker with icon and content sub-builders and variant support.                                       |
| item            | Styled flexible list row with media, title, description, actions, header and footer.                        |
| direction       | Text-direction wrapper (ltr/rtl) carrying a data-slot surface.                                              |
| label           | Styled form label with optional for association.                                                            |
| progress        | Styled progress bar with value-driven indicator.                                                            |
| alert-dialog    | Destructive-confirm modal dialog, built on the @foldkit/ui Dialog submodel.                                 |
| sheet           | Edge-anchored modal panel (top/bottom/left/right), built on the @foldkit/ui Dialog submodel.                |
| drawer          | Bottom-docked modal with grab handle, built on the @foldkit/ui Dialog submodel.                             |
| hover-card      | Card-styled floating panel, built on the @foldkit/ui Popover submodel.                                      |
| context-menu    | Right-click style menu, built on the @foldkit/ui Menu submodel.                                             |
| menubar         | Horizontal bar of menus, built on the @foldkit/ui Menu submodel.                                            |
| sonner          | Stacked auto-dismissing notifications, built on the @foldkit/ui Toast submodel.                             |
| button-group    | Connected run of buttons forming a single segmented control, built on the @foldkit/ui Button helper.        |
| input-group     | Shared bordered box with text/icon add-ons around a connected input, built on the @foldkit/ui Input helper. |
| input-otp       | Row of single-character slots backed by one combined value.                                                 |
| breadcrumb      | Presentational breadcrumb landmark with list, link, page and separator builders.                            |
| navigation-menu | Presentational top-level navigation bar with trigger and content builders.                                  |
| sidebar         | Presentational sidebar layout — provider, rail, menu, group and inset builders.                             |
| table           | Presentational table with header, body, footer, row, head, cell and caption builders.                       |
| command         | Presentational command-palette surface with input, list, group and item builders.                           |

### Utilities (registry:lib)

| Item       | Description                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------- |
| utils      | Class name merger built on clsx and tailwind-merge (`cn`). Used by every foldcn component.      |
| icons      | Lucide icons rendered as Foldkit virtual DOM via the h builder, plus commonly used icons.       |
| code-block | Syntax-highlighted code block with file header and copy button, powered by @tanstack/highlight. |

### Base (registry:style)

| Item   | Description                                                                                               |
| ------ | --------------------------------------------------------------------------------------------------------- |
| foldcn | Base style: CSS variables, Tailwind v4 theme mapping, base CSS and core dependencies. Install this first. |

### Blocks (registry:block)

| Item          | Description                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| login-form    | Login page with email/password fields, error state and submit button. Composed from foldcn primitives. |
| settings-page | Settings page with profile and preferences sections. Composed from foldcn primitives.                  |
| data-table    | Searchable table with styled rows and cells. Composed from foldcn primitives.                          |

## File Structure

```
packages/registry/
├── registry.json                          ← root catalog manifest (includes default/{style,lib,ui,blocks})
├── components.json                        ← recommended components.json template
├── scripts/
│   ├── build.mjs                          ← pipeline: resolve-styles → shadcn build → token swap (→ dist/r/)
│   ├── resolve-styles.mjs                 ← substitutes cn-* tokens into the resolved trees
│   ├── sync-styles.mjs                    ← periodic vendored style sync from shadcn-ui/ui
│   └── lib/                               ← shared script helpers
├── registry/
│   ├── styles/                           ← VENDORED shadcn style-*.css, byte-identical (ADR-015)
│   │   ├── README.md                     ← credit + sync provenance (regenerated)
│   │   └── style-{nova,...}.css          ← synced from shadcn-ui/ui (sync-styles.mjs)
│   └── default/
│       ├── style/
│       │   ├── registry.json             ← registry:style base item (cssVars + base css)
│       │   └── cn-compat.css             ← hand-written foldkit deltas
│       ├── ui/
│       │   ├── registry.json             ← ui manifest (60 entries)
│       │   ├── button.ts                 ← registry:ui — one self-contained .ts per item
│       │   ├── input.ts                     (button … resizable: helpers, submodels,
│       │   └── resizable.ts                  presentational ports)
│       ├── lib/
│       │   ├── registry.json             ← lib manifest (3 entries)
│       │   ├── utils.ts                  ← cn() class merger (registry:lib)
│       │   ├── icons.ts                  ← h.-wrapped lucide SVGs (registry:lib)
│       │   └── code-block.ts             ← syntax-highlighted code block (registry:lib)
│       └── blocks/
│           ├── registry.json             ← blocks manifest (3 entries)
│           ├── login-form/
│           │   ├── login-form.json       ← registry:block manifest
│           │   └── login-form.ts         ← component source
│           ├── settings-page/
│           └── data-table/
├── styles/default/                       ← RESOLVED trees (gitignored), output of resolve-styles.mjs
│   ├── ui/                                  consumed by the web demo + swapped into shipped JSONs
│   ├── lib/
│   └── blocks/
└── dist/r/                               ← build output: flattened catalog + per-item JSONs (served by the deploy)
```

## User Installation Flow

1. User adds namespace to `components.json`:
   ```json
   { "registries": { "@foldcn": "https://foldcn.elianiva.com/r/{name}.json" } }
   ```
2. User installs base style:
   ```bash
   shadcn add @foldcn/foldcn
   ```
   → Installs `foldkit`, `effect`, `@foldkit/ui`, `clsx`, `tailwind-merge`, `tw-animate-css`, CSS vars, base CSS
3. User installs components as needed:
   ```bash
   shadcn add @foldcn/button @foldcn/input @foldcn/dialog
   ```
   → Copies self-contained `.ts` files into `components/ui/`
4. User imports and uses in their Foldkit app:
   ```ts
   import { button } from '@/components/ui/button'
   import { Dialog } from '@/components/ui/dialog'

   // In view:
   button(SubmitForm, 'Submit')

   // In submodel:
   h.submodel(Dialog.init, Dialog.update, Dialog.view(model))
   ```
