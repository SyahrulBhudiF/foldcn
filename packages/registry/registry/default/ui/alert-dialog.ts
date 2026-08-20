import { Dialog as FoldkitDialog } from '@foldkit/ui'
import type { Attribute, ChildAttribute, Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

// Re-export the @foldkit/ui Dialog submodel surface. An alert dialog is a
// Dialog variant: same headless behavior, destructive-confirm styling.

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

export const alertDialogClass = 'bg-transparent p-0 open:flex items-center justify-center'

export const alertDialogBackdropClass =
  'fixed inset-0 isolate z-50 bg-black/50 data-[leave]:animate-out data-[leave]:fade-out-0 data-[enter]:animate-in data-[enter]:fade-in-0'

export const alertDialogPanelClass =
  'fixed top-1/2 left-1/2 z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 outline-none data-[leave]:animate-out data-[leave]:fade-out-0 data-[leave]:zoom-out-95 data-[enter]:animate-in data-[enter]:fade-in-0 data-[enter]:zoom-in-95 sm:rounded-lg'

export const alertDialogTitleClass = 'text-lg leading-none font-semibold'

export const alertDialogDescriptionClass = 'text-sm text-muted-foreground'

export const alertDialogHeaderClass = 'flex flex-col gap-2 text-center sm:text-left'

export const alertDialogFooterClass = 'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'

export const alertDialogCancelClass =
  'mt-2 inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground sm:mt-0'

export const alertDialogActionClass =
  'inline-flex h-9 items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40'

export const alertDialogCloseButtonClass =
  "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

// --- Composable sub-components ---

type StyleConfig = Readonly<{ className?: string }>

/** Alert dialog header wrapper. */
export const header = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.div([h.Class(cn(alertDialogHeaderClass, config.className))], children)

/** Alert dialog title — merges with the submodel's title attributes. */
export const title = <M>(
  attributes: ReadonlyArray<Attribute<M> | ChildAttribute>,
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.h2([...attributes, h.Class(cn(alertDialogTitleClass, config.className))], children)

/** Alert dialog description — merges with the submodel's description attributes. */
export const description = <M>(
  attributes: ReadonlyArray<Attribute<M> | ChildAttribute>,
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.p([...attributes, h.Class(cn(alertDialogDescriptionClass, config.className))], children)

/** Alert dialog footer wrapper. */
export const footer = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.div([h.Class(cn(alertDialogFooterClass, config.className))], children)

/** Close button — merges with the submodel's closeButton attributes. */
export const closeButton = <M>(
  attributes: ReadonlyArray<Attribute<M> | ChildAttribute>,
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.button([...attributes, h.Class(cn(alertDialogCloseButtonClass, config.className))], children)

/** Destructive action button. Spread the submodel's `closeButton` attributes so
 *  a confirm also dismisses the dialog. */
export const actionButton = <M>(
  attributes: ReadonlyArray<Attribute<M> | ChildAttribute>,
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.button([...attributes, h.Class(cn(alertDialogActionClass, config.className))], children)

/** Secondary cancel button. */
export const cancelButton = <M>(
  attributes: ReadonlyArray<Attribute<M> | ChildAttribute>,
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.button([...attributes, h.Class(cn(alertDialogCancelClass, config.className))], children)

// --- styledViewInputs factory ---

export type AlertDialogContent<M> = Readonly<{
  closeButton: ReadonlyArray<Attribute<M> | ChildAttribute>
  title: ReadonlyArray<Attribute<M> | ChildAttribute>
  description: ReadonlyArray<Attribute<M> | ChildAttribute>
}>

export type StyledViewInputs<M> = Readonly<{
  content: (render: AlertDialogContent<M>, h: HtmlBuilder<M>) => ReadonlyArray<Child>
  className?: string
  backdropClass?: string
  panelClass?: string
}>

/** Build styled `Dialog.ViewInputs` for an alert dialog. Pass your view's `h`
 *  so the content callback can dispatch your own messages. */
export const styledViewInputs = <M>(
  viewInputs: StyledViewInputs<M>,
  h: HtmlBuilder<M>,
): FoldkitDialog.ViewInputs => ({
  toView: ({ dialog, backdrop, panel, closeButton, title, description, isVisible }) =>
    h.dialog(
      [...dialog, h.Class(cn(alertDialogClass, viewInputs.className))],
      isVisible
        ? [
            h.div([...backdrop, h.Class(cn(alertDialogBackdropClass, viewInputs.backdropClass))]),
            h.div(
              [...panel, h.Class(cn(alertDialogPanelClass, viewInputs.panelClass))],
              viewInputs.content({ closeButton, title, description }, h),
            ),
          ]
        : [],
    ),
})
