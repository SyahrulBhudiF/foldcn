import type { Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

export const emptyClass =
  'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12'

export const emptyHeaderClass = 'flex max-w-sm flex-col items-center gap-2 text-center'

export const emptyMediaVariantKeys = ['default', 'icon'] as const
export type EmptyMediaVariant = (typeof emptyMediaVariantKeys)[number]

export const emptyMediaVariants: Record<EmptyMediaVariant, string> = {
  default: 'bg-transparent',
  icon: "mb-2 flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-6",
}

export const emptyTitleClass = 'text-lg font-medium tracking-tight'

export const emptyDescriptionClass =
  'text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary'

export const emptyContentClass =
  'flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance'

type StyleConfig = Readonly<{ className?: string }>

type EmptyMediaConfig = Readonly<{ variant?: EmptyMediaVariant; className?: string }>

const emptyContainer = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div([h.Class(cn(emptyClass, config.className)), h.DataAttribute('slot', 'empty')], children)

const emptyHeader = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div([h.Class(cn(emptyHeaderClass, config.className)), h.DataAttribute('slot', 'empty-header')], children)

const emptyMedia = <M>(
  config: EmptyMediaConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [
      h.Class(cn(emptyMediaVariants[config.variant ?? 'default'], config.className)),
      h.DataAttribute('slot', 'empty-icon'),
      h.DataAttribute('variant', config.variant ?? 'default'),
    ],
    children,
  )

const emptyTitle = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div([h.Class(cn(emptyTitleClass, config.className)), h.DataAttribute('slot', 'empty-title')], children)

const emptyDescription = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [h.Class(cn(emptyDescriptionClass, config.className)), h.DataAttribute('slot', 'empty-description')],
    children,
  )

const emptyContent = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div([h.Class(cn(emptyContentClass, config.className)), h.DataAttribute('slot', 'empty-content')], children)

/** Styled empty state — `Empty.header`, `Empty.media`, `Empty.title`,
 *  `Empty.description`, `Empty.content` sub-builders. Mirrors the shadcn v4
 *  `empty.tsx`. */
export const Empty = Object.assign(emptyContainer, {
  header: emptyHeader,
  media: emptyMedia,
  title: emptyTitle,
  description: emptyDescription,
  content: emptyContent,
})
