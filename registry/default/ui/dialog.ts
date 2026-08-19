import { Dialog as FoldkitDialog } from "@foldkit/ui"
import type { Attribute, ChildAttribute, Html, HtmlBuilder } from "foldkit/html"

type Child = Html | string

import { cn } from "@/lib/utils"

// Re-export the @foldkit/ui Dialog submodel surface so a foldcn Dialog is a
// drop-in for wiring `h.submodel`.

export const Model = FoldkitDialog.Model
export type Model = typeof Model.Type

export const Message = FoldkitDialog.Message
export type Message = typeof Message.Type

export const OutMessage = FoldkitDialog.OutMessage
export type OutMessage = typeof OutMessage.Type

export const init = FoldkitDialog.init
export const update = FoldkitDialog.update
export const open = FoldkitDialog.open
export const close = FoldkitDialog.close
export const titleId = FoldkitDialog.titleId
export const descriptionId = FoldkitDialog.descriptionId
export const view = FoldkitDialog.view

export type InitConfig = FoldkitDialog.InitConfig
export type RenderInfo = FoldkitDialog.RenderInfo

export const dialogClass =
  "bg-transparent p-0 open:flex items-center justify-center"

export const dialogBackdropClass = "fixed inset-0 z-50 bg-black/50"

export const dialogPanelClass =
  "relative z-50 grid w-full max-w-lg gap-4 border border-border bg-background p-6 shadow-lg sm:rounded-lg"

export const dialogTitleClass = "text-lg font-semibold leading-none tracking-tight"

export const dialogDescriptionClass = "text-sm text-muted-foreground"

export const dialogCloseButtonClass =
  "absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[closed]:opacity-0"

export const dialogHeaderClass = "flex flex-col space-y-1.5 text-center sm:text-left"

export const dialogFooterClass =
  "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"

export type DialogContent<M> = Readonly<{
  closeButton: ReadonlyArray<Attribute<M> | ChildAttribute>
  title: ReadonlyArray<Attribute<M> | ChildAttribute>
  description: ReadonlyArray<Attribute<M> | ChildAttribute>
}>

export type StyledViewInputs<M> = Readonly<{
  /** Panel content. Receives the close-button, title and description
   *  attribute bundles to spread onto your own elements. */
  content: (render: DialogContent<M>, h: HtmlBuilder<M>) => ReadonlyArray<Child>
  className?: string
  backdropClass?: string
  panelClass?: string
}>

/** Build styled `Dialog.ViewInputs`. Pass your view's `h` so the content
 *  callback can dispatch your app's own messages (e.g. a destructive
 *  action button next to the dialog's `closeButton`). */
export const styledViewInputs = <M>(
  viewInputs: StyledViewInputs<M>,
  h: HtmlBuilder<M>,
): FoldkitDialog.ViewInputs => ({
  toView: ({ dialog, backdrop, panel, closeButton, title, description, isVisible }) =>
    h.dialog(
      [...dialog, h.Class(cn(dialogClass, viewInputs.className))],
      isVisible
        ? [
            h.div([...backdrop, h.Class(cn(dialogBackdropClass, viewInputs.backdropClass))]),
            h.div(
              [...panel, h.Class(cn(dialogPanelClass, viewInputs.panelClass))],
              viewInputs.content({ closeButton, title, description }, h),
            ),
          ]
        : [],
    ),
})
