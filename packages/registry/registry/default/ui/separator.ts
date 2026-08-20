import type { Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'

export type SeparatorOrientation = 'horizontal' | 'vertical'

export const separatorClass =
  'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px'

type SeparatorConfig = Readonly<{
  orientation?: SeparatorOrientation
  className?: string
}>

/** Styled separator — a `role="separator"` divider. Mirrors the shadcn v4
 *  `separator.tsx`; the foldcn registry renders a bare divider (no Radix
 *  primitive). */
export const separator = <M>(config: SeparatorConfig, h: HtmlBuilder<M>): Html =>
  h.div(
    [
      h.Class(cn(separatorClass, config.className)),
      h.Role('separator'),
      h.AriaOrientation(config.orientation ?? 'horizontal'),
      h.DataAttribute('slot', 'separator'),
      h.DataAttribute('orientation', config.orientation ?? 'horizontal'),
    ],
    [],
  )
