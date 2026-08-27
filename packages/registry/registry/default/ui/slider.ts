/** Stateful submodel — import the whole module as a namespace and wire its
 *  Model/Message/init/update into your app:
 *  `import * as Slider from '@/components/ui/slider'`
 */
import { Slider as FoldkitSlider } from '@foldkit/ui'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'

/**
 * foldcn gap vs upstream: single value / single thumb only (upstream is
 * multi-thumb; foldcn renders one thumb). Vertical orientation is now wired
 * through `orientation` on `styledViewInputs` (tokens already contain
 * `data-vertical` selectors); omit it for horizontal (default).
 */

// Re-export the @foldkit/ui Slider submodel surface.

export const init = FoldkitSlider.init
export const update = FoldkitSlider.update
export const view = FoldkitSlider.view
export const Model = FoldkitSlider.Model
export type Model = typeof Model.Type
export const Message = FoldkitSlider.Message
export type Message = typeof Message.Type
export const OutMessage = FoldkitSlider.OutMessage
export type OutMessage = typeof OutMessage.Type

export const subscriptions = FoldkitSlider.subscriptions
export const subscriptionsForRoot = FoldkitSlider.subscriptionsForRoot
export const snapAndClamp = FoldkitSlider.snapAndClamp
export const fractionOfValue = FoldkitSlider.fractionOfValue
export const reflectRange = FoldkitSlider.reflectRange

export type InitConfig = FoldkitSlider.InitConfig
export type ViewInputs = FoldkitSlider.ViewInputs
export type SliderAttributes = FoldkitSlider.SliderAttributes

/** Upstream SliderPrimitive.Control string. */
export const sliderRootClass =
  'cn-slider relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col'

/** Upstream SliderPrimitive.Track string. */
export const sliderTrackClass = 'cn-slider-track relative grow overflow-hidden select-none'

/** Upstream SliderPrimitive.Indicator string. */
export const sliderFilledTrackClass =
  'cn-slider-range select-none data-horizontal:h-full data-vertical:w-full'

/** Upstream SliderPrimitive.Thumb string. The disabled: variants are inert
 *  under foldkit (aria-/data- twins are inlined at style resolution). */
export const sliderThumbClass =
  'cn-slider-thumb block shrink-0 select-none disabled:pointer-events-none disabled:opacity-50'

export const sliderLabelClass = 'text-sm font-medium'

export const sliderValueClass = 'text-sm tabular-nums text-muted-foreground'

export const sliderRowClass = 'flex flex-col gap-2 w-full'

export const sliderHeaderClass = 'flex items-center justify-between'

export type StyledViewInputs = Readonly<{
  value: number
  orientation?: 'horizontal' | 'vertical'
  label?: string
  formatValue?: (value: number) => string
  ariaLabel?: string
  ariaLabelledBy?: string
  isDisabled?: boolean
  isReadOnly?: boolean
  name?: string
  getTrackRoot?: () => Document | ShadowRoot
  rootClass?: string
  trackClass?: string
  filledTrackClass?: string
  thumbClass?: string
  rowClass?: string
  labelClass?: string
  valueClass?: string
  headerClass?: string
}>

/** Build styled `Slider.ViewInputs`. Pass your view's `h`. */
export const styledViewInputs = <M>(
  viewInputs: StyledViewInputs,
  h: HtmlBuilder<M>,
): ViewInputs => ({
  value: viewInputs.value,
  ariaLabel: viewInputs.ariaLabel,
  ariaLabelledBy: viewInputs.ariaLabelledBy,
  formatValue: viewInputs.formatValue,
  isDisabled: viewInputs.isDisabled,
  isReadOnly: viewInputs.isReadOnly,
  name: viewInputs.name,
  getTrackRoot: viewInputs.getTrackRoot,
  toView: (attributes): Html => {
    const orientation = viewInputs.orientation ?? 'horizontal'
    const maybeHeader: Html =
      viewInputs.label === undefined
        ? h.empty
        : h.div(
            [h.Class(cn(sliderHeaderClass, viewInputs.headerClass))],
            [
              h.label(
                [...attributes.label, h.Class(cn(sliderLabelClass, viewInputs.labelClass))],
                [viewInputs.label],
              ),
              h.span(
                [h.Class(cn(sliderValueClass, viewInputs.valueClass))],
                [
                  viewInputs.formatValue === undefined
                    ? String(viewInputs.value)
                    : viewInputs.formatValue(viewInputs.value),
                ],
              ),
            ],
          )

    const maybeHiddenInput: Html =
      attributes.hiddenInput.length > 0 ? h.input([...attributes.hiddenInput]) : h.empty

    return h.div(
      [h.Class(cn(sliderRowClass, viewInputs.rowClass))],
      [
        maybeHeader,
        h.div(
          [
            ...attributes.root,
            h.DataAttribute('slot', 'slider'),
            h.DataAttribute('orientation', orientation),
            h.DataAttribute(orientation, ''),
            h.Class(cn(sliderRootClass, viewInputs.rootClass)),
          ],
          [
            h.div(
              [
                ...attributes.track,
                h.DataAttribute('slot', 'slider-track'),
                h.DataAttribute('orientation', orientation),
                h.DataAttribute(orientation, ''),
                h.Class(cn(sliderTrackClass, viewInputs.trackClass)),
              ],
              [
                h.div([
                  ...attributes.filledTrack,
                  h.DataAttribute('slot', 'slider-range'),
                  h.DataAttribute('orientation', orientation),
                  h.DataAttribute(orientation, ''),
                  h.Class(cn(sliderFilledTrackClass, viewInputs.filledTrackClass)),
                ]),
              ],
            ),
            h.div([
              ...attributes.thumb,
              h.DataAttribute('slot', 'slider-thumb'),
              h.Class(cn(sliderThumbClass, viewInputs.thumbClass)),
            ]),
          ],
        ),
        maybeHiddenInput,
      ],
    )
  },
})
