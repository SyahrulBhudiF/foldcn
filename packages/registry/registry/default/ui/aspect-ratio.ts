import type { Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

export const aspectRatioClass = 'relative w-full'

type AspectRatioConfig = Readonly<{ ratio?: number; className?: string }>

/** Styled aspect-ratio box. Without a Radix primitive the foldcn registry sets
 *  the `aspect-ratio` CSS property on a wrapper; place an `<img>`/`<iframe>` as
 *  a child. Mirrors the shadcn v4 `aspect-ratio.tsx` behavior. */
export const aspectRatio = <M>(
  config: AspectRatioConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [
      h.Class(cn(aspectRatioClass, config.className)),
      h.DataAttribute('slot', 'aspect-ratio'),
      ...(config.ratio === undefined
        ? []
        : [h.Style({ aspectRatio: String(config.ratio) })]),
    ],
    children,
  )
