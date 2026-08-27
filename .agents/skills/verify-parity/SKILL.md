---
name: verify-parity
description: Verify foldcn components match upstream shadcn/ui at https://ui.shadcn.com/docs/components. Use when checking parity, auditing drift, porting a component, or before syncing vendored styles.
---

# Verify Parity

Compare foldcn against upstream shadcn v4 base registry (`bases/base/ui`) on existence, token fidelity, attributes, and behavior.

## Data shape

```
ParityReport = {
  inventory: { foldcnOnly, upstreamOnly, paired },
  tokenFidelity: { leakedTokens, unmappedTokens, driftedClasses },
  attributes: { missingSlots, wrongStateAttr },
  behavior: { functionalGaps }
}
Verdict = MATCHES | MINOR | MAJOR | MISSING | FOLDCN_ONLY
```

Encode findings as this shape, not scattered conditionals. See [checklist](references/parity-checklist.md).

## Workflow

### 1. Source upstream

**Do:**
- Prefer local checkout at `$SHADCN_UI_DIR` or `~/Development/repos/shadcn-ui/ui` → `apps/v4/registry/bases/base/ui` + `apps/v4/registry/styles`.
- Fallback: fetch `https://ui.shadcn.com/docs/components` and component pages, or run `scripts/fetch-upstream.mjs`.
- Record commit SHA if using checkout. See [upstream source](references/upstream-source.md).

**Completion:** upstream component list and `cn-*` token definitions are available.

### 2. Inventory

**Do:**
```bash
node .agents/skills/verify-parity/scripts/verify-parity.mjs --inventory
# or without checkout:
node .agents/skills/verify-parity/scripts/fetch-upstream.mjs && node .agents/skills/verify-parity/scripts/verify-parity.mjs --inventory
```

Compare `packages/registry/registry/default/ui/registry.json` (60 items) against upstream `bases/base/ui` (and `docs/shadcn-base-parity-audit.md` not-covered lists). Classify each as paired, foldcn-only, or upstream-only.

**Completion:** every name accounted for with Verdict.

### 3. Token fidelity

**Do:**
```bash
node packages/registry/scripts/resolve-styles.mjs
pnpm --filter @foldcn/registry run build
```

Checks:
- No `cn-*` literal survives in resolved output (build asserts this).
- Every `cn-*` in authored `registry/default/ui/*.ts` exists in the style map (`cn-compat.css` + vendored `style-nova.css`). Unmapped tokens are intentional no-ops per `docs/deriving-from-base.md` Known no-op hooks — verify warning list matches that doc.
- Resolved classes equal upstream `bases/base/ui` token resolution (byte-identical class strings before resolution, per `docs/deriving-from-base.md`).

**Completion:** zero leaked literals, unmapped list reviewed, class strings diffable against upstream.

### 4. Attributes and state

**Do:** For each paired component, diff:
- `data-slot` coverage (every part stamped, per upstream).
- State attributes per `docs/deriving-from-base.md` mapping table: `data-enter`/`data-leave` vs `data-open`/`data-closed`, `data-side` vs `data-placement`, `aria-disabled`/`data-disabled` twins, `data-active` vs `data-highlighted`.
- See [checklist](references/parity-checklist.md) for exact selectors to grep.

**Completion:** attribute table has no unexplained drift.

### 5. Behavioral gaps

**Do:** Check `docs/shadcn-base-parity-audit.md` Functional gaps (#1–#12) against current code:
- #1 button disabled twins, #2 progress indeterminate, #3 switch hidden input, #4 input-otp onComplete, #5 hover-card hover vs click, #6 context-menu pointer anchoring, #7 menubar traversal, #8 command filtering, #9 toast swipe/stack, #10 sidebar persistence, #11 avatar fallback, #12 inert classes.
- Mark each FIXED or OPEN with file:line evidence.

**Completion:** gap list is current, no fixed gap regressed.

### 6. Report

**Do:** Emit `ParityReport` with verdicts per component (MATCHES/MINOR/MAJOR) matching `docs/shadcn-base-parity-audit.md` Scorecard. Update that file's Status blockquote if fixes landed. Do not edit `packages/registry/registry/styles/style-*.css` (vendored, byte-identical per ADR-015).

**Completion:** report covers inventory, tokens, attributes, behavior with file references.

## Quick verify (CI)

```bash
node .agents/skills/verify-parity/scripts/verify-parity.mjs
```

Exits non-zero on leaked `cn-*`, inventory drift, or stale audit.

## References

- `docs/deriving-from-base.md` — recipe for porting (class strings, data-slot, compat layer).
- `docs/shadcn-base-parity-audit.md` — last full audit, scorecard, and gap list.
- `docs/feature-map.md` — pipeline, style system, and breakage notes.
- `packages/registry/scripts/sync-styles.mjs --check` — vendored CSS drift check.
