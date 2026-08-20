import { Menu as FoldkitMenu } from '@foldkit/ui'
import type { AnchorConfig } from '@foldkit/ui/menu'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'

// Re-export the @foldkit/ui Menu surface. A menubar is a horizontal bar of
// menu triggers; each trigger is a Menu instance. This module provides the
// bar/trigger styling and a `viewInputs` helper for the per-trigger menus.

export const create = FoldkitMenu.create
export const init = (config: InitConfig): Model => FoldkitMenu.init({ isAnimated: true, ...config })
export const buttonId = FoldkitMenu.buttonId
export const Model = FoldkitMenu.Model
export type Model = typeof Model.Type
export const Message = FoldkitMenu.Message
export type Message = typeof Message.Type
export const OutMessage = FoldkitMenu.OutMessage
export type OutMessage = typeof OutMessage.Type

export type Bundle<Item extends string = string> = FoldkitMenu.Bundle<Item>
export type InitConfig = FoldkitMenu.InitConfig
export type ViewInputs<Item extends string = string> = FoldkitMenu.ViewInputs<Item>
export type ItemConfig = FoldkitMenu.ItemConfig
export type GroupHeading = FoldkitMenu.GroupHeading

export const menubarClass =
  'flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs'

export const menubarTriggerClass =
  'flex items-center justify-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[open]:bg-accent data-[open]:text-accent-foreground'

export const menubarContentClass =
  'z-50 min-w-48 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-hidden data-[placement=bottom]:slide-in-from-top-2 data-[placement=top]:slide-in-from-bottom-2'

export const menubarContentAnimatedClass =
  'z-50 min-w-48 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-hidden data-[placement=bottom]:slide-in-from-top-2 data-[placement=top]:slide-in-from-bottom-2 data-[enter]:animate-in data-[enter]:fade-in-0 data-[enter]:zoom-in-95 data-[leave]:animate-out data-[leave]:fade-out-0 data-[leave]:zoom-out-95'

export const menubarItemClass =
  "relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

export const menubarSeparatorClass = '-mx-1 my-1 h-px bg-border'

export const menubarHeadingClass = 'px-2 py-1.5 text-sm font-semibold text-foreground'

export const menubarShortcutClass = 'ml-auto text-xs tracking-widest text-muted-foreground'

export const menubarBackdropClass = 'fixed inset-0 z-0'

export const menubarWrapperClass = 'relative inline-block'

export const MENUBAR_ANCHOR: AnchorConfig = {
  placement: 'bottom-start',
  gap: 4,
  padding: 8,
}

export type MenubarViewInputsConfig<Item extends string> = Readonly<{
  items: ReadonlyArray<Item>
  itemToConfig: ViewInputs<Item>['itemToConfig']
  buttonContent: Html
  anchor?: AnchorConfig
  isItemDisabled?: (item: Item, index: number) => boolean
  itemToSearchText?: (item: Item, index: number) => string
  isButtonDisabled?: boolean
  isAnimated?: boolean
  triggerClass?: string
  itemsClass?: string
  itemClass?: string
  backdropClass?: string
  wrapperClass?: string
  separatorClass?: string
  ariaLabel?: string
  ariaLabelledBy?: string
}>

/** Build styled `Menu.ViewInputs` for a menubar trigger's dropdown. */
export const viewInputs = <Item extends string>(
  config: MenubarViewInputsConfig<Item>,
): ViewInputs<Item> => ({
  items: config.items,
  anchor: config.anchor ?? MENUBAR_ANCHOR,
  isItemDisabled: config.isItemDisabled,
  itemToSearchText: config.itemToSearchText,
  isButtonDisabled: config.isButtonDisabled,
  buttonContent: config.buttonContent,
  ariaLabel: config.ariaLabel,
  ariaLabelledBy: config.ariaLabelledBy,
  buttonClassName: cn(menubarTriggerClass, config.triggerClass),
  itemsClassName: cn(
    config.isAnimated !== false ? menubarContentAnimatedClass : menubarContentClass,
    config.itemsClass,
  ),
  itemToConfig: (item, context) => {
    const { className, content } = config.itemToConfig(item, context)
    return { className: cn(menubarItemClass, config.itemClass, className), content }
  },
  separatorClassName: cn(menubarSeparatorClass, config.separatorClass),
  backdropClassName: cn(menubarBackdropClass, config.backdropClass),
  className: cn(menubarWrapperClass, config.wrapperClass),
})

/** Wrap a single menubar trigger's menu in the bar container. */
export const menubar = <M>(children: ReadonlyArray<Html>, h: HtmlBuilder<M>): Html =>
  h.div([h.Class(cn(menubarClass))], children)
