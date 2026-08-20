import type { Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

export const kbdClass =
  "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none [&_svg:not([class*='size-'])]:size-3 [[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10"

export const kbdGroupClass = 'inline-flex items-center gap-1'

type StyleConfig = Readonly<{ className?: string }>

const kbdContainer = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.kbd(
    [h.Class(cn(kbdClass, config.className)), h.DataAttribute('slot', 'kbd')],
    children,
  )

const kbdGroup = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.kbd(
    [h.Class(cn(kbdGroupClass, config.className)), h.DataAttribute('slot', 'kbd-group')],
    children,
  )

/** Styled keyboard key(s). `Kbd.group` clusters several keys. Mirrors the
 *  shadcn v4 `kbd.tsx`. */
export const Kbd = Object.assign(kbdContainer, { group: kbdGroup })
