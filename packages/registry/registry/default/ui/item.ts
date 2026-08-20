import type { Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

// --- Class constants ---

export const itemGroupClass = 'group/item-group flex flex-col'

export const itemSeparatorClass =
  'my-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px'

export const itemVariantKeys = ['default', 'outline', 'muted'] as const
export type ItemVariant = (typeof itemVariantKeys)[number]

export const itemVariants: Record<ItemVariant, string> = {
  default: 'bg-transparent',
  outline: 'border-border',
  muted: 'bg-muted/50',
}

export const itemSizeKeys = ['default', 'sm'] as const
export type ItemSize = (typeof itemSizeKeys)[number]

export const itemSizes: Record<ItemSize, string> = {
  default: 'gap-4 p-4',
  sm: 'gap-2.5 px-4 py-3',
}

export const itemClass =
  'group/item flex flex-wrap items-center rounded-md border border-transparent text-sm transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-accent/50'

export const itemMediaVariantKeys = ['default', 'icon', 'image'] as const
export type ItemMediaVariant = (typeof itemMediaVariantKeys)[number]

export const itemMediaVariants: Record<ItemMediaVariant, string> = {
  default: 'bg-transparent',
  icon: "size-8 rounded-sm border bg-muted [&_svg:not([class*='size-'])]:size-4",
  image: 'size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover',
}

export const itemMediaClass =
  'flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none'

export const itemContentClass = 'flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none'

export const itemTitleClass = 'flex w-fit items-center gap-2 text-sm leading-snug font-medium'

export const itemDescriptionClass =
  'line-clamp-2 text-sm leading-normal font-normal text-balance text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary'

export const itemActionsClass = 'flex items-center gap-2'
export const itemHeaderClass = 'flex basis-full items-center justify-between gap-2'
export const itemFooterClass = 'flex basis-full items-center justify-between gap-2'

// --- Types ---

type StyleConfig = Readonly<{ className?: string }>

type ItemConfig = Readonly<{
  variant?: ItemVariant
  size?: ItemSize
  className?: string
}>

type ItemMediaConfig = Readonly<{ variant?: ItemMediaVariant; className?: string }>

type ItemSeparatorConfig = Readonly<{
  orientation?: 'horizontal' | 'vertical'
  className?: string
}>

// --- Builders ---

const itemGroup = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [h.Role('list'), h.Class(cn(itemGroupClass, config.className)), h.DataAttribute('slot', 'item-group')],
    children,
  )

const itemSeparator = <M>(config: ItemSeparatorConfig, h: HtmlBuilder<M>): Html =>
  h.div(
    [
      h.Class(cn(itemSeparatorClass, config.className)),
      h.DataAttribute('slot', 'item-separator'),
      h.DataAttribute('orientation', config.orientation ?? 'horizontal'),
    ],
    [],
  )

const itemContainer = <M>(
  config: ItemConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [
      h.Class(
        cn(
          itemClass,
          itemVariants[config.variant ?? 'default'],
          itemSizes[config.size ?? 'default'],
          config.className,
        ),
      ),
      h.DataAttribute('slot', 'item'),
      h.DataAttribute('variant', config.variant ?? 'default'),
      h.DataAttribute('size', config.size ?? 'default'),
    ],
    children,
  )

const itemMedia = <M>(
  config: ItemMediaConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [
      h.Class(cn(itemMediaClass, itemMediaVariants[config.variant ?? 'default'], config.className)),
      h.DataAttribute('slot', 'item-media'),
      h.DataAttribute('variant', config.variant ?? 'default'),
    ],
    children,
  )

const itemContent = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div([h.Class(cn(itemContentClass, config.className)), h.DataAttribute('slot', 'item-content')], children)

const itemTitle = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div([h.Class(cn(itemTitleClass, config.className)), h.DataAttribute('slot', 'item-title')], children)

const itemDescription = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [h.Class(cn(itemDescriptionClass, config.className)), h.DataAttribute('slot', 'item-description')],
    children,
  )

const itemActions = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div([h.Class(cn(itemActionsClass, config.className)), h.DataAttribute('slot', 'item-actions')], children)

const itemHeader = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div([h.Class(cn(itemHeaderClass, config.className)), h.DataAttribute('slot', 'item-header')], children)

const itemFooter = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div([h.Class(cn(itemFooterClass, config.className)), h.DataAttribute('slot', 'item-footer')], children)

/** Styled item — a flexible list row with `Item.group`, `Item.separator`,
 *  `Item.media`, `Item.content`, `Item.title`, `Item.description`,
 *  `Item.actions`, `Item.header`, `Item.footer` sub-builders. Mirrors the
 *  shadcn v4 `item.tsx`. */
export const Item = Object.assign(itemContainer, {
  group: itemGroup,
  separator: itemSeparator,
  media: itemMedia,
  content: itemContent,
  title: itemTitle,
  description: itemDescription,
  actions: itemActions,
  header: itemHeader,
  footer: itemFooter,
})
