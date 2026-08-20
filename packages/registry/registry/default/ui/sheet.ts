import { Dialog as FoldkitDialog } from '@foldkit/ui'
import type { AnchorConfig } from '@foldkit/ui/anchor'
import type { Attribute, ChildAttribute, Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

// Re-export the @foldkit/ui Dialog submodel surface. A sheet is a Dialog
// variant anchored to an edge of the viewport instead of centered.

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

// --- Sides ---

export type SheetSide = 'top' | 'bottom' | 'left' | 'right'

export const SHEET_ANCHOR: Readonly<Record<SheetSide, AnchorConfig>> = {
  top: { placement: 'top', gap: 0, padding: 0 },
  bottom: { placement: 'bottom', gap: 0, padding: 0 },
  left: { placement: 'left', gap: 0, padding: 0 },
  right: { placement: 'right', gap: 0, padding: 0 },
}

export const sheetPanelClass: Readonly<Record<SheetSide, string>> = {
  top: 'fixed inset-x-0 top-0 z-50 flex h-auto flex-col gap-4 border bg-background p-6 shadow-lg duration-200 outline-none data-[leave]:animate-out data-[leave]:slide-out-to-top data-[leave]:fade-out-0 data-[enter]:animate-in data-[enter]:slide-in-from-top data-[enter]:fade-in-0',
  bottom:
    'fixed inset-x-0 bottom-0 z-50 flex h-auto flex-col gap-4 border bg-background p-6 shadow-lg duration-200 outline-none data-[leave]:animate-out data-[leave]:slide-out-to-bottom data-[leave]:fade-out-0 data-[enter]:animate-in data-[enter]:slide-in-from-bottom data-[enter]:fade-in-0',
  left: 'fixed inset-y-0 left-0 z-50 h-full w-3/4 gap-4 border bg-background p-6 shadow-lg duration-200 outline-none data-[leave]:animate-out data-[leave]:slide-out-to-left data-[leave]:fade-out-0 data-[enter]:animate-in data-[enter]:slide-in-from-left data-[enter]:fade-in-0 sm:max-w-sm',
  right:
    'fixed inset-y-0 right-0 z-50 h-full w-3/4 gap-4 border bg-background p-6 shadow-lg duration-200 outline-none data-[leave]:animate-out data-[leave]:slide-out-to-right data-[leave]:fade-out-0 data-[enter]:animate-in data-[enter]:slide-in-from-right data-[enter]:fade-in-0 sm:max-w-sm',
}

export const sheetBackdropClass =
  'fixed inset-0 z-50 bg-black/50 data-[leave]:animate-out data-[leave]:fade-out-0 data-[enter]:animate-in data-[enter]:fade-in-0'

export const sheetHeaderClass = 'flex flex-col gap-1.5 p-0'

export const sheetFooterClass = 'mt-auto flex flex-col gap-2 p-0 sm:flex-row sm:justify-end'

export const sheetTitleClass = 'text-base font-semibold text-foreground'

export const sheetDescriptionClass = 'text-sm text-muted-foreground'

export const sheetCloseButtonClass =
  "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

// --- Composable sub-components ---

type StyleConfig = Readonly<{ className?: string }>

export const header = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.div([h.Class(cn(sheetHeaderClass, config.className))], children)

export const title = <M>(
  attributes: ReadonlyArray<Attribute<M> | ChildAttribute>,
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.h2([...attributes, h.Class(cn(sheetTitleClass, config.className))], children)

export const description = <M>(
  attributes: ReadonlyArray<Attribute<M> | ChildAttribute>,
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.p([...attributes, h.Class(cn(sheetDescriptionClass, config.className))], children)

export const footer = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.div([h.Class(cn(sheetFooterClass, config.className))], children)

export const closeButton = <M>(
  attributes: ReadonlyArray<Attribute<M> | ChildAttribute>,
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.button([...attributes, h.Class(cn(sheetCloseButtonClass, config.className))], children)

// --- styledViewInputs factory ---

export type SheetContent<M> = Readonly<{
  closeButton: ReadonlyArray<Attribute<M> | ChildAttribute>
  title: ReadonlyArray<Attribute<M> | ChildAttribute>
  description: ReadonlyArray<Attribute<M> | ChildAttribute>
}>

export type StyledViewInputs<M> = Readonly<{
  side?: SheetSide
  content: (render: SheetContent<M>, h: HtmlBuilder<M>) => ReadonlyArray<Child>
  className?: string
  backdropClass?: string
  panelClass?: string
}>

/** Build styled `Dialog.ViewInputs` for a sheet. Defaults to a right-side panel. */
export const styledViewInputs = <M>(
  viewInputs: StyledViewInputs<M>,
  h: HtmlBuilder<M>,
): FoldkitDialog.ViewInputs => {
  const side = viewInputs.side ?? 'right'
  return {
    toView: ({ dialog, backdrop, panel, closeButton, title, description, isVisible }) =>
      h.dialog(
        [...dialog, h.Class(cn('bg-transparent p-0 open:block', viewInputs.className))],
        isVisible
          ? [
              h.div([...backdrop, h.Class(cn(sheetBackdropClass, viewInputs.backdropClass))]),
              h.div(
                [...panel, h.Class(cn(sheetPanelClass[side], viewInputs.panelClass))],
                viewInputs.content({ closeButton, title, description }, h),
              ),
            ]
          : [],
      )
  }
}
