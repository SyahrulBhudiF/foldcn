// User-facing caveats for registry items whose behavior differs from their
// shadcn/ui counterpart. Most of these stem from foldkit primitive ceilings
// (no submenu kinds, no pointer-position anchoring, no hover-intent) that are
// documented in depth in docs/shadcn-base-parity-audit.md; this map surfaces
// the short version on the item pages themselves so adopters learn the limits
// before installing.
//
// Keep entries short and behavioral. If a caveat becomes false — because a
// @foldkit/ui primitive lands or the component gains the behavior — delete the
// entry in the same change that adds the behavior.

export const gapsByItem: Readonly<Record<string, ReadonlyArray<string>>> = {
  command: [
    'Presentational surface only — no filtering, arrow-key navigation, or selection. Compose with listbox or wire your own behavior.',
  ],
  menubar: [
    'Renders independent menus in a bar — no cross-menu keyboard traversal or open-on-hover of the next trigger.',
  ],
  'context-menu': [
    'Opens on activation at a fixed anchor — foldkit has no right-click/pointer-position anchoring primitive yet.',
  ],
  'hover-card': [
    'Toggles like a popover (click/activation), not on hover — foldkit has no hover-intent primitive yet.',
  ],
  sidebar: [
    'No cookie persistence — foldkit owns initial render through its own hydration rather than document.cookie (an SSR flash-prevention mechanism).',
    'Collapsed-mode menu-button tooltips are not auto-composed — wrap menu buttons in Tooltip submodels yourself if you need them.',
  ],
  toast: [
    'No swipe-to-dismiss or stacked scale/peek choreography — auto-dismiss and manual close work as expected.',
  ],
  sonner: [
    'No swipe-to-dismiss or stack expansion — auto-dismiss and manual close work as expected.',
  ],
  drawer: ['Bottom-docked modal with handle visuals — no drag/snap gestures.'],
  resizable: [
    'Two-pane percentage splitter — no min/max constraints, collapsible panes, or N-pane layouts.',
  ],
  'navigation-menu': [
    'Presentational navigation bar — no viewport, indicator, or popup management.',
  ],
  calendar: ['Single-date selection — no ranges or week numbers.'],
  slider: ['Single thumb, horizontal orientation only.'],
  combobox: ['Filtering is owned by your model — no built-in chips UI for multi-select.'],
  'input-group': [
    'Addons do not focus the input on click — foldkit has no scoped click-to-focus primitive yet.',
  ],
  menu: [
    'Flat items only — no submenu, checkbox-item, radio-item, or destructive variants (foldkit menu primitives do not have those kinds yet).',
  ],
  progress: [
    'Indeterminate state renders an empty track — animated indeterminacy awaits primitive support.',
  ],
}
