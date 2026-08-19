import type { Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

// Card is a pure layout primitive (no @foldkit/ui backing — there is no
// headless Card). `Card` itself is the container; sub-builders are attached
// as properties: Card.header, Card.title, Card.description, Card.action,
// Card.content, Card.footer.
//
// Mirrors the shadcn/ui v4 base Card: every part carries a `data-slot`
// attribute and the container exposes `data-size` ("default" | "sm"). The
// container defines --card-spacing, which header/content/footer consume via
// px-(--card-spacing), so a single data-[size=sm] override resizes the whole
// card.

export const cardSizeKeys = ['default', 'sm'] as const
export type CardSize = (typeof cardSizeKeys)[number]

export const cardClass =
  'group/card flex flex-col overflow-hidden rounded-2xl bg-card py-(--card-spacing) text-card-foreground text-sm ring-1 ring-foreground/10 gap-(--card-spacing) [--card-spacing:--spacing(6)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl'

export const cardHeaderClass =
  'group/card-header @container/card-header grid auto-rows-min items-start gap-2 rounded-t-xl px-(--card-spacing) [.border-b]:pb-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]'

export const cardTitleClass = 'text-base font-medium'

export const cardDescriptionClass = 'text-sm text-muted-foreground'

export const cardContentClass = 'px-(--card-spacing)'

export const cardActionClass =
  'col-start-2 row-span-2 row-start-1 self-start justify-self-end'

export const cardFooterClass =
  'flex items-center rounded-b-xl px-(--card-spacing) [.border-t]:pt-(--card-spacing)'

type StyleConfig = Readonly<{ className?: string }>

type CardConfig = Readonly<{ className?: string; size?: CardSize }>

/** Outermost card surface. */
const cardContainer = <M>(
  config: CardConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [
      h.Class(cn(cardClass, config.className)),
      h.DataAttribute('slot', 'card'),
      h.DataAttribute('size', config.size ?? 'default'),
    ],
    children,
  )

/** Header wrapper — positions title, description and action via CSS grid. */
const cardHeader = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [h.Class(cn(cardHeaderClass, config.className)), h.DataAttribute('slot', 'card-header')],
    children,
  )

/** Card title. */
const cardTitle = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [h.Class(cn(cardTitleClass, config.className)), h.DataAttribute('slot', 'card-title')],
    children,
  )

/** Card description text. */
const cardDescription = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [
      h.Class(cn(cardDescriptionClass, config.className)),
      h.DataAttribute('slot', 'card-description'),
    ],
    children,
  )

/** Action area pinned to the top-right of the header. */
const cardAction = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [h.Class(cn(cardActionClass, config.className)), h.DataAttribute('slot', 'card-action')],
    children,
  )

/** Main content area. */
const cardContent = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [h.Class(cn(cardContentClass, config.className)), h.DataAttribute('slot', 'card-content')],
    children,
  )

/** Footer area. */
const cardFooter = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [h.Class(cn(cardFooterClass, config.className)), h.DataAttribute('slot', 'card-footer')],
    children,
  )

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