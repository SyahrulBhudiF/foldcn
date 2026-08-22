# Contributing to foldcn

Thanks for your interest in contributing! Here's how to get started.

## Prerequisites

- [Node.js](https://nodejs.org/) ≥ 20
- [pnpm](https://pnpm.io/) 11+

## Setup

```bash
git clone git@github.com:elianiva/foldcn.git
cd foldcn
pnpm install
```

## Project structure

```
foldcn/
├── packages/
│   ├── registry/          ← shadcn registry manifests + component sources
│   │   └── registry/default/
│   │       ├── style/     ← base style (CSS vars, deps)
│   │       ├── ui/        ← individual components (.ts)
│   │       ├── lib/       ← utilities (cn, icons)
│   │       └── blocks/    ← composed page sections
│   └── web/               ← showcase site (Foldkit SSG app)
└── alchemy.run.ts         ← Cloudflare deployment
```

## Development workflow

```bash
pnpm dev          # start the showcase site
pnpm typecheck    # typecheck all packages
pnpm test         # run tests
```

## Adding a component

Contributing a component is a **3-touchpoint flow** — the showcase site derives its catalog, source display and demo registration automatically from the registry manifests and demo files. No site code needs to change.

1. **Create the source file** at `packages/registry/registry/default/ui/<name>.ts`. It must be a self-contained module — types, logic, and styled view all in one file. Follow one of the three established patterns:
   - **Stateless helpers** (Button, Input, etc.): export a view function that takes a config object + builder callback.
   - **Stateful submodels** (Dialog, Popover, etc.): re-export `init`, `update`, `view` from `@foldkit/ui` plus a `styledViewInputs` factory.
   - **List-style submodels** (Menu, Listbox, etc.): use the `create<Value>()` bundle pattern.

2. **Register it** in `packages/registry/registry/default/ui/registry.json` with `name`, `type` (`registry:ui`), `title`, `description` and `registryDependencies`. Declare `dependencies` only for packages beyond what the base style already installs (see ADR-006 in CONTEXT.md).

3. **Add a demo view** at `packages/web/src/demo/views/<name>.ts` exporting `<camel>NameView(model, h)` (e.g. `buttonView`). The showcase picks it up automatically for its catalog, source display and demo registration.

Then validate and build:

```bash
pnpm --filter @foldcn/registry validate   # schema gate for the manifests
pnpm --filter @foldcn/registry build      # resolve styles + build + ship
```

> **Never run bare `npx shadcn build`** — it would ship unresolved `cn-*` token classes. Always go through `scripts/build.mjs`, which runs `resolve-styles.mjs` first, then the shadcn build, then swaps in the resolved sources.

## Code conventions

- **Pure Foldkit** — no React. Model/Message/update/View throughout.
- **TypeScript strict** — `noUncheckedIndexedAccess`, no `any`.
- **Single-file modules** — each component is one `.ts` file.
- **`@/` aliases** — imports use `@/lib/utils`, `@/components/ui/*` (rewritten on install).
- **Tailwind CSS** — style via shadcn's CSS variable tokens (`bg-background`, `text-foreground`, etc.).

## Submitting changes

1. Fork the repo and create a feature branch.
2. Make your changes, keeping commits focused.
3. Run `pnpm typecheck && pnpm test` before pushing.
4. Open a PR with a clear description of what changed and why.

## Reporting issues

Open an issue on [GitHub](https://github.com/elianiva/foldcn/issues) with:

- What you expected to happen
- What actually happened
- Steps to reproduce

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
