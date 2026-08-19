import { Listbox as FoldkitListbox } from "@foldkit/ui"
import type { AnchorConfig } from "@foldkit/ui/listbox"
import type { Html } from "foldkit/html"

import { cn } from "@/lib/utils"

// Re-export the @foldkit/ui Listbox surface. Create a bundle once per
// value type:
//
//   export const ItemListbox = Listbox.create<"a" | "b">()
//   export const MultiListbox = Listbox.Multi.create<"a" | "b">()

export const create = FoldkitListbox.create
export const Multi = FoldkitListbox.Multi
export const init = FoldkitListbox.init
export const buttonId = FoldkitListbox.buttonId
export const Model = FoldkitListbox.Model
export type Model = typeof Model.Type
export const Message = FoldkitListbox.Message
export type Message = typeof Message.Type
export const OutMessage = FoldkitListbox.OutMessage
export type OutMessage = typeof OutMessage.Type

export type Bundle<Item = string> = FoldkitListbox.Bundle<Item>
export type InitConfig = FoldkitListbox.InitConfig
export type ViewInputs<Item, Value extends string = string> =
  FoldkitListbox.ViewInputs<Item, Value>
export type ItemConfig = FoldkitListbox.ItemConfig
export type GroupHeading = FoldkitListbox.GroupHeading

export const listboxTriggerClass =
  "flex h-10 min-w-48 items-center justify-between gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

export const listboxItemsClass =
  "z-50 w-56 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none"

export const listboxItemsAnimatedClass =
  "z-50 w-56 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"

export const listboxItemClass =
  "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[active]:bg-accent data-[active]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"

export const listboxGroupHeadingClass =
  "px-2 py-1.5 text-xs font-semibold text-muted-foreground"

export const listboxSeparatorClass = "-mx-1 my-1 h-px bg-border"

export const listboxBackdropClass = "fixed inset-0 z-0"

export const listboxWrapperClass = "relative inline-block"

export const LISTBOX_ANCHOR: AnchorConfig = {
  placement: "bottom-start",
  gap: 4,
  padding: 8,
}

type CommonConfig<Item> = Readonly<{
  items: ReadonlyArray<Item>
  itemToConfig: (item: Item, context: Readonly<{
    isActive: boolean
    isDisabled: boolean
    isReadOnly: boolean
    isSelected: boolean
  }>) => ItemConfig
  buttonContent: Html
  anchor?: AnchorConfig
  isItemDisabled?: (item: Item, index: number) => boolean
  itemToSearchText?: (item: Item, index: number) => string
  isButtonDisabled?: boolean
  isAnimated?: boolean
  itemGroupKey?: (item: Item, index: number) => string
  groupToHeading?: (groupKey: string) => GroupHeading | undefined
  triggerClass?: string
  itemsClass?: string
  itemClass?: string
  backdropClass?: string
  wrapperClass?: string
}>

const common = <Item>(config: CommonConfig<Item>) => ({
  items: config.items,
  anchor: config.anchor ?? LISTBOX_ANCHOR,
  isItemDisabled: config.isItemDisabled,
  itemToSearchText: config.itemToSearchText,
  isButtonDisabled: config.isButtonDisabled,
  buttonContent: config.buttonContent,
  itemGroupKey: config.itemGroupKey,
  groupToHeading: config.groupToHeading,
  buttonClassName: cn(listboxTriggerClass, config.triggerClass),
  itemsClassName: cn(
    config.isAnimated === true ? listboxItemsAnimatedClass : listboxItemsClass,
    config.itemsClass,
  ),
  itemToConfig: (item: Item, context: Parameters<CommonConfig<Item>["itemToConfig"]>[1]) => {
    const { className, content } = config.itemToConfig(item, context)
    return { className: cn(listboxItemClass, config.itemClass, className), content }
  },
  separatorClassName: listboxSeparatorClass,
  groupClassName: listboxGroupHeadingClass,
  backdropClassName: cn(listboxBackdropClass, config.backdropClass),
  className: cn(listboxWrapperClass, config.wrapperClass),
})

export type SingleViewInputsConfig<Item, Value extends string> =
  CommonConfig<Item> & Readonly<{
    maybeSelectedValue: import("effect/Option").Option<Value>
    itemToValue?: (item: Item) => Value
  }>

/** Build styled single-select `Listbox.ViewInputs`. */
export const viewInputs = <Item, Value extends string = Item extends string ? Item : string>(
  config: SingleViewInputsConfig<Item, Value>,
): ViewInputs<Item, Value> => {
  const { itemToValue, ...rest } = config
  return {
    ...common(rest),
    maybeSelectedValue: rest.maybeSelectedValue,
    // The Listbox view falls back to `String(item)` when `itemToValue` is
    // omitted; the conditional `ItemToValueInput` type can't see that
    // through the generic, so hand it the identity-ish default.
    itemToValue: itemToValue ?? ((item: Item) => String(item) as unknown as Value),
  }
}

export type MultiViewInputsConfig<Item> = CommonConfig<Item> & Readonly<{
  selectedValues: ReadonlyArray<string>
  itemToValue?: (item: Item) => string
}>

/** Build styled multi-select `Listbox.Multi` view inputs. */
export const multiViewInputs = <Item>(
  config: MultiViewInputsConfig<Item>,
): FoldkitListbox.Multi.ViewInputs<Item> => {
  const { itemToValue, ...rest } = config
  return {
    ...common(rest),
    selectedValues: rest.selectedValues,
    itemToValue: itemToValue ?? ((item: Item) => String(item)),
  }
}
