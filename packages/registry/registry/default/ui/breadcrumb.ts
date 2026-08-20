import type { Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'
import { icon } from '@/lib/icons'
import { ChevronRight } from 'lucide'

type Child = Html | string

// Breadcrumb is a pure presentational landmark. `Breadcrumb` is the container
// (a `nav`); sub-builders are attached as properties: Breadcrumb.list,
// Breadcrumb.item, Breadcrumb.link, Breadcrumb.page, Breadcrumb.separator.

export const breadcrumbClass = 'text-sm text-muted-foreground'

export const breadcrumbListClass = 'flex flex-wrap items-center gap-1.5 break-words'

export const breadcrumbItemClass = 'inline-flex items-center gap-1.5'

export const breadcrumbLinkClass = 'transition-colors hover:text-foreground'

export const breadcrumbPageClass = 'font-normal text-foreground'

export const breadcrumbSeparatorClass =
  '[&>svg]:size-3.5 shrink-0'

type StyleConfig = Readonly<{ className?: string }>

const breadcrumbContainer = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.nav([h.Class(cn(breadcrumbClass, config.className)), h.DataAttribute('slot', 'breadcrumb')], children)

const breadcrumbList = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.ol([h.Class(cn(breadcrumbListClass)), h.DataAttribute('slot', 'breadcrumb-list')], children)

const breadcrumbItem = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.li([h.Class(cn(breadcrumbItemClass)), h.DataAttribute('slot', 'breadcrumb-item')], children)

const breadcrumbLink = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.a([h.Class(cn(breadcrumbLinkClass, config.className)), h.DataAttribute('slot', 'breadcrumb-link')], children)

const breadcrumbPage = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.span([h.Class(cn(breadcrumbPageClass, config.className)), h.DataAttribute('slot', 'breadcrumb-page')], children)

const breadcrumbSeparator = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child> = [],
  h: HtmlBuilder<M>,
): Html =>
  h.li(
    [h.Class(cn(breadcrumbSeparatorClass, config.className)), h.DataAttribute('slot', 'breadcrumb-separator')],
    children.length === 0 ? [icon(h, ChevronRight)] : children,
  )

/** Composable breadcrumb — `Breadcrumb` is the container, with sub-builders
 *  as properties: `Breadcrumb.list`, `Breadcrumb.item`, `Breadcrumb.link`,
 *  `Breadcrumb.page`, `Breadcrumb.separator`. */
export const Breadcrumb = Object.assign(breadcrumbContainer, {
  list: breadcrumbList,
  item: breadcrumbItem,
  link: breadcrumbLink,
  page: breadcrumbPage,
  separator: breadcrumbSeparator,
})
