import type { Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'

type Child = Html | string

// Sidebar is a pure presentational layout primitive (no headless provider).
// `SidebarProvider` establishes the flex shell; `Sidebar` is the aside rail,
// and `SidebarInset` is the scrolling content column. Sub-builders are attached
// as properties on each piece. Mirrors the shadcn `sidebar` base surface.

export const sidebarProviderClass =
  'flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar'

export const sidebarClass =
  'flex h-svh w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground [--sidebar-width:16rem]'

export const sidebarHeaderClass = 'flex flex-col gap-2 p-2'

export const sidebarContentClass =
  'flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden p-2'

export const sidebarFooterClass = 'flex flex-col gap-2 p-2'

export const sidebarGroupClass = 'relative flex w-full min-w-0 flex-col p-2'

export const sidebarGroupLabelClass =
  'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-hidden ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0'

export const sidebarMenuClass = 'flex w-full min-w-0 flex-col gap-1'

export const sidebarMenuItemClass = 'group/menu-item relative'

export const sidebarMenuButtonClass =
  'flex h-8 w-full items-center gap-2 rounded-md px-2 text-sm font-medium text-sidebar-foreground outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0'

export const sidebarInsetClass =
  'flex min-h-svh w-full flex-1 flex-col bg-background'

export const sidebarSeparatorClass = '-mx-2 my-2 h-px bg-sidebar-border'

export const sidebarTriggerClass =
  'inline-flex size-7 items-center justify-center rounded-md text-sidebar-foreground outline-hidden ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2'

type StyleConfig = Readonly<{ className?: string }>

const sidebarProvider = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.div([h.Class(cn(sidebarProviderClass, config.className)), h.DataAttribute('slot', 'sidebar-provider')], children)

const sidebar = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.aside([h.Class(cn(sidebarClass, config.className)), h.DataAttribute('slot', 'sidebar')], children)

const sidebarHeader = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.div([h.Class(cn(sidebarHeaderClass)), h.DataAttribute('slot', 'sidebar-header')], children)

const sidebarContent = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.div([h.Class(cn(sidebarContentClass)), h.DataAttribute('slot', 'sidebar-content')], children)

const sidebarFooter = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.div([h.Class(cn(sidebarFooterClass)), h.DataAttribute('slot', 'sidebar-footer')], children)

const sidebarGroup = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.div([h.Class(cn(sidebarGroupClass)), h.DataAttribute('slot', 'sidebar-group')], children)

const sidebarGroupLabel = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.div([h.Class(cn(sidebarGroupLabelClass, config.className)), h.DataAttribute('slot', 'sidebar-group-label')], children)

const sidebarMenu = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.ul([h.Class(cn(sidebarMenuClass)), h.DataAttribute('slot', 'sidebar-menu')], children)

const sidebarMenuItem = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.li([h.Class(cn(sidebarMenuItemClass)), h.DataAttribute('slot', 'sidebar-menu-item')], children)

const sidebarMenuButton = <M>(
  config: StyleConfig & Readonly<{ isActive?: boolean }>,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.button(
    [
      h.Type('button'),
      h.Class(cn(sidebarMenuButtonClass, config.className)),
      h.DataAttribute('slot', 'sidebar-menu-button'),
      ...(config.isActive === true ? [h.DataAttribute('active', 'true')] : []),
    ],
    children,
  )

const sidebarInset = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.div([h.Class(cn(sidebarInsetClass, config.className)), h.DataAttribute('slot', 'sidebar-inset')], children)

const sidebarSeparator = <M>(config: StyleConfig, h: HtmlBuilder<M>): Html =>
  h.div([h.Class(cn(sidebarSeparatorClass, config.className)), h.DataAttribute('slot', 'sidebar-separator')], [])

const sidebarTrigger = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.button(
    [h.Type('button'), h.Class(cn(sidebarTriggerClass, config.className)), h.DataAttribute('slot', 'sidebar-trigger')],
    children,
  )

/** Composable sidebar layout. */
export const Sidebar = Object.assign(sidebar, {
  header: sidebarHeader,
  content: sidebarContent,
  footer: sidebarFooter,
  group: sidebarGroup,
  groupLabel: sidebarGroupLabel,
  menu: sidebarMenu,
  menuItem: sidebarMenuItem,
  menuButton: sidebarMenuButton,
  separator: sidebarSeparator,
  trigger: sidebarTrigger,
})

export const SidebarProvider = Object.assign(sidebarProvider)
export const SidebarInset = Object.assign(sidebarInset)
