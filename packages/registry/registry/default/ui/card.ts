import type { Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

// Card is a pure layout primitive (no @foldkit/ui backing — there is no
// headless Card). It provides the standard shadcn card surface as styled
// class constants plus a `card` helper for the common composition.

export const cardClass =
  'flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm'

export const cardHeaderClass =
  '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6'

export const cardTitleClass = 'leading-none font-semibold'

export const cardDescriptionClass = 'text-sm text-muted-foreground'

export const cardContentClass = 'px-6'

export const cardActionClass = 'col-start-2 row-span-2 row-start-1 self-start justify-self-end'

export const cardFooterClass = 'flex items-center px-6 [.border-t]:pt-6'

export type CardConfig = Readonly<{
  title?: string
  maybeDescription?: string
  headerClass?: string
  titleClass?: string
  descriptionClass?: string
  contentClass?: string
  footerClass?: string
  className?: string
  content: ReadonlyArray<Child>
  footer?: ReadonlyArray<Child>
}>

/** Styled card container with optional header (title + description),
 *  content and footer. */
export const card = <M>(config: CardConfig, h: HtmlBuilder<M>): Html =>
  h.div(
    [h.Class(cn(cardClass, config.className))],
    [
      config.title === undefined && config.maybeDescription === undefined
        ? h.empty
        : h.div(
            [h.Class(cn(cardHeaderClass, config.headerClass))],
            [
              config.title === undefined
                ? h.empty
                : h.h3([h.Class(cn(cardTitleClass, config.titleClass))], [config.title]),
              config.maybeDescription === undefined
                ? h.empty
                : h.p(
                    [h.Class(cn(cardDescriptionClass, config.descriptionClass))],
                    [config.maybeDescription],
                  ),
            ],
          ),
      h.div([h.Class(cn(cardContentClass, config.contentClass))], config.content),
      ...(config.footer === undefined || config.footer.length === 0
        ? []
        : [h.div([h.Class(cn(cardFooterClass, config.footerClass))], config.footer)]),
    ],
  )
