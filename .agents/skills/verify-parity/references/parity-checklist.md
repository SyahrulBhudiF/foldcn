# Parity Checklist

Check every paired component against these dimensions. Use Verdict values from the skill's data shape.

## 1. Inventory

- Read `packages/registry/registry/default/ui/registry.json` names.
- Read upstream `apps/v4/registry/bases/base/ui/*.tsx` names (or fetched `https://ui.shadcn.com/docs/components` list).
- Normalize renames: `menu` ↔ `dropdown-menu`, `fieldset` ↔ `field`.
- Classify:
  - `foldcnOnly`: exists locally, not upstream (animation, date-picker, drag-and-drop, file-drop, listbox, nav, virtual-list).
  - `upstreamOnly`: exists upstream, not locally (attachment, bubble, carousel, chart, message, message-scroller, native-select is partially covered, pagination, questionnaire, scroll-area — confirm against current docs).
  - `paired`: both sides.

## 2. Token fidelity

- Authored file `packages/registry/registry/default/ui/<name>.ts` contains only `cn-*` tokens in class strings.
- Run `node packages/registry/scripts/resolve-styles.mjs` and check stderr warning list against `docs/deriving-from-base.md` Known no-op hooks.
- Run `pnpm --filter @foldcn/registry run build` — asserts no `cn-*` literal in shipped `dist/r/*.json`.
- For each paired component, compare its `cn-*` class strings character-identical to upstream `bases/base/ui/<name>.tsx` (minus React-isms, foldkit state attr renames handled in resolve).

## 3. Attributes and state

Grep each component for:

| Check | Upstream emits | foldcn should emit | How to verify |
|-------|---------------|-------------------|---------------|
| data-slot | `data-slot="button"` etc. | same | `grep -n "data-slot" packages/registry/registry/default/ui/<name>.ts` vs upstream |
| enter/leave | `data-open:` + `data-closed:` anim | `data-enter:` + `data-leave:` | `resolve-styles.mjs` rewrites ENTER_UTILITIES/EXIT_UTILITIES — verify no raw `data-open:animate-in` in authored source |
| side | `data-side="bottom"` | `data-side` derived from `data-placement` | view emits `data-side` attr |
| disabled | native `disabled` | `aria-disabled` + `data-disabled` twins in `cn-compat.css` | check `cn-compat.css` has twins for the component's token |
| highlighted | `data-highlighted` | `data-active` | class string uses correct prefix |

## 4. Behavior

Cross-check against `docs/shadcn-base-parity-audit.md` Functional gaps:

1. button disabled twins
2. progress indeterminate
3. switch hidden input
4. input-otp onComplete
5. hover-card hover vs click
6. context-menu pointer anchoring
7. menubar traversal
8. command filtering
9. toast/sonner swipe/stack
10. sidebar persistence/tooltip
11. avatar fallback chain
12. inert classes (`peer-disabled:*`, `[cmdk-*]`)

For each: read the component file, confirm FIXED has code evidence or OPEN has issue reference.

## 5. Style system

- `packages/registry/registry/styles/style-*.css` byte-identical to upstream (run `node packages/registry/scripts/sync-styles.mjs --check`).
- `packages/registry/registry/default/style/cn-compat.css` contains only foldkit deltas with reason comments.
- `packages/web/src/styles.css` `@source` lines cover every `styles/<style>/` tree.
