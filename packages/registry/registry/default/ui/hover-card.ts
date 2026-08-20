import { Popover as FoldkitPopover } from '@foldkit/ui'
import type { AnchorConfig } from '@foldkit/ui/popover'
import type { Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

// Re-export the @foldkit/ui Popover submodel surface. A hover card is a
// Popover variant with card-styled content and no arrow. (The foldkit Popover
// opens on activation rather than pointer-hover, so this mirrors the visual
// surface of shadcn's `hover-card` while reusing the popover trigger.)

export const Model = FoldkitPopover.Model
export type Model = typeof Model.Type

export const Message = FoldkitPopover.Message
export type Message = typeof Message.Type

export const OutMessage = FoldkitPopover.OutMessage
export type OutMessage = typeof OutMessage.Type

export const init = (config: InitConfig): Model => FoldkitPopover.init({ isAnimated: true, ...config })
export const update = FoldkitPopover.update
export const open = FoldkitPopover.open
export const close = FoldkitPopover.close
export const buttonId = FoldkitPopover.buttonId
export const view = FoldkitPopover.view

export type InitConfig = FoldkitPopover.InitConfig
export type RenderInfo = FoldkitPopover.RenderInfo

// --- Class constants ---

export const HOVER_CARD_ANCHOR: AnchorConfig = {
  placement: 'bottom',
  gap: 8,
  padding: 8,
}

export const hoverCardTriggerClass =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 underline-offset-4 hover:underline'

export const hoverCardContentClass =
  'z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2'

export const hoverCardContentAnimatedClass =
  'z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 data-[enter]:animate-in data-[enter]:fade-in-0 data-[enter]:zoom-in-95 data-[leave]:animate-out data-[leave]:fade-out-0 data-[leave]:zoom-out-95'

export const hoverCardBackdropClass = 'fixed inset-0 z-0'

export const hoverCardWrapperClass = 'relative inline-block'

export const hoverCardHeaderClass = 'flex flex-col gap-1'

export const hoverCardTitleClass = 'text-sm font-semibold'

export const hoverCardDescriptionClass = 'text-sm text-muted-foreground'

// --- Composable sub-components ---

type StyleConfig = Readonly<{ className?: string }>

export const header = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.div([h.Class(cn(hoverCardHeaderClass, config.className))], children)

export const title = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.div([h.Class(cn(hoverCardTitleClass, config.className))], children)

export const description = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.p([h.Class(cn(hoverCardDescriptionClass, config.className))], children)

// --- styledViewInputs factory ---

export type StyledViewInputs = Readonly<{
  anchor?: AnchorConfig
  trigger: Child
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
  isAnimated?: boolean
}>

/** Build styled `Popover.ViewInputs` for a hover card. */
export const styledViewInputs = <M>(
  viewInputs: StyledViewInputs,
  h: HtmlBuilder<M>,
): FoldkitPopover.ViewInputs => ({
  anchor: viewInputs.anchor ?? HOVER_CARD_ANCHOR,
  isDisabled: viewInputs.isDisabled,
  focusSelector: viewInputs.focusSelector,
  ariaLabel: viewInputs.ariaLabel,
  ariaLabelledBy: viewInputs.ariaLabelledBy,
  toView: ({ button, panel, backdrop, isVisible }) =>
    h.div(
      [h.Class(cn(hoverCardWrapperClass, viewInputs.wrapperClass)), h.DataAttribute('slot', 'hover-card')],
      [
        h.button(
          [
            ...button,
            h.Class(cn(hoverCardTriggerClass, viewInputs.triggerClass)),
            h.DataAttribute('slot', 'hover-card-trigger'),
          ],
          [viewInputs.trigger],
        ),
        ...(isVisible
          ? [
              h.div([...backdrop, h.Class(cn(hoverCardBackdropClass, viewInputs.backdropClass))]),
              h.div(
                [
                  ...panel,
                  h.Class(
                    cn(
                      viewInputs.isAnimated !== false
                        ? hoverCardContentAnimatedClass
                        : hoverCardContentClass,
                      viewInputs.contentClass,
                    ),
                  ),
                  h.DataAttribute('slot', 'hover-card-content'),
                ],
                viewInputs.content,
              ),
            ]
          : []),
      ],
    ),
})
