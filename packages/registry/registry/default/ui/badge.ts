import type { Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

/** Badge variant keys — keep in sync with `badgeVariants`. */
export const badgeVariantKeys = [
  'default',
  'secondary',
  'destructive',
  'outline',
  'ghost',
  'link',
] as const

export const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
  destructive:
    'bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90',
  outline:
    'border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
  ghost: '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 [a&]:hover:underline',
}

export type BadgeVariant = (typeof badgeVariantKeys)[number]

export const badgeClass =
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3'

type StyleConfig = Readonly<{ className?: string; variant?: BadgeVariant }>

/** Styled badge built as a themed `<span>` (mirrors the shadcn v4 `badge.tsx`
 *  default element). For a link badge, render an `<a>` child and apply
 *  `badgeClass` via `cn` — foldcn has no Radix `Slot`. */
export const badge = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.span(
    [
      h.Class(cn(badgeClass, badgeVariants[config.variant ?? 'default'], config.className)),
      h.DataAttribute('slot', 'badge'),
      h.DataAttribute('variant', config.variant ?? 'default'),
    ],
    children,
  )
