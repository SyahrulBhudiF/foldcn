import { Dialog as FoldkitDialog } from '@foldkit/ui'
import type { Attribute, ChildAttribute, Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

// Re-export the @foldkit/ui Dialog submodel surface. A drawer is a Dialog
// variant docked to the bottom of the viewport with a grab handle, mirroring
// the shadcn `drawer` (vaul-style) surface using the native dialog.

export const Model = FoldkitDialog.Model
export type Model = typeof Model.Type

export const Message = FoldkitDialog.Message
export type Message = typeof Message.Type

export const OutMessage = FoldkitDialog.OutMessage
export type OutMessage = typeof OutMessage.Type

export const init = (config: InitConfig): Model =>
  FoldkitDialog.init({ isAnimated: true, ...config })
export const update = FoldkitDialog.update
export const open = FoldkitDialog.open
export const close = FoldkitDialog.close
export const titleId = FoldkitDialog.titleId
export const descriptionId = FoldkitDialog.descriptionId
export const view = FoldkitDialog.view

export type InitConfig = FoldkitDialog.InitConfig
export type RenderInfo = FoldkitDialog.RenderInfo

// --- Class constants ---
//
// Derived from the shadcn v4 BASE registry:
// apps/v4/registry/bases/base/ui/drawer.tsx. Class strings are identical to
// upstream; visual styling lives in the central foldcn style definition.
//
// foldcn gaps vs upstream: Base UI's Drawer is a gesture drawer (drag to
// dismiss, snap points, nested stacks, swipe-progress-driven overlay
// opacity). foldkit has no drag primitive, so this keeps the static
// show/hide dialog mechanics and applies the popup/content/handle tokens;
// motion is the dialog enter/leave fade+zoom. The panel emits
// data-swipe-direction="down" / data-swipe-axis="y" statically so the
// token's bottom-edge radius/border variants AND the upstream
// positioning/bleed utilities resolve. Upstream lines that key purely on
// drag/nested state (--translate-y movement, stack vars beyond --bleed,
// data-swiping/data-nested-*/data-snap-points) stay dropped.
//
// foldkit delta for the enter/exit motion: upstream keys the slide on
// data-starting-style:transform-(--closed-transform) /
// data-ending-style:transform-(--closed-transform); per the overlay note
// above, [data-enter][data-closed] / [data-leave][data-closed] are the
// faithful one-frame equivalents, so the panel slides up from (and back down
// to) --closed-transform via its own transform transition — no keyframes, no
// scale.

export const drawerClass = 'bg-transparent p-0 open:block'

/** Upstream overlay minus swipe-progress opacity (needs drag state).
 *
 *  foldkit delta: upstream keys the fade on data-starting-style:opacity-0 /
 *  data-ending-style:opacity-0, which exist for one frame around the
 *  transition. foldkit instead holds `data-enter`/`data-leave` on the backdrop
 *  for the WHOLE transition window (until the panel's own animation settles),
 *  so keying the hidden state on the bare attribute delays the overlay fade
 *  until after the popup has entered. The engine emits `data-closed` only on
 *  the first frame of each window (EnterStart / LeaveAnimating — see
 *  @foldkit/ui dist/dialog + dist/animation), making
 *  [data-enter][data-closed] / [data-leave][data-closed] faithful
 *  starting-style/ending-style equivalents: the opacity transition kicks off
 *  on the second frame, concurrent with the popup motion, exactly like
 *  upstream. */
export const drawerBackdropClass =
  'cn-drawer-overlay fixed inset-0 z-50 transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] select-none data-enter:data-closed:opacity-0 data-leave:data-closed:opacity-0'

/** Upstream DrawerPrimitive.Popup string minus drag/nested-state lines
 *  (see the foldcn gaps note above). Positioning, bleed and sizing resolve
 *  via the statically-emitted swipe attributes. Enter/exit is upstream's
 *  closed-transform slide re-keyed onto the one-frame data-closed windows. */
export const drawerPanelClass =
  'cn-drawer-popup group/drawer-popup pointer-events-auto fixed z-50 m-(--drawer-inset,0px) flex h-(--drawer-content-height) max-h-(--drawer-content-max-height,none) min-h-0 w-(--drawer-content-width,auto) transform-[translate3d(var(--translate-x,0px),var(--translate-y,0px),0)_scale(var(--stack-scale))] flex-col transition-[transform,height,opacity,filter] duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform outline-none select-none [interpolate-size:allow-keywords] after:pointer-events-none after:absolute after:bg-(--drawer-bleed-background,var(--color-popover)) data-[swipe-axis=y]:after:inset-x-0 data-[swipe-axis=y]:after:h-(--bleed) data-[swipe-direction=down]:after:top-full [--drawer-content-height:var(--drawer-height,auto)] [--drawer-content-max-height:calc(100dvh-6rem)] [--bleed:3rem] data-[swipe-axis=y]:inset-x-0 data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:origin-bottom data-[swipe-direction=down]:[--closed-transform:translate3d(0,calc(100%+var(--drawer-inset,0px)+2px),0)] data-enter:data-closed:transform-(--closed-transform) data-leave:data-closed:transform-(--closed-transform)'

/** Upstream DrawerContent string. */
export const drawerContentClass =
  'cn-drawer-content-base flex min-h-0 flex-1 flex-col overflow-hidden overscroll-contain rounded-[inherit] transition-opacity duration-300 ease-[cubic-bezier(0.45,1.005,0,1.005)] select-text'

/** Upstream DrawerSwipeHandle string. */
export const drawerHandleClass =
  'cn-drawer-swipe-handle relative z-10 flex shrink-0 cursor-grab transition-opacity duration-200 active:cursor-grabbing'

export const drawerHeaderClass =
  'cn-drawer-header-base flex shrink-0 flex-col group-data-[swipe-axis=y]/drawer-popup:text-center'

export const drawerTitleClass = 'cn-drawer-title cn-font-heading'

export const drawerDescriptionClass = 'cn-drawer-description text-balance'

export const drawerFooterClass = 'cn-drawer-footer-base mt-auto flex shrink-0 flex-col'

/** Upstream DrawerClose is an unstyled passthrough; every base example
 *  styles it as `<Button variant="outline">`. */
export const drawerCloseButtonClass = 'cn-button cn-button-variant-outline cn-button-size-default'

// --- Composable sub-components ---

type StyleConfig = Readonly<{ className?: string }>

/** Grab handle (upstream DrawerSwipeHandle; aria-hidden). */
export const handle = <M>(config: StyleConfig, h: HtmlBuilder<M>): Html =>
  h.div(
    [
      h.AriaHidden(true),
      h.DataAttribute('slot', 'drawer-swipe-handle'),
      h.Class(cn(drawerHandleClass, config.className)),
    ],
    [],
  )

export const header = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [h.DataAttribute('slot', 'drawer-header'), h.Class(cn(drawerHeaderClass, config.className))],
    children,
  )

export const title = <M>(
  attributes: ReadonlyArray<Attribute<M> | ChildAttribute>,
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.h2(
    [
      ...attributes,
      h.DataAttribute('slot', 'drawer-title'),
      h.Class(cn(drawerTitleClass, config.className)),
    ],
    children,
  )

export const description = <M>(
  attributes: ReadonlyArray<Attribute<M> | ChildAttribute>,
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.p(
    [
      ...attributes,
      h.DataAttribute('slot', 'drawer-description'),
      h.Class(cn(drawerDescriptionClass, config.className)),
    ],
    children,
  )

export const footer = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [h.DataAttribute('slot', 'drawer-footer'), h.Class(cn(drawerFooterClass, config.className))],
    children,
  )

export const closeButton = <M>(
  attributes: ReadonlyArray<Attribute<M> | ChildAttribute>,
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.button(
    [
      ...attributes,
      h.DataAttribute('slot', 'drawer-close'),
      h.Class(cn(drawerCloseButtonClass, config.className)),
    ],
    children,
  )

// --- styledViewInputs factory ---

export type DrawerContent<M> = Readonly<{
  closeButton: ReadonlyArray<Attribute<M> | ChildAttribute>
  title: ReadonlyArray<Attribute<M> | ChildAttribute>
  description: ReadonlyArray<Attribute<M> | ChildAttribute>
}>

export type StyledViewInputs<M> = Readonly<{
  content: (render: DrawerContent<M>, h: HtmlBuilder<M>) => ReadonlyArray<Child>
  className?: string
  backdropClass?: string
  panelClass?: string
  /** When true, render a grab handle above the content. */
  isHandleVisible?: boolean
}>

/** Build styled `Dialog.ViewInputs` for a bottom drawer. */
export const styledViewInputs = <M>(
  viewInputs: StyledViewInputs<M>,
  h: HtmlBuilder<M>,
): FoldkitDialog.ViewInputs => ({
  toView: ({ dialog, backdrop, panel, closeButton, title, description, isVisible }) =>
    h.dialog(
      [
        ...dialog,
        h.DataAttribute('slot', 'drawer'),
        h.Class(cn(drawerClass, viewInputs.className)),
      ],
      isVisible
        ? [
            h.div([
              ...backdrop,
              h.DataAttribute('slot', 'drawer-overlay'),
              h.Class(cn(drawerBackdropClass, viewInputs.backdropClass)),
            ]),
            h.div(
              [
                ...panel,
                h.DataAttribute('slot', 'drawer-popup'),
                // Static declaration: this sheet dismisses downward (keys the
                // cn-drawer-popup radius/border variants).
                h.DataAttribute('swipe-direction', 'down'),
                h.DataAttribute('swipe-axis', 'y'),
                h.Class(cn(drawerPanelClass, viewInputs.panelClass)),
              ],
              [
                viewInputs.isHandleVisible === true ? handle({}, h) : h.empty,
                h.div(
                  [h.DataAttribute('slot', 'drawer-content'), h.Class(drawerContentClass)],
                  viewInputs.content({ closeButton, title, description }, h),
                ),
              ],
            ),
          ]
        : [],
    ),
})
