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

export const init = (config: InitConfig): Model => FoldkitDialog.init({ isAnimated: true, ...config })
export const update = FoldkitDialog.update
export const open = FoldkitDialog.open
export const close = FoldkitDialog.close
export const titleId = FoldkitDialog.titleId
export const descriptionId = FoldkitDialog.descriptionId
export const view = FoldkitDialog.view

export type InitConfig = FoldkitDialog.InitConfig
export type RenderInfo = FoldkitDialog.RenderInfo

// --- Class constants ---

export const drawerClass = 'bg-transparent p-0 open:block'

export const drawerBackdropClass =
  'fixed inset-0 z-50 bg-black/50 data-[leave]:animate-out data-[leave]:fade-out-0 data-[enter]:animate-in data-[enter]:fade-in-0'

export const drawerPanelClass =
  'fixed inset-x-0 bottom-0 z-50 flex max-h-[96vh] flex-col gap-4 rounded-t-xl border bg-background p-6 shadow-lg outline-none data-[leave]:animate-out data-[leave]:slide-out-to-bottom data-[leave]:fade-out-0 data-[enter]:animate-in data-[enter]:slide-in-from-bottom data-[enter]:fade-in-0'

export const drawerHandleClass = 'mx-auto h-1.5 w-12 shrink-0 rounded-full bg-muted'

export const drawerHeaderClass = 'flex flex-col gap-1.5'

export const drawerTitleClass = 'text-lg leading-none font-semibold'

export const drawerDescriptionClass = 'text-sm text-muted-foreground'

export const drawerFooterClass = 'mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'

export const drawerCloseButtonClass =
  "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

// --- Composable sub-components ---

type StyleConfig = Readonly<{ className?: string }>

export const handle = <M>(config: StyleConfig, h: HtmlBuilder<M>): Html =>
  h.div([h.Class(cn(drawerHandleClass, config.className))])

export const header = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.div([h.Class(cn(drawerHeaderClass, config.className))], children)

export const title = <M>(
  attributes: ReadonlyArray<Attribute<M> | ChildAttribute>,
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.h2([...attributes, h.Class(cn(drawerTitleClass, config.className))], children)

export const description = <M>(
  attributes: ReadonlyArray<Attribute<M> | ChildAttribute>,
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.p([...attributes, h.Class(cn(drawerDescriptionClass, config.className))], children)

export const footer = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.div([h.Class(cn(drawerFooterClass, config.className))], children)

export const closeButton = <M>(
  attributes: ReadonlyArray<Attribute<M> | ChildAttribute>,
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.button([...attributes, h.Class(cn(drawerCloseButtonClass, config.className))], children)

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
      [...dialog, h.Class(cn(drawerClass, viewInputs.className))],
      isVisible
        ? [
            h.div([...backdrop, h.Class(cn(drawerBackdropClass, viewInputs.backdropClass))]),
            h.div(
              [...panel, h.Class(cn(drawerPanelClass, viewInputs.panelClass))],
              [
                viewInputs.isHandleVisible === true ? handle({}, h) : h.empty,
                ...viewInputs.content({ closeButton, title, description }, h),
              ],
            ),
          ]
        : [],
    ),
})
