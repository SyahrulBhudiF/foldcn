import { Tooltip as FoldkitTooltip } from '@foldkit/ui'
import type { AnchorConfig } from '@foldkit/ui/tooltip'
import type { Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

// Re-export the @foldkit/ui Tooltip submodel surface.

export const Model = FoldkitTooltip.Model
export type Model = typeof Model.Type

export const Message = FoldkitTooltip.Message
export type Message = typeof Message.Type

export const OutMessage = FoldkitTooltip.OutMessage
export type OutMessage = typeof OutMessage.Type

export const init = FoldkitTooltip.init
export const update = FoldkitTooltip.update
export const triggerId = FoldkitTooltip.triggerId
export const view = FoldkitTooltip.view

export type InitConfig = FoldkitTooltip.InitConfig
export type RenderInfo = FoldkitTooltip.RenderInfo

export const tooltipTriggerClass =
  'inline-flex items-center justify-center rounded-md text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

export const tooltipContentClass =
  'z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'

export const tooltipArrowClass =
  'z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground'

export const tooltipWrapperClass = 'relative inline-block'

export type StyledViewInputs = Readonly<{
  anchor: AnchorConfig
  /** Trigger element content. */
  trigger: Child
  /** Tooltip text. */
  content: Child
  className?: string
  triggerClass?: string
  contentClass?: string
  wrapperClass?: string
}>

/** Build styled `Tooltip.ViewInputs`. Pass your view's `h`. */
export const styledViewInputs = <M>(
  viewInputs: StyledViewInputs,
  h: HtmlBuilder<M>,
): FoldkitTooltip.ViewInputs => ({
  anchor: viewInputs.anchor,
  toView: ({ trigger, panel, isVisible }) =>
    h.div(
      [h.Class(cn(tooltipWrapperClass, viewInputs.wrapperClass))],
      [
        h.button(
          [...trigger, h.Class(cn(tooltipTriggerClass, viewInputs.triggerClass))],
          [viewInputs.trigger],
        ),
        ...(isVisible
          ? [
              h.div(
                [...panel, h.Class(cn(tooltipContentClass, viewInputs.contentClass))],
                [viewInputs.content],
              ),
            ]
          : []),
      ],
    ),
})
