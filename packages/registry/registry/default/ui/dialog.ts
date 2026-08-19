import { Dialog as FoldkitDialog } from '@foldkit/ui'
import type { Attribute, ChildAttribute, Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

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

// --- Class constants ---

export const dialogClass = 'bg-transparent p-0 open:flex items-center justify-center'

export const dialogBackdropClass =
  'fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0'

export const dialogPanelClass =
  'fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg'

export const dialogTitleClass = 'text-lg leading-none font-semibold'

export const dialogDescriptionClass = 'text-sm text-muted-foreground'

export const dialogCloseButtonClass =
  "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

export const dialogHeaderClass = 'flex flex-col gap-2 text-center sm:text-left'

export const dialogFooterClass = 'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'

// --- Composable sub-components ---
//
// These abstract away element types, base classes, and attribute spreading.
// Use inside `styledViewInputs` content callbacks:
//
//   content: (render, h) => [
//     Dialog.header({}, [
//       Dialog.title(render.title, {}, ['Title'], h),
//       Dialog.description(render.description, {}, ['Subtitle'], h),
//     ], h),
//     Dialog.content({}, [/* ... */], h),
//     Dialog.footer({}, [button(...)], h),
//   ]

type StyleConfig = Readonly<{ className?: string }>

/** Dialog header wrapper. */
export const header = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.div([h.Class(cn(dialogHeaderClass, config.className))], children)

/** Dialog title — merges with the submodel's title attributes. */
export const title = <M>(
  attributes: ReadonlyArray<Attribute<M> | ChildAttribute>,
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.h2([...attributes, h.Class(cn(dialogTitleClass, config.className))], children)

/** Dialog description — merges with the submodel's description attributes. */
export const description = <M>(
  attributes: ReadonlyArray<Attribute<M> | ChildAttribute>,
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.p([...attributes, h.Class(cn(dialogDescriptionClass, config.className))], children)

/** Dialog footer wrapper. */
export const footer = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.div([h.Class(cn(dialogFooterClass, config.className))], children)

/** Close button — merges with the submodel's closeButton attributes. */
export const closeButton = <M>(
  attributes: ReadonlyArray<Attribute<M> | ChildAttribute>,
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.button([...attributes, h.Class(cn(dialogCloseButtonClass, config.className))], children)

// --- styledViewInputs factory ---

export type DialogContent<M> = Readonly<{
  closeButton: ReadonlyArray<Attribute<M> | ChildAttribute>
  title: ReadonlyArray<Attribute<M> | ChildAttribute>
  description: ReadonlyArray<Attribute<M> | ChildAttribute>
}>

export type StyledViewInputs<M> = Readonly<{
  /** Panel content. Receives the close-button, title and description
   *  attribute bundles to spread onto your own elements, or pass to
   *  Dialog.title / Dialog.description / Dialog.closeButton helpers. */
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
