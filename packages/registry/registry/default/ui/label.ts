import type { Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

export const labelClass =
  'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50'

type LabelConfig = Readonly<{ forId?: string; className?: string }>

/** Styled label. Mirrors the shadcn v4 `label.tsx` (no Radix primitive). */
export const label = <M>(
  config: LabelConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.label(
    [
      h.Class(cn(labelClass, config.className)),
      h.DataAttribute('slot', 'label'),
      ...(config.forId === undefined ? [] : [h.For(config.forId)]),
    ],
    children,
  )
