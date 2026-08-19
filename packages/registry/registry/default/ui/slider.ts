import { Slider as FoldkitSlider } from '@foldkit/ui'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'

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

export const sliderRootClass =
  'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col'

export const sliderTrackClass =
  'relative grow overflow-hidden select-none rounded-full bg-muted h-1.5 w-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5'

export const sliderFilledTrackClass =
  'absolute select-none bg-primary h-full w-full data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full'

export const sliderThumbClass =
  'block size-4 shrink-0 select-none rounded-full border border-primary bg-white shadow-sm ring-ring/50 transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50'

export const sliderLabelClass = 'text-sm font-medium'

export const sliderValueClass = 'text-sm tabular-nums text-muted-foreground'

export const sliderRowClass = 'flex flex-col gap-2 w-full'

export const sliderHeaderClass = 'flex items-center justify-between'

export type StyledViewInputs = Readonly<{
  value: number
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
            h.Class(cn(sliderRootClass, viewInputs.rootClass)),
          ],
          [
            h.div(
              [
                ...attributes.track,
                h.DataAttribute('slot', 'slider-track'),
                h.DataAttribute('orientation', 'horizontal'),
                h.Class(cn(sliderTrackClass, viewInputs.trackClass)),
              ],
              [
                h.div([
                  ...attributes.filledTrack,
                  h.DataAttribute('slot', 'slider-range'),
                  h.DataAttribute('orientation', 'horizontal'),
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
