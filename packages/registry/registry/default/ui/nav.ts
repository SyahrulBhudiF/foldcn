import { Nav as FoldkitNav } from '@foldkit/ui'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'

export const navClass =
  'flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-sm'

export const navLinkClass =
  'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[current]:bg-primary data-[current]:text-primary-foreground'

export type NavConfig<Value extends string = string> = Readonly<{
  items: ReadonlyArray<Value>
  ariaLabel: string
  toHref: (value: Value, index: number) => string
  isItemCurrent: (value: Value, index: number) => boolean
  className?: string
  linkClass?: string
  toLabel: (value: Value, index: number) => Html | string
}>

/** Styled navigation landmark built on the @foldkit/ui Nav helper. The
 *  current destination is marked with `aria-current` and styled via the
 *  `data-current` attribute. */
export const nav = <M, Value extends string = string>(
  config: NavConfig<Value>,
  h: HtmlBuilder<M>,
): Html =>
  FoldkitNav.view<Value>({
    items: config.items,
    ariaLabel: config.ariaLabel,
    toHref: config.toHref,
    isItemCurrent: config.isItemCurrent,
    toView: ({ nav: navAttributes, items }) =>
      h.nav(
        [...navAttributes, h.Class(cn(navClass, config.className))],
        items.map((item, index) =>
          h.a(
            [...item.link, h.Class(cn(navLinkClass, config.linkClass))],
            [config.toLabel(item.value, index)],
          ),
        ),
      ),
  })
