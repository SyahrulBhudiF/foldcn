import { Combobox as FoldkitCombobox } from '@foldkit/ui'
import type { AnchorConfig } from '@foldkit/ui/combobox'
import type { Option } from 'effect/Option'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { icon } from '@/lib/icons'
import { Check, ChevronDown } from 'lucide'
import { cn } from '@/lib/utils'

// Re-export the @foldkit/ui Combobox surface. Create a bundle once per
// item type:
//
//   export const CityCombobox = Combobox.create<City>()
//   export const CityMultiCombobox = Combobox.Multi.create<City>()

export const create = FoldkitCombobox.create
export const Multi = FoldkitCombobox.Multi
export const init = (config: InitConfig): Model => FoldkitCombobox.init({ isAnimated: true, ...config })
export const inputId = FoldkitCombobox.inputId
export const Model = FoldkitCombobox.Model
export type Model = typeof Model.Type
export const Message = FoldkitCombobox.Message
export type Message = typeof Message.Type
export const OutMessage = FoldkitCombobox.OutMessage
export type OutMessage = typeof OutMessage.Type

export type Bundle<Item extends string = string> = FoldkitCombobox.Bundle<Item>
export type InitConfig = FoldkitCombobox.InitConfig
export type ViewInputs<Item extends string = string> = FoldkitCombobox.ViewInputs<Item>
export type ItemConfig = FoldkitCombobox.ItemConfig
export type GroupHeading = FoldkitCombobox.GroupHeading

export const comboboxInputClass =
  'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 pr-9 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-[3px] data-[invalid]:border-destructive data-[invalid]:ring-destructive/20 data-[invalid]:ring-[3px] md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:border-destructive/50 dark:data-[invalid]:ring-destructive/40 dark:data-[invalid]:border-destructive/50'

export const comboboxButtonClass =
  'absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4'

export const comboboxItemsClass =
  'z-50 min-w-56 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-hidden data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2'

export const comboboxItemsAnimatedClass =
  'z-50 min-w-56 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-hidden data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 data-[enter]:animate-in data-[enter]:fade-in-0 data-[enter]:zoom-in-95 data-[leave]:animate-out data-[leave]:fade-out-0 data-[leave]:zoom-out-95'

export const comboboxItemClass =
  "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[active]:bg-accent data-[active]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[selected]:font-medium data-[readonly]:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

export const comboboxGroupHeadingClass = 'px-2 py-1.5 text-xs font-semibold text-muted-foreground'

export const comboboxSeparatorClass = '-mx-1 my-1 h-px bg-border'

export const comboboxItemsScrollClass = 'max-h-96 overflow-y-auto overscroll-contain'

export const comboboxBackdropClass = 'fixed inset-0 z-0'

export const comboboxWrapperClass = 'relative w-full'

export const comboboxInputWrapperClass = 'relative'

export const COMBOBOX_ANCHOR: AnchorConfig = {
  placement: 'bottom-start',
  gap: 8,
  padding: 8,
}

export const comboboxChevron = <M>(h: HtmlBuilder<M>): Html =>
  h.span([h.Class('shrink-0 text-muted-foreground')], [icon(h, ChevronDown, 'size-4')])

export const comboboxCheck = <M>(h: HtmlBuilder<M>): Html =>
  h.span([h.Class('absolute right-2 flex size-4 items-center justify-center')], [icon(h, Check)])

type CommonConfig<Item extends string> = Readonly<{
  items: ReadonlyArray<Item>
  restingInputValue: string
  itemToConfig: (
    item: Item,
    context: Readonly<{
      isActive: boolean
      isDisabled: boolean
      isReadOnly: boolean
      isSelected: boolean
    }>,
  ) => ItemConfig
  itemToValue: (item: Item, index: number) => Item
  itemToDisplayText: (item: Item, index: number) => string
  anchor?: AnchorConfig
  isItemDisabled?: (item: Item, index: number) => boolean
  inputPlaceholder?: string
  buttonContent?: Html
  isAnimated?: boolean
  isDisabled?: boolean
  isReadOnly?: boolean
  isInvalid?: boolean
  openOnFocus?: boolean
  ariaLabel?: string
  ariaLabelledBy?: string
  itemGroupKey?: (item: Item, index: number) => string
  groupToHeading?: (groupKey: string) => GroupHeading | undefined
  formName?: string
  inputClass?: string
  itemsClass?: string
  itemsScrollClass?: string
  itemClass?: string
  groupClass?: string
  separatorClass?: string
  backdropClass?: string
  wrapperClass?: string
  inputWrapperClass?: string
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
  isDisabled: config.isDisabled,
  isReadOnly: config.isReadOnly,
  isInvalid: config.isInvalid,
  openOnFocus: config.openOnFocus,
  ariaLabel: config.ariaLabel,
  ariaLabelledBy: config.ariaLabelledBy,
  itemGroupKey: config.itemGroupKey,
  groupToHeading: config.groupToHeading,
  inputClassName: cn(comboboxInputClass, config.inputClass),
  itemsClassName: cn(
    config.isAnimated !== false ? comboboxItemsAnimatedClass : comboboxItemsClass,
    config.itemsClass,
  ),
  itemsScrollClassName: config.itemsScrollClass ?? comboboxItemsScrollClass,
  itemToConfig: (item: Item, context: Parameters<CommonConfig<Item>['itemToConfig']>[1]) => {
    const { className, content } = config.itemToConfig(item, context)
    return { className: cn(comboboxItemClass, config.itemClass, className), content }
  },
  groupClassName: cn(comboboxGroupHeadingClass, config.groupClass),
  separatorClassName: cn(comboboxSeparatorClass, config.separatorClass),
  buttonClassName: comboboxButtonClass,
  inputWrapperClassName: cn(comboboxInputWrapperClass, config.inputWrapperClass),
  backdropClassName: cn(comboboxBackdropClass, config.backdropClass),
  className: cn(comboboxWrapperClass, config.wrapperClass),
})

export type SingleViewInputsConfig<Item extends string> = CommonConfig<Item> &
  Readonly<{
    maybeSelectedValue: Option<Item>
  }>

/** Build styled single-select `Combobox.ViewInputs`.
 *  Mirrors the shadcn v4 `combobox.tsx` trigger/content/item behavior:
 *  chevron trigger, check indicator on the selected item, scrollable list
 *  with max-height, grouping + separator support, and disabled/invalid/
 *  read-only + aria-label states. Filtering is parent-owned: pass the
 *  already-filtered `items` each render. The panel is hidden when `items`
 *  is empty (no empty-state row — show it outside the combobox if needed). */
export const viewInputs = <Item extends string>(
  config: SingleViewInputsConfig<Item>,
): ViewInputs<Item> => ({
  ...common(config),
  maybeSelectedValue: config.maybeSelectedValue,
})

export type MultiViewInputsConfig<Item extends string> = CommonConfig<Item> &
  Readonly<{
    selectedValues: ReadonlyArray<Item>
  }>

/** Build styled multi-select `Combobox.Multi` view inputs.
 *  Mirrors the same trigger/list/item styling as the single-select
 *  variant; the input rests empty after each commit and the parent
 *  toggles membership on `Selected` out-messages. Supports grouping and
 *  the same disabled/invalid/read-only states. */
export const multiViewInputs = <Item extends string>(
  config: MultiViewInputsConfig<Item>,
): FoldkitCombobox.Multi.ViewInputs<Item> => ({
  ...common(config),
  selectedValues: config.selectedValues,
})
