import { Tooltip as FoldkitTooltip } from '@foldkit/ui'
import type { AnchorConfig } from '@foldkit/ui/tooltip'
import type { Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

// Re-export the @foldkit/ui Tooltip submodel surface.

export const Model = FoldkitTooltip.Model
export type Model = typeof Model.Type

export const Message = FoldkitTooltip.Message
export type Message = typeof Message.Type

export const OutMessage = FoldkitTooltip.OutMessage
export type OutMessage = typeof OutMessage.Type

export const update = FoldkitTooltip.update
export const reflectShowDelay = FoldkitTooltip.reflectShowDelay
export const triggerId = FoldkitTooltip.triggerId
export const view = FoldkitTooltip.view

export type RenderInfo = FoldkitTooltip.RenderInfo

export type InitConfig = FoldkitTooltip.InitConfig

/** Hover-to-show delay in milliseconds. Matches the shadcn reference
 *  `TooltipProvider` default (`delay = 0`): tooltips appear immediately on
 *  hover/focus. Pass `showDelay` (e.g. `Duration.millis(400)` or `'400 millis'`)
 *  to wait before revealing. */
export const DEFAULT_SHOW_DELAY = 0

/** Create an initial tooltip model. Defaults the delay to `0` (immediate),
 *  matching the shadcn base tooltip. Any caller-supplied `showDelay` wins. */
export const init = (config: InitConfig): Model =>
  FoldkitTooltip.init({ showDelay: DEFAULT_SHOW_DELAY, ...config })

/** Default anchor matching the shadcn reference `TooltipContent` defaults:
 *  `side="top"`, `sideOffset=4`, `align="center"`, `alignOffset=0`.
 *  `placement` maps side+align (a bare side centers the tooltip), `gap` maps
 *  sideOffset, `offset` maps alignOffset and defaults to 0. */
export const TOOLTIP_ANCHOR: AnchorConfig = {
  placement: 'top',
  gap: 4,
}

export const tooltipTriggerClass =
  'inline-flex items-center justify-center rounded-md text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

// Styles mirror the shadcn v4 base tooltip (`cn-tooltip-content` +
// `cn-tooltip-content-logical` + Popup props), inlined because foldcn's base
// style does not ship the `cn-tooltip-*` classes. The foldkit anchor writes the
// resolved side to `data-placement` (normalized to `top`/`bottom`/`left`/`right`),
// so the reference's `data-[side=...]` variants become `data-[placement=...]`.
// The panel is mounted only while visible, so enter animations key off the
// `data-open` state; exit animations cannot play on detach.
export const tooltipContentClass =
  'z-50 inline-flex w-fit max-w-xs items-center gap-1.5 rounded-xl bg-foreground px-3 py-1.5 text-xs text-background data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=bottom]:origin-top data-[placement=left]:slide-in-from-right-2 data-[placement=left]:origin-right data-[placement=right]:slide-in-from-left-2 data-[placement=right]:origin-left data-[placement=top]:slide-in-from-bottom-2 data-[placement=top]:origin-bottom has-data-[slot=kbd]:pr-1.5 [&_[data-slot=kbd]]:relative [&_[data-slot=kbd]]:isolate [&_[data-slot=kbd]]:z-50 [&_[data-slot=kbd]]:rounded-lg'

// Mirrors the shadcn v4 base tooltip arrow (`cn-tooltip-arrow` +
// `cn-tooltip-arrow-logical` + Arrow props), inlined and mapped to
// `data-placement`. The logical (`inline-start`/`inline-end`) variants are
// omitted: foldkit placements are always physical (LTR), so the physical
// left/right rules already cover them. `absolute` is added because foldcn
// renders its own arrow element where base-ui's Arrow is positioned by the
// library; the panel's inline `position: absolute` (from the anchor mount)
// is its containing block.
export const tooltipArrowClass =
  'absolute z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[placement=bottom]:top-1 data-[placement=left]:top-1/2! data-[placement=left]:-right-1 data-[placement=left]:-translate-y-1/2 data-[placement=left]:translate-x-[-1.5px] data-[placement=right]:top-1/2! data-[placement=right]:-left-1 data-[placement=right]:-translate-y-1/2 data-[placement=right]:translate-x-[1.5px] data-[placement=top]:-bottom-2.5'

export const tooltipWrapperClass = 'relative inline-block'

export type StyledViewInputs = Readonly<{
  /** Positioning overrides. Defaults to `TOOLTIP_ANCHOR`
   *  (`placement: 'top'`, `gap: 4`), matching the shadcn reference. */
  anchor?: AnchorConfig
  /** Trigger element content. */
  trigger: Child
  /** Tooltip text. */
  content: Child
  className?: string
  triggerClass?: string
  contentClass?: string
  wrapperClass?: string
}>

/** Build styled `Tooltip.ViewInputs`. Pass your view's `h`. */
export const styledViewInputs = <M>(
  viewInputs: StyledViewInputs,
  h: HtmlBuilder<M>,
): FoldkitTooltip.ViewInputs => ({
  anchor: viewInputs.anchor ?? TOOLTIP_ANCHOR,
  toView: ({ trigger, panel, isVisible }) =>
    h.div(
      [
        h.Class(cn(tooltipWrapperClass, viewInputs.wrapperClass)),
        h.DataAttribute('slot', 'tooltip'),
      ],
      [
        h.button(
          [
            ...trigger,
            h.Class(cn(tooltipTriggerClass, viewInputs.triggerClass)),
            h.DataAttribute('slot', 'tooltip-trigger'),
          ],
          [viewInputs.trigger],
        ),
        ...(isVisible
          ? [
              h.div(
                [
                  ...panel,
                  h.Class(cn(tooltipContentClass, viewInputs.contentClass)),
                  h.DataAttribute('slot', 'tooltip-content'),
                ],
                [viewInputs.content, h.div([h.Class(tooltipArrowClass)], [])],
              ),
            ]
          : []),
      ],
    ),
})