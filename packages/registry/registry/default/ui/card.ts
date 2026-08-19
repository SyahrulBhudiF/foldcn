import type { Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

// Card is a pure layout primitive (no @foldkit/ui backing — there is no
// headless Card). `Card` itself is the container; sub-builders are attached
// as properties: Card.header, Card.title, Card.description, Card.action,
// Card.content, Card.footer.

export const cardClass =
  'flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm'

export const cardHeaderClass =
  '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6'

export const cardTitleClass = 'leading-none font-semibold'

export const cardDescriptionClass = 'text-sm text-muted-foreground'

export const cardContentClass = 'px-6'

export const cardActionClass =
  'col-start-2 row-span-2 row-start-1 self-start justify-self-end'

export const cardFooterClass = 'flex items-center px-6 [.border-t]:pt-6'

type StyleConfig = Readonly<{ className?: string }>

/** Outermost card surface. */
const cardContainer = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.div([h.Class(cn(cardClass, config.className))], children)

/** Header wrapper — positions title, description and action via CSS grid. */
const cardHeader = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.div([h.Class(cn(cardHeaderClass, config.className))], children)

/** Card title (renders as h3). */
const cardTitle = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.h3([h.Class(cn(cardTitleClass, config.className))], children)

/** Card description text. */
const cardDescription = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.p([h.Class(cn(cardDescriptionClass, config.className))], children)

/** Action area pinned to the top-right of the header. */
const cardAction = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.div([h.Class(cn(cardActionClass, config.className))], children)

/** Main content area. */
const cardContent = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.div([h.Class(cn(cardContentClass, config.className))], children)

/** Footer area. */
const cardFooter = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.div([h.Class(cn(cardFooterClass, config.className))], children)

/** Composable card — `Card` is the container, with sub-builders as
 *  properties: `Card.header`, `Card.title`, `Card.description`,
 *  `Card.action`, `Card.content`, `Card.footer`. */
export const Card = Object.assign(cardContainer, {
  header: cardHeader,
  title: cardTitle,
  description: cardDescription,
  action: cardAction,
  content: cardContent,
  footer: cardFooter,
})
