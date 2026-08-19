import { Popover as FoldkitPopover } from '@foldkit/ui'
import type { AnchorConfig } from '@foldkit/ui/popover'
import type { Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

// Re-export the @foldkit/ui Popover submodel surface.

export const Model = FoldkitPopover.Model
export type Model = typeof Model.Type

export const Message = FoldkitPopover.Message
export type Message = typeof Message.Type

export const OutMessage = FoldkitPopover.OutMessage
export type OutMessage = typeof OutMessage.Type

export const init = FoldkitPopover.init
export const update = FoldkitPopover.update
export const open = FoldkitPopover.open
export const close = FoldkitPopover.close
export const buttonId = FoldkitPopover.buttonId
export const view = FoldkitPopover.view

export type InitConfig = FoldkitPopover.InitConfig
export type RenderInfo = FoldkitPopover.RenderInfo

// --- Class constants ---

export const popoverTriggerClass =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

export const popoverContentClass =
  'z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95'

export const popoverBackdropClass = 'fixed inset-0 z-0'

export const popoverWrapperClass = 'relative inline-block'

export const popoverHeaderClass = 'flex flex-col gap-1 text-sm'

export const popoverTitleClass = 'font-medium'

export const popoverDescriptionClass = 'text-muted-foreground'

// --- Composable sub-components ---
//
// Use inside `styledViewInputs` content arrays:
//
//   content: [
//     Popover.header({}, [
//       Popover.title({}, ['Title'], h),
//       Popover.description({}, ['Subtitle'], h),
//     ], h),
//     h.p([], ['Custom content']),
//   ]

type StyleConfig = Readonly<{ className?: string }>

/** Popover header wrapper. */
export const header = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.div([h.Class(cn(popoverHeaderClass, config.className))], children)

/** Popover title. */
export const title = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.div([h.Class(cn(popoverTitleClass, config.className))], children)

/** Popover description. */
export const description = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.p([h.Class(cn(popoverDescriptionClass, config.className))], children)

// --- styledViewInputs factory ---

export type PopoverContent = Readonly<{
  button: ReadonlyArray<Child>
  isVisible: boolean
}>

export type StyledViewInputs = Readonly<{
  anchor: AnchorConfig
  /** Trigger button label. */
  trigger: Child
  /** Panel content. */
  content: ReadonlyArray<Child>
  isDisabled?: boolean
  focusSelector?: string
  ariaLabel?: string
  ariaLabelledBy?: string
  className?: string
  triggerClass?: string
  contentClass?: string
  backdropClass?: string
  wrapperClass?: string
  /** When true, apply enter/leave transition classes on the panel. */
  isAnimated?: boolean
}>

/** Build styled `Popover.ViewInputs`. Pass your view's `h` so the trigger
 *  and content can dispatch your app's own messages. */
export const styledViewInputs = <M>(
  viewInputs: StyledViewInputs,
  h: HtmlBuilder<M>,
): FoldkitPopover.ViewInputs => ({
  anchor: viewInputs.anchor,
  isDisabled: viewInputs.isDisabled,
  focusSelector: viewInputs.focusSelector,
  ariaLabel: viewInputs.ariaLabel,
  ariaLabelledBy: viewInputs.ariaLabelledBy,
  toView: ({ button, panel, backdrop, isVisible }) =>
    h.div(
      [h.Class(cn(popoverWrapperClass, viewInputs.wrapperClass))],
      [
        h.button(
          [...button, h.Class(cn(popoverTriggerClass, viewInputs.triggerClass))],
          [viewInputs.trigger],
        ),
        ...(isVisible
          ? [
              h.div([...backdrop, h.Class(cn(popoverBackdropClass, viewInputs.backdropClass))]),
              h.div(
                [...panel, h.Class(cn(popoverContentClass, viewInputs.contentClass))],
                viewInputs.content,
              ),
            ]
          : []),
      ],
    ),
})
