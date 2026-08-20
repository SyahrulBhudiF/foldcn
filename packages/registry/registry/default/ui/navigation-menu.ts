import type { Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'

type Child = Html | string

// NavigationMenu is a pure presentational top-level nav (a styled horizontal
// bar). `NavigationMenu` is the container (`nav`); sub-builders are attached as
// properties: NavigationMenu.list, NavigationMenu.item, NavigationMenu.link,
// NavigationMenu.trigger, NavigationMenu.content. Content visibility is driven
// by `data-state` (the demo sets it from model state) — there is no headless
// primitive behind it, mirroring how shadcn's `navigation-menu` base is mostly
// CSS + data attributes.

export const navigationMenuClass =
  'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center'

export const navigationMenuListClass = 'flex flex-1 list-none items-center justify-center gap-1'

export const navigationMenuItemClass = 'relative'

export const navigationMenuLinkClass =
  'inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-foreground hover:bg-muted hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[active=true]:bg-muted data-[active=true]:text-accent-foreground'

export const navigationMenuTriggerClass =
  'group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center gap-1 rounded-md px-4 py-2 text-sm font-medium text-foreground hover:bg-muted hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-muted data-[state=open]:text-accent-foreground'

export const navigationMenuContentClass =
  'absolute top-full left-0 mt-1.5 w-auto rounded-md border bg-popover p-2 text-popover-foreground shadow-md outline-hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'

export const navigationMenuViewportClass =
  'absolute top-full left-0 mt-1.5 origin-top-center rounded-md border bg-popover text-popover-foreground shadow'

type StyleConfig = Readonly<{ className?: string }>

const navigationMenuContainer = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.nav(
    [h.Class(cn(navigationMenuClass, config.className)), h.DataAttribute('slot', 'navigation-menu')],
    children,
  )

const navigationMenuList = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.ul([h.Class(cn(navigationMenuListClass)), h.DataAttribute('slot', 'navigation-menu-list')], children)

const navigationMenuItem = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.li([h.Class(cn(navigationMenuItemClass)), h.DataAttribute('slot', 'navigation-menu-item')], children)

const navigationMenuLink = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.a([h.Class(cn(navigationMenuLinkClass, config.className)), h.DataAttribute('slot', 'navigation-menu-link')], children)

const navigationMenuTrigger = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.button(
    [h.Type('button'), h.Class(cn(navigationMenuTriggerClass, config.className)), h.DataAttribute('slot', 'navigation-menu-trigger')],
    children,
  )

const navigationMenuContent = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div([h.Class(cn(navigationMenuContentClass, config.className)), h.DataAttribute('slot', 'navigation-menu-content')], children)

/** Composable navigation menu — `NavigationMenu` is the container, with
 *  sub-builders as properties: `NavigationMenu.list`, `NavigationMenu.item`,
 *  `NavigationMenu.link`, `NavigationMenu.trigger`, `NavigationMenu.content`. */
export const NavigationMenu = Object.assign(navigationMenuContainer, {
  list: navigationMenuList,
  item: navigationMenuItem,
  link: navigationMenuLink,
  trigger: navigationMenuTrigger,
  content: navigationMenuContent,
})
