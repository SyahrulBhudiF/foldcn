import { Select as FoldkitSelect } from '@foldkit/ui'
import type { Attribute, Html, HtmlBuilder } from 'foldkit/html'

import { icon } from '@/lib/icons'
import { ChevronDown } from 'lucide'
import { cn } from '@/lib/utils'

/** Stateless styled native `<select>` — use when every option is always
 *  visible and plain. For a searchable/filterable dropdown submodel, use
 *  `select` (Listbox-backed) instead. */

export const nativeSelectSizeKeys = ['default', 'sm'] as const
export type NativeSelectSize = (typeof nativeSelectSizeKeys)[number]

/** Upstream SelectTrigger token string + w-full (foldcn renders a full-width
 *  trigger inside its label wrapper). */
export const nativeSelectClass =
  'cn-select-trigger flex h-8 w-full items-center justify-between gap-1.5 whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[size=sm]:h-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 [&_svg:not([class*="text-"])]:text-muted-foreground'

export const nativeSelectLabelClass = 'cn-select-label px-1.5 py-1 text-xs text-muted-foreground'
export const nativeSelectDescriptionClass = 'text-sm text-muted-foreground'
export const nativeSelectWrapperClass = 'flex w-full flex-col gap-1.5'

export type NativeSelectConfig<M> = Readonly<{
  id: string
  label: string
  description?: string
  onChange?: (value: string) => M
  value?: string
  size?: NativeSelectSize
  isDisabled?: boolean
  isInvalid?: boolean
  isAutofocus?: boolean
  name?: string
  /** `<option>` elements — pass prebuilt markup, e.g.
   *  `cities.map((city) => h.option([], [city]))`. */
  options: ReadonlyArray<Html | string>
  className?: string
  labelClass?: string
  descriptionClass?: string
  wrapperClass?: string
}>

/** Styled native select with label, chevron and optional description, built
 *  on the @foldkit/ui Select helper. Mirrors the shadcn v4 `native-select.tsx`:
 *  an `appearance-none` select whose chevron overlays the control at its right
 *  edge. Pass `<option>` markup via `options`.
 *
 *  ```ts
 *  import { nativeSelect } from '@/components/ui/native-select'
 *
 *  nativeSelect(
 *    {
 *      id: 'fruit',
 *      label: 'Fruit',
 *      onChange: (value) => Message.PickedFruit({ value }),
 *      options: fruits.map((fruit) => h.option([h.Value(fruit)], [fruit])),
 *    },
 *    h,
 *  )
 *  ``` */
export const nativeSelect = <M>(config: NativeSelectConfig<M>, h: HtmlBuilder<M>): Html =>
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
          [h.Class(cn(nativeSelectWrapperClass, config.wrapperClass))],
          [
            h.label(
              [...attributes.label, h.Class(cn(nativeSelectLabelClass, config.labelClass))],
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
                    h.Class(cn(nativeSelectClass, 'appearance-none pr-8', config.className)),
                  ],
                  config.options,
                ),
                h.span(
                  [
                    h.DataAttribute('slot', 'native-select-icon'),
                    h.Class(
                      'pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 select-none',
                    ),
                  ],
                  [nativeSelectChevron(h)],
                ),
              ],
            ),
            config.description === undefined
              ? h.empty
              : h.span(
                  [
                    ...attributes.description,
                    h.Class(cn(nativeSelectDescriptionClass, config.descriptionClass)),
                  ],
                  [config.description],
                ),
          ],
        ),
    },
    h,
  )

export const nativeSelectChevron = <M>(h: HtmlBuilder<M>): Html =>
  h.span([h.Class('shrink-0 text-muted-foreground')], [icon(h, ChevronDown, 'size-4')])
