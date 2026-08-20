import type { Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

export const avatarSizeKeys = ['default', 'sm', 'lg'] as const
export type AvatarSize = (typeof avatarSizeKeys)[number]

export const avatarClass =
  'group/avatar relative flex size-8 shrink-0 overflow-hidden rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6'

export const avatarImageClass = 'aspect-square size-full'

export const avatarFallbackClass =
  'flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs'

export const avatarBadgeClass =
  'absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background select-none group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2 group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2'

export const avatarGroupClass =
  'group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background'

export const avatarGroupCountClass =
  'relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3'

type StyleConfig = Readonly<{ className?: string }>

type AvatarConfig = Readonly<{ size?: AvatarSize; className?: string }>

type AvatarImageConfig = Readonly<{ src: string; alt?: string; className?: string }>

const avatarContainer = <M>(
  config: AvatarConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.span(
    [
      h.Class(cn(avatarClass, config.className)),
      h.DataAttribute('slot', 'avatar'),
      h.DataAttribute('size', config.size ?? 'default'),
    ],
    children,
  )

const avatarImage = <M>(config: AvatarImageConfig, h: HtmlBuilder<M>): Html =>
  h.img(
    [
      h.Src(config.src),
      ...(config.alt === undefined ? [] : [h.Alt(config.alt)]),
      h.Class(cn(avatarImageClass, config.className)),
      h.DataAttribute('slot', 'avatar-image'),
    ],
  )

const avatarFallback = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.span(
    [h.Class(cn(avatarFallbackClass, config.className)), h.DataAttribute('slot', 'avatar-fallback')],
    children,
  )

const avatarBadge = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.span(
    [h.Class(cn(avatarBadgeClass, config.className)), h.DataAttribute('slot', 'avatar-badge')],
    children,
  )

const avatarGroup = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [h.Class(cn(avatarGroupClass, config.className)), h.DataAttribute('slot', 'avatar-group')],
    children,
  )

const avatarGroupCount = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [h.Class(cn(avatarGroupCountClass, config.className)), h.DataAttribute('slot', 'avatar-group-count')],
    children,
  )

/** Styled avatar — image + fallback, with optional status badge and grouping.
 *  Mirrors the shadcn v4 `avatar.tsx` (no Radix primitive; the foldcn registry
 *  renders the same `data-slot` surface). */
export const Avatar = Object.assign(avatarContainer, {
  image: avatarImage,
  fallback: avatarFallback,
  badge: avatarBadge,
  group: avatarGroup,
  groupCount: avatarGroupCount,
})
