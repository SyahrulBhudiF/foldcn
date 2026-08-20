import type { Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

export type Direction = 'ltr' | 'rtl'

type DirectionConfig = Readonly<{ dir: Direction; className?: string }>

/** Text-direction wrapper. shadcn's `Direction` is a Radix provider that sets
 *  `dir` on a context; foldcn has no such primitive, so this renders a wrapper
 *  `<div dir=…>` carrying the same `data-slot` surface. Mirrors the shadcn v4
 *  `direction.tsx`. */
export const direction = <M>(
  config: DirectionConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.div([h.Dir(config.dir), h.Class(cn('w-full', config.className))], children)
