import { Slider as FoldkitSlider } from "@foldkit/ui"
import type { Html, HtmlBuilder } from "foldkit/html"

import { cn } from "@/lib/utils"

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

export type InitConfig = FoldkitSlider.InitConfig
export type ViewInputs = FoldkitSlider.ViewInputs
export type SliderAttributes = FoldkitSlider.SliderAttributes

export const sliderRootClass =
  "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col"

export const sliderTrackClass =
  "relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"

export const sliderFilledTrackClass =
  "absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"

export const sliderThumbClass =
  "block size-4 shrink-0 rounded-full border border-primary bg-white shadow-sm ring-ring/50 transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"

export const sliderLabelClass = "text-sm font-medium"

export const sliderValueClass = "text-sm tabular-nums text-muted-foreground"

export const sliderRowClass = "flex flex-col gap-2 w-full"

export const sliderHeaderClass = "flex items-center justify-between"

export type StyledViewInputs = Readonly<{
  value: number
  label: string
  formatValue?: (value: number) => string
  ariaLabel?: string
  ariaLabelledBy?: string
  rootClass?: string
  trackClass?: string
  thumbClass?: string
  rowClass?: string
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
  toView: attributes =>
    h.div(
      [h.Class(cn(sliderRowClass, viewInputs.rowClass))],
      [
        h.div(
          [h.Class(sliderHeaderClass)],
          [
            h.label(
              [...attributes.label, h.Class(sliderLabelClass)],
              [viewInputs.label],
            ),
            h.span(
              [h.Class(sliderValueClass)],
              [
                viewInputs.formatValue === undefined
                  ? String(viewInputs.value)
                  : viewInputs.formatValue(viewInputs.value),
              ],
            ),
          ],
        ),
        h.div(
          [...attributes.root, h.Class(cn(sliderRootClass, viewInputs.rootClass))],
          [
            h.div(
              [...attributes.track, h.Class(cn(sliderTrackClass, viewInputs.trackClass))],
              [h.div([...attributes.filledTrack, h.Class(sliderFilledTrackClass)])],
            ),
            h.div([...attributes.thumb, h.Class(cn(sliderThumbClass, viewInputs.thumbClass))]),
          ],
        ),
      ],
    ),
})
