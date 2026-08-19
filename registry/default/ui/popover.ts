import { Popover as FoldkitPopover } from "@foldkit/ui"
import type { AnchorConfig } from "@foldkit/ui/popover"
import type { Html, HtmlBuilder } from "foldkit/html"

type Child = Html | string

import { cn } from "@/lib/utils"

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

export const popoverTriggerClass =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

export const popoverContentClass =
  "z-50 w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[closed]:scale-95 data-[closed]:opacity-0 transition duration-200 ease-out"

export const popoverBackdropClass = "fixed inset-0 z-0"

export const popoverWrapperClass = "relative inline-block"

export type PopoverContent<M> = Readonly<{
  button: ReadonlyArray<Child>
  isVisible: boolean
}>

export type StyledViewInputs<M> = Readonly<{
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
  viewInputs: StyledViewInputs<M>,
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
