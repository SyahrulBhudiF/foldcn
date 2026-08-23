import { Popover as FoldkitPopover } from '@foldkit/ui'
import type { AnchorConfig } from '@foldkit/ui/popover'
import { Option, Schema as S } from 'effect'
import * as Command from 'foldkit/command'
import type { Html, HtmlBuilder } from 'foldkit/html'
import { defineMessageUnion } from 'foldkit/message'

type Child = Html | string

import { cn } from '@/lib/utils'

// NavigationMenu is a top-level nav bar. `NavigationMenu` is the container
// (`nav`); sub-builders are attached as properties: `.list`, `.item`,
// `.link`, `.trigger`, `.content` (fully presentational, for hand-rolled
// composition) and `.dropdown` (stateful — see below).
//
// `.dropdown` embeds one @foldkit/ui Popover submodel per item, keyed by
// id. Popover already supplies click-toggle, outside-click/Escape
// dismissal, and focus management — the nav menu doesn't reimplement any
// of that; `update` only adds "opening one item's dropdown closes any
// other open one," since a nav bar shows at most one dropdown at a time.
//
// foldcn gaps vs upstream: no shared/animated Viewport (Radix's single
// morphing panel with a slide-direction indicator) — each dropdown is its
// own independently-anchored Popover panel instead. cn-navigation-menu-item
// is an intentional no-op hook upstream.

export const Model = S.Struct({
  popovers: S.Record(S.String, FoldkitPopover.Model),
})
export type Model = typeof Model.Type

/** Creates an initial nav-menu model with one closed Popover per given item id. */
export const init = (itemIds: ReadonlyArray<string>): Model => ({
  popovers: Object.fromEntries(
    itemIds.map((id) => [id, FoldkitPopover.init({ id, isAnimated: true })]),
  ),
})

export const Message = defineMessageUnion({
  GotItemMessage: { id: S.String, message: FoldkitPopover.Message },
})
export type Message = typeof Message.Type

export const OutMessage = defineMessageUnion({
  Opened: { id: S.String },
  Closed: { id: S.String },
})
export type OutMessage = typeof OutMessage.Type

type UpdateReturn = readonly [
  Model,
  ReadonlyArray<Command.Command<Message>>,
  Option.Option<OutMessage>,
]

/** Derives upstream's data-side from a foldkit anchor placement
 *  ("bottom-start" → "bottom"). Logical sides have no foldkit equivalent. */
const placementToSide = (placement: string): string => placement.split('-')[0] || 'bottom'

const toItemMessage =
  (id: string) =>
  (message: FoldkitPopover.Message): Message =>
    Message.GotItemMessage({ id, message })

/** Processes a nav-menu message. Opening one item's popover force-closes any
 *  other currently-open item, so at most one dropdown shows at a time. */
export const update = (model: Model, message: Message): UpdateReturn => {
  const { id, message: popoverMessage } = message
  const current = model.popovers[id]
  if (current === undefined) {
    return [model, [], Option.none()]
  }

  const [nextPopover, popoverCommands, outMessage] = FoldkitPopover.update(current, popoverMessage)
  const justOpened = Option.isSome(outMessage) && outMessage.value._tag === 'Opened'

  if (!justOpened) {
    return [
      { popovers: { ...model.popovers, [id]: nextPopover } },
      Command.mapMessages(popoverCommands, toItemMessage(id)),
      Option.map(outMessage, (out) =>
        out._tag === 'Opened' ? OutMessage.Opened({ id }) : OutMessage.Closed({ id }),
      ),
    ]
  }

  const closedOthers = Object.entries(model.popovers).flatMap(([key, popover]) =>
    key === id || !popover.isOpen ? [] : [[key, FoldkitPopover.close(popover)] as const],
  )

  return [
    {
      popovers: {
        ...model.popovers,
        [id]: nextPopover,
        ...Object.fromEntries(closedOthers.map(([key, [closedPopover]]) => [key, closedPopover])),
      },
    },
    [
      ...Command.mapMessages(popoverCommands, toItemMessage(id)),
      ...closedOthers.flatMap(([key, [, closeCommands]]) =>
        Command.mapMessages(closeCommands, toItemMessage(key)),
      ),
    ],
    Option.some(OutMessage.Opened({ id })),
  ]
}

export const navigationMenuClass =
  'cn-navigation-menu group/navigation-menu relative flex max-w-max flex-1 items-center justify-center'

export const navigationMenuListClass =
  'cn-navigation-menu-list flex flex-1 list-none items-center justify-center'

export const navigationMenuItemClass = 'cn-navigation-menu-item'

/** Upstream link token string; data-active is foldkit's attr name. */
export const navigationMenuLinkClass = 'cn-navigation-menu-link'

/** Upstream trigger component + token strings. */
export const navigationMenuTriggerClass =
  'cn-navigation-menu-trigger group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center outline-none disabled:pointer-events-none'

/** Self-contained card look (background, border, shadow) and enter/leave
 *  animation — not gated behind an upstream `data-viewport` ancestor flag,
 *  since that requires the panel to render as a direct DOM descendant of
 *  the `nav`, which the embedding Popover's `h.submodel` boundary doesn't
 *  guarantee. Mirrors `popoverContentClass` (same `data-enter`/`data-leave`
 *  attributes, the same names Popover's view actually emits). Positioning
 *  comes from the Popover's Floating UI anchor, not from position utilities
 *  here. Switching between items closes the old popover and opens the new
 *  one in the same update, so their leave/enter animations run at once —
 *  a crossfade between dropdowns, not a hard cut. */
export const navigationMenuContentClass =
  'z-50 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 data-enter:animate-in data-leave:animate-out data-leave:fade-out-0 data-enter:fade-in-0 data-leave:zoom-out-95 data-enter:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 duration-100 origin-(--transform-origin) outline-hidden'

export const navigationMenuViewportClass = 'cn-navigation-menu-positioner isolate z-50'

export const NAVIGATION_MENU_ANCHOR: AnchorConfig = { placement: 'bottom', gap: 8 }

type StyleConfig = Readonly<{ className?: string }>

const navigationMenuContainer = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.nav(
    [
      h.Class(cn(navigationMenuClass, config.className)),
      h.DataAttribute('slot', 'navigation-menu'),
    ],
    children,
  )

const navigationMenuList = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.ul(
    [h.Class(cn(navigationMenuListClass)), h.DataAttribute('slot', 'navigation-menu-list')],
    children,
  )

const navigationMenuItem = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.li(
    [h.Class(cn(navigationMenuItemClass)), h.DataAttribute('slot', 'navigation-menu-item')],
    children,
  )

const navigationMenuLink = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.a(
    [
      h.Class(cn(navigationMenuLinkClass, config.className)),
      h.DataAttribute('slot', 'navigation-menu-link'),
    ],
    children,
  )

const navigationMenuTrigger = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.button(
    [
      h.Type('button'),
      h.Class(cn(navigationMenuTriggerClass, config.className)),
      h.DataAttribute('slot', 'navigation-menu-trigger'),
    ],
    children,
  )

const navigationMenuContent = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [
      h.Class(cn(navigationMenuContentClass, config.className)),
      h.DataAttribute('slot', 'navigation-menu-content'),
    ],
    children,
  )

export type DropdownConfig = Readonly<{
  id: string
  trigger: Child
  anchor?: AnchorConfig
  triggerClass?: string
  contentClass?: string
}>

/** A stateful nav item: trigger button + Popover-backed dropdown panel.
 *  `model` is this nav menu's `Model` (usually a field on the consumer's own
 *  state); `toParentMessage` maps this module's `Message` into the
 *  consumer's own message type, the same way `h.submodel`'s callers do
 *  elsewhere. Requires `id` to have been passed to `init`. */
const navigationMenuDropdown = <M>(
  config: DropdownConfig,
  content: ReadonlyArray<Child>,
  model: Model,
  toParentMessage: (message: Message) => M,
  h: HtmlBuilder<M>,
): Html => {
  const popoverModel = model.popovers[config.id]
  if (popoverModel === undefined) {
    throw new Error(
      `NavigationMenu.dropdown: unknown item id "${config.id}" — pass it to NavigationMenu.init.`,
    )
  }
  const anchor = config.anchor ?? NAVIGATION_MENU_ANCHOR
  return h.submodel({
    slotId: config.id,
    model: popoverModel,
    view: FoldkitPopover.view,
    viewInputs: {
      anchor,
      toView: ({ button, panel, isVisible }) =>
        h.li(
          [h.Class(cn(navigationMenuItemClass)), h.DataAttribute('slot', 'navigation-menu-item')],
          [
            h.button(
              [
                ...button,
                h.Class(cn(navigationMenuTriggerClass, config.triggerClass)),
                h.DataAttribute('slot', 'navigation-menu-trigger'),
              ],
              [config.trigger],
            ),
            ...(isVisible
              ? [
                  h.div(
                    [
                      ...panel,
                      h.Class(cn(navigationMenuContentClass, config.contentClass)),
                      h.DataAttribute('slot', 'navigation-menu-content'),
                      h.DataAttribute('side', placementToSide(anchor.placement ?? 'bottom')),
                    ],
                    content,
                  ),
                ]
              : []),
          ],
        ),
    },
    toParentMessage: (message) => toParentMessage(Message.GotItemMessage({ id: config.id, message })),
  })
}

/** Composable navigation menu — `NavigationMenu` is the container, with
 *  sub-builders as properties: `NavigationMenu.list`, `NavigationMenu.item`,
 *  `NavigationMenu.link`, `NavigationMenu.trigger`, `NavigationMenu.content`
 *  (presentational), and `NavigationMenu.dropdown` (stateful, Popover-backed). */
export const NavigationMenu = Object.assign(navigationMenuContainer, {
  list: navigationMenuList,
  item: navigationMenuItem,
  link: navigationMenuLink,
  trigger: navigationMenuTrigger,
  content: navigationMenuContent,
  dropdown: navigationMenuDropdown,
})
