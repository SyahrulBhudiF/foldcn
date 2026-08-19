import { Tooltip as FoldkitTooltip } from "@foldkit/ui"
import type { AnchorConfig } from "@foldkit/ui/tooltip"
import type { Html, HtmlBuilder } from "foldkit/html"

type Child = Html | string

import { cn } from "@/lib/utils"

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
  "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

export const tooltipContentClass =
  "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md data-[closed]:opacity-0 transition duration-200 ease-out"

export const tooltipWrapperClass = "relative inline-block"

export type StyledViewInputs<M> = Readonly<{
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
  viewInputs: StyledViewInputs<M>,
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
