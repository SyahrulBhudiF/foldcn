/** Stateful submodel — import the whole module as a namespace and wire its
 *  Model/Message/init/update into your app:
 *  `import * as Select from '@/components/ui/select'`
 */
import { Listbox as FoldkitListbox } from '@foldkit/ui'
import type { AnchorConfig } from '@foldkit/ui/listbox'
import { Option } from 'effect'
import { childAttributes, type Html, type HtmlBuilder } from 'foldkit/html'

import { icon } from '@/lib/icons'
import { Check, ChevronDown } from 'lucide'
import { cn } from '@/lib/utils'

/** Themed custom dropdown select backed by the @foldkit/ui Listbox submodel.
 *
 *  Usage: `import * as Select from '@/components/ui/select'`
 *
 *  1. Create a typed bundle once (module scope):
 *       export const LanguageSelect = Select.create<{ value: string; label: string }, string>()
 *  2. Embed its Model in your app Model (`languageSelect: Select.Model`),
 *     init it (`Select.init({ id: 'language' })`), route its Message through
 *     your update, and render via `h.submodel({ ..., view: LanguageSelect.view,
 *     viewInputs: Select.styledViewInputs({ ... }, h) })`.
 *
 *  For a plain native `<select>` helper, see `@/components/ui/native-select`.
 */

export const create = FoldkitListbox.create
export const init = (config: InitConfig): Model =>
  FoldkitListbox.init({ isAnimated: true, ...config })
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

export const selectSizeKeys = ['default', 'sm'] as const
export type SelectSize = (typeof selectSizeKeys)[number]

// foldkit deltas: items highlight via data-active (upstream focus:) per the
// derivation mapping; the panel emits data-side from the anchor placement.

/** Upstream SelectTrigger token string + w-full (foldcn renders a full-width
 *  trigger inside its label wrapper). */
export const selectTriggerClass =
  'cn-select-trigger flex h-8 w-full items-center justify-between gap-1.5 whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[size=sm]:h-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 [&_svg:not([class*="text-"])]:text-muted-foreground'

export const selectItemsClass =
  'cn-select-content z-50 max-h-96 min-w-36 overflow-x-hidden overflow-y-auto p-1 outline-none'

export const selectItemClass =
  'cn-select-item relative flex w-full cursor-default items-center select-none outline-none data-active:bg-accent data-active:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-selected:font-medium'

export const selectLabelClass = 'cn-select-label px-1.5 py-1 text-xs text-muted-foreground'
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

export const selectDescription = <M>(
  description: string,
  h: HtmlBuilder<M>,
  className?: string,
): Html => h.span([h.Class(cn(selectDescriptionClass, className))], [description])

export const selectChevron = <M>(h: HtmlBuilder<M>): Html =>
  h.span([h.Class('shrink-0 text-muted-foreground')], [icon(h, ChevronDown, 'size-4')])
