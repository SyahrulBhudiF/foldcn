import { DragAndDrop as FoldkitDragAndDrop } from "@foldkit/ui"

// Re-export the @foldkit/ui DragAndDrop surface. Drag and drop is heavily
// consumer-driven: you own the item/container data model, and this module
// provides the styled hooks (`draggable`, `sortable`, `droppable`) plus the
// helpers for reading drag state. See the ui-showcase example for the full
// wiring pattern.

export const init = FoldkitDragAndDrop.init
export const update = FoldkitDragAndDrop.update
export const draggable = FoldkitDragAndDrop.draggable
export const droppable = FoldkitDragAndDrop.droppable
export const sortable = FoldkitDragAndDrop.sortable
export const ghostStyle = FoldkitDragAndDrop.ghostStyle
export const isDragging = FoldkitDragAndDrop.isDragging
export const maybeDraggedItemId = FoldkitDragAndDrop.maybeDraggedItemId
export const maybeDropTarget = FoldkitDragAndDrop.maybeDropTarget
export const subscriptions = FoldkitDragAndDrop.subscriptions
export const Model = FoldkitDragAndDrop.Model
export type Model = typeof Model.Type
export const Message = FoldkitDragAndDrop.Message
export type Message = typeof Message.Type
export const OutMessage = FoldkitDragAndDrop.OutMessage
export type OutMessage = typeof OutMessage.Type

export type InitConfig = FoldkitDragAndDrop.InitConfig
export type DraggableConfig<M> = FoldkitDragAndDrop.DraggableConfig<M>
export type DraggableMessage = FoldkitDragAndDrop.DraggableMessage

export const dragCardClass =
  "cursor-grab rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground shadow-sm transition-opacity select-none active:cursor-grabbing data-[dragging]:opacity-40 data-[keyboard-dragging]:ring-2 data-[keyboard-dragging]:ring-ring"

export const dragDropPlaceholderClass =
  "h-9 rounded-lg border-2 border-dashed border-primary/50"

export const dragContainerClass =
  "flex min-h-[120px] flex-col gap-1.5 rounded-lg border-2 border-transparent bg-muted/50 p-2 transition-colors data-[drop-target]:border-dashed data-[drop-target]:border-primary/50"

export const dragGhostClass =
  "rounded-lg border border-primary bg-card px-3 py-2 text-sm text-card-foreground shadow-lg"
