import type { Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'

export const progressClass = 'relative h-2 w-full overflow-hidden rounded-full bg-primary/20'

export const progressIndicatorClass = 'h-full w-full flex-1 bg-primary transition-all'

type ProgressConfig = Readonly<{ value?: number; className?: string }>

const progressIndicator = <M>(value: number | undefined, h: HtmlBuilder<M>): Html =>
  h.div(
    [
      h.Class(progressIndicatorClass),
      h.DataAttribute('slot', 'progress-indicator'),
      ...(value === undefined
        ? []
        : [h.Style({ transform: `translateX(-${100 - value}%)` })]),
    ],
    [],
  )

/** Styled progress bar. Mirrors the shadcn v4 `progress.tsx` (no Radix
 *  primitive): the track renders an indicator whose offset tracks `value`. */
export const progress = <M>(config: ProgressConfig, h: HtmlBuilder<M>): Html =>
  h.div(
    [h.Class(cn(progressClass, config.className)), h.DataAttribute('slot', 'progress')],
    [progressIndicator(config.value, h)],
  )

export const Progress = Object.assign(progress, { indicator: progressIndicator })
