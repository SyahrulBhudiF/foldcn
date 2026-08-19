import type { Html, HtmlBuilder } from "foldkit/html"

type Child = Html | string

import { cn } from "@/lib/utils"

// Card is a pure layout primitive (no @foldkit/ui backing — there is no
// headless Card). It provides the standard shadcn card surface as styled
// class constants plus a `card` helper for the common composition.

export const cardClass =
  "rounded-xl border border-border bg-card text-card-foreground shadow-sm"

export const cardHeaderClass = "flex flex-col space-y-1.5 p-6"

export const cardTitleClass = "text-2xl font-semibold leading-none tracking-tight"

export const cardDescriptionClass = "text-sm text-muted-foreground"

export const cardContentClass = "p-6 pt-0"

export const cardFooterClass = "flex items-center p-6 pt-0"

export type CardConfig<M> = Readonly<{
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
export const card = <M>(config: CardConfig<M>, h: HtmlBuilder<M>): Html =>
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
