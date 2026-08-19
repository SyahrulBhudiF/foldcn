import { Combobox as FoldkitCombobox } from "@foldkit/ui"
import type { AnchorConfig } from "@foldkit/ui/combobox"
import type { Option } from "effect/Option"
import type { Html } from "foldkit/html"

import { cn } from "@/lib/utils"

// Re-export the @foldkit/ui Combobox surface. Create a bundle once per
// item type:
//
//   export const CityCombobox = Combobox.create<City>()
//   export const CityMultiCombobox = Combobox.Multi.create<City>()

export const create = FoldkitCombobox.create
export const Multi = FoldkitCombobox.Multi
export const init = FoldkitCombobox.init
export const inputId = FoldkitCombobox.inputId
export const Model = FoldkitCombobox.Model
export type Model = typeof Model.Type
export const Message = FoldkitCombobox.Message
export type Message = typeof Message.Type
export const OutMessage = FoldkitCombobox.OutMessage
export type OutMessage = typeof OutMessage.Type

export type Bundle<Item extends string = string> = FoldkitCombobox.Bundle<Item>
export type InitConfig = FoldkitCombobox.InitConfig
export type ViewInputs<Item extends string = string> =
  FoldkitCombobox.ViewInputs<Item>
export type ItemConfig = FoldkitCombobox.ItemConfig
export type GroupHeading = FoldkitCombobox.GroupHeading

export const comboboxInputClass =
  "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30"

export const comboboxButtonClass =
  "absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground"

export const comboboxItemsClass =
  "z-50 min-w-56 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"

export const comboboxItemsAnimatedClass =
  "z-50 min-w-56 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"

export const comboboxItemClass =
  "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

export const comboboxBackdropClass = "fixed inset-0 z-0"

export const comboboxWrapperClass = "relative w-full"

export const comboboxInputWrapperClass = "relative"

export const COMBOBOX_ANCHOR: AnchorConfig = {
  placement: "bottom-start",
  gap: 8,
  padding: 8,
}

type CommonConfig<Item extends string> = Readonly<{
  items: ReadonlyArray<Item>
  restingInputValue: string
  itemToConfig: (item: Item, context: Readonly<{
    isActive: boolean
    isDisabled: boolean
    isReadOnly: boolean
    isSelected: boolean
  }>) => ItemConfig
  itemToValue: (item: Item, index: number) => Item
  itemToDisplayText: (item: Item, index: number) => string
  anchor?: AnchorConfig
  isItemDisabled?: (item: Item, index: number) => boolean
  inputPlaceholder?: string
  buttonContent?: Html
  isAnimated?: boolean
  formName?: string
  inputClass?: string
  itemsClass?: string
  itemClass?: string
  backdropClass?: string
  wrapperClass?: string
}>

const common = <Item extends string>(config: CommonConfig<Item>) => ({
  items: config.items,
  restingInputValue: config.restingInputValue,
  anchor: config.anchor ?? COMBOBOX_ANCHOR,
  isItemDisabled: config.isItemDisabled,
  itemToValue: config.itemToValue,
  itemToDisplayText: config.itemToDisplayText,
  inputPlaceholder: config.inputPlaceholder,
  buttonContent: config.buttonContent,
  formName: config.formName,
  inputClassName: cn(comboboxInputClass, config.inputClass),
  itemsClassName: cn(
    config.isAnimated === true ? comboboxItemsAnimatedClass : comboboxItemsClass,
    config.itemsClass,
  ),
  itemToConfig: (item: Item, context: Parameters<CommonConfig<Item>["itemToConfig"]>[1]) => {
    const { className, content } = config.itemToConfig(item, context)
    return { className: cn(comboboxItemClass, config.itemClass, className), content }
  },
  buttonClassName: comboboxButtonClass,
  inputWrapperClassName: comboboxInputWrapperClass,
  backdropClassName: cn(comboboxBackdropClass, config.backdropClass),
  className: cn(comboboxWrapperClass, config.wrapperClass),
})

export type SingleViewInputsConfig<Item extends string> =
  CommonConfig<Item> & Readonly<{
    maybeSelectedValue: Option<Item>
  }>

/** Build styled single-select `Combobox.ViewInputs`. */
export const viewInputs = <Item extends string>(
  config: SingleViewInputsConfig<Item>,
): ViewInputs<Item> => ({
  ...common(config),
  maybeSelectedValue: config.maybeSelectedValue,
})

export type MultiViewInputsConfig<Item extends string> =
  CommonConfig<Item> & Readonly<{
    selectedValues: ReadonlyArray<Item>
  }>

/** Build styled multi-select `Combobox.Multi` view inputs. */
export const multiViewInputs = <Item extends string>(
  config: MultiViewInputsConfig<Item>,
): FoldkitCombobox.Multi.ViewInputs<Item> => ({
  ...common(config),
  selectedValues: config.selectedValues,
})
