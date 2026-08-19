import { Listbox as FoldkitListbox, Select as FoldkitSelect } from '@foldkit/ui'
import type { AnchorConfig } from '@foldkit/ui/listbox'
import { Option } from 'effect'
import { childAttributes, type Html, type HtmlBuilder } from 'foldkit/html'

import { icon } from '@/lib/icons'
import { Check, ChevronDown } from 'lucide'
import { cn } from '@/lib/utils'

// Re-export the @foldkit/ui Listbox surface so consumers can create the
// single-select bundle that backs the themed custom select:
//
//   export const LanguageSelect = Select.create<{ value: string; label: string }, string>()

export const create = FoldkitListbox.create
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
export type ViewInputs<Item, Value extends string = string> = FoldkitListbox.ViewInputs<Item, Value>
export type ItemConfig = FoldkitListbox.ItemConfig

export type SelectSize = 'default' | 'sm'

export const selectTriggerClass =
  'flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm whitespace-nowrap shadow-xs outline-none transition-[color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 disabled:pointer-events-none data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-[3px] data-[invalid]:border-destructive data-[invalid]:ring-destructive/20 data-[invalid]:ring-[3px] dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:border-destructive/50 dark:data-[invalid]:ring-destructive/40 dark:data-[invalid]:border-destructive/50 data-[size=sm]:h-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 [&_svg:not([class*="text-"])]:text-muted-foreground motion-reduce:transition-none'

export const selectItemsClass =
  'z-50 max-h-96 min-w-[var(--button-width)] overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none'

export const selectItemClass =
  'relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none transition-colors duration-150 ease-out data-[active]:bg-accent data-[active]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[selected]:font-medium motion-reduce:transition-none'

export const selectLabelClass = 'text-sm font-medium leading-none'
export const selectDescriptionClass = 'text-sm text-muted-foreground'
export const selectWrapperClass = 'flex w-full flex-col gap-1.5'
export const selectBackdropClass = 'fixed inset-0 z-0'
export const SELECT_ANCHOR: AnchorConfig = { placement: 'bottom-start', gap: 4, padding: 8 }

export type SelectOption = Readonly<{ value: string; label: string }>

export type SelectViewInputsConfig<Item, Value extends string = string> = Readonly<{
  options: ReadonlyArray<Item>
  maybeSelectedValue: Option.Option<Value>
  itemToValue: (item: Item) => Value
  itemToLabel: (item: Item) => string
  label: string
  placeholder?: string
  description?: string
  anchor?: AnchorConfig
  size?: SelectSize
  isDisabled?: boolean
  isReadOnly?: boolean
  isInvalid?: boolean
  name?: string
  form?: string
  ariaLabel?: string
  triggerClass?: string
  itemsClass?: string
  itemClass?: string
  wrapperClass?: string
}>

/** Build a themed custom select view from the @foldkit/ui Listbox submodel.
 *  Mirrors the shadcn v4 `select.tsx` trigger/content/item behavior: chevron
 *  trigger with muted placeholder, check indicator on the selected item, and
 *  disabled/invalid/read-only states. */
export const styledViewInputs = <M, Item, Value extends string = string>(
  config: SelectViewInputsConfig<Item, Value>,
  h: HtmlBuilder<M>,
): ViewInputs<Item, Value> => {
  const itemToValue = config.itemToValue
  const maybeFound = Option.flatMap(config.maybeSelectedValue, (value) => {
    const found = config.options.find((item) => itemToValue(item) === value)
    return found === undefined ? Option.none<Item>() : Option.some(found)
  })
  return {
    items: config.options,
    maybeSelectedValue: config.maybeSelectedValue,
    itemToValue,
    itemToSearchText: (item) => config.itemToLabel(item),
    buttonContent: h.span(
      [h.Class('flex w-full items-center justify-between gap-2')],
      [
        h.span(
          [
            h.DataAttribute('slot', 'select-value'),
            h.Class(
              cn(
                'min-w-0 flex-1 truncate text-left',
                Option.isNone(maybeFound) && 'text-muted-foreground',
              ),
            ),
          ],
          [
            Option.match(maybeFound, {
              onNone: () => config.placeholder ?? 'Select an option',
              onSome: (item) => config.itemToLabel(item),
            }),
          ],
        ),
        selectChevron(h),
      ],
    ),
    buttonAttributes: childAttributes([
      h.DataAttribute('slot', 'select-trigger'),
      h.DataAttribute('size', config.size ?? 'default'),
    ]),
    buttonClassName: cn(selectTriggerClass, config.triggerClass),
    itemsAttributes: childAttributes([h.DataAttribute('slot', 'select-content')]),
    itemsClassName: cn(selectItemsClass, config.itemsClass),
    itemToConfig: (item, context) => ({
      className: cn(selectItemClass, config.itemClass),
      content: h.span(
        [h.Class('flex w-full items-center')],
        [
          h.span([h.Class('flex-1')], [config.itemToLabel(item)]),
          context.isSelected
            ? h.span(
                [h.Class('absolute right-2 flex size-4 items-center justify-center')],
                [icon(h, Check)],
              )
            : h.empty,
        ],
      ),
    }),
    backdropClassName: cn(selectBackdropClass),
    className: cn(selectWrapperClass, config.wrapperClass),
    attributes: childAttributes([h.DataAttribute('slot', 'select')]),
    anchor: config.anchor ?? SELECT_ANCHOR,
    isButtonDisabled: config.isDisabled,
    isReadOnly: config.isReadOnly,
    isInvalid: config.isInvalid,
    name: config.name,
    form: config.form,
    ariaLabel: config.ariaLabel,
  }
}

export const selectLabel = <M>(label: string, h: HtmlBuilder<M>, className?: string): Html =>
  h.label([h.Class(cn(selectLabelClass, className))], [label])

export const selectDescription = <M>(description: string, h: HtmlBuilder<M>, className?: string): Html =>
  h.span([h.Class(cn(selectDescriptionClass, className))], [description])

export const selectChevron = <M>(h: HtmlBuilder<M>): Html =>
  h.span([h.Class('shrink-0 text-muted-foreground')], [icon(h, ChevronDown, 'size-4')])

export type SelectConfig<M> = Readonly<{
  id: string
  label: string
  maybeDescription?: string
  onChange?: (value: string) => M
  value?: string
  size?: SelectSize
  isDisabled?: boolean
  isInvalid?: boolean
  isAutofocus?: boolean
  name?: string
  options: ReadonlyArray<Html | string>
  className?: string
  labelClass?: string
  descriptionClass?: string
  wrapperClass?: string
}>

/** Styled native select with label, chevron and optional description, built
 *  on the @foldkit/ui Select helper. Mirrors the shadcn v4 `native-select.tsx`:
 *  an `appearance-none` select whose chevron overlays the control at its right
 *  edge. Pass `<option>` markup via `options`. */
export const select = <M>(config: SelectConfig<M>, h: HtmlBuilder<M>): Html =>
  FoldkitSelect.view<M>(
    {
      id: config.id,
      onChange: config.onChange,
      value: config.value,
      isDisabled: config.isDisabled,
      isInvalid: config.isInvalid,
      isAutofocus: config.isAutofocus,
      name: config.name,
      toView: (attributes) =>
        h.div(
          [h.Class(cn(selectWrapperClass, config.wrapperClass))],
          [
            h.label(
              [...attributes.label, h.Class(cn(selectLabelClass, config.labelClass))],
              [config.label],
            ),
            h.div(
              [h.Class('relative w-full')],
              [
                h.select(
                  [
                    ...attributes.select,
                    h.DataAttribute('slot', 'native-select'),
                    h.DataAttribute('size', config.size ?? 'default'),
                    h.Class(cn(selectTriggerClass, 'appearance-none pr-8', config.className)),
                  ],
                  config.options,
                ),
                h.span(
                  [
                    h.DataAttribute('slot', 'native-select-icon'),
                    h.Class('pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 select-none'),
                  ],
                  [selectChevron(h)],
                ),
              ],
            ),
            config.maybeDescription === undefined
              ? h.empty
              : h.span(
                  [
                    ...attributes.description,
                    h.Class(cn(selectDescriptionClass, config.descriptionClass)),
                  ],
                  [config.maybeDescription],
                ),
          ],
        ),
    },
    h,
  )