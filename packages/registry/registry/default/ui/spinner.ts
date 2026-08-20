import type { Html, HtmlBuilder } from 'foldkit/html'
import { Loader2 } from 'lucide'

import { icon } from '@/lib/icons'
import { cn } from '@/lib/utils'

export const spinnerIconClass = 'size-4 animate-spin'

type StyleConfig = Readonly<{ className?: string }>

/** Styled loading spinner — a `Loader2` lucide icon inside a `role="status"`
 *  wrapper. Mirrors the shadcn v4 `spinner.tsx`. */
export const spinner = <M>(config: StyleConfig, h: HtmlBuilder<M>): Html =>
  h.span(
    [h.Role('status'), h.AriaLabel('Loading'), h.Class(cn('inline-flex', config.className))],
    [icon(h, Loader2, spinnerIconClass)],
  )
