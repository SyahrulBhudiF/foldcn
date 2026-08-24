import { Popover as FoldkitPopover } from '@foldkit/ui'
import type { AnchorConfig } from '@foldkit/ui/popover'
import { Option, Schema as S } from 'effect'
import * as Command from 'foldkit/command'
import type { Html, HtmlBuilder } from 'foldkit/html'
import { defineMessageUnion } from 'foldkit/message'

type Child = Html | string

import { cn } from '@/lib/utils'
import { placementToSide } from './popover'

// NavigationMenu is a top-level nav bar. `NavigationMenu` is the container
// (`nav`); sub-builders are attached as properties: `.list`, `.item`,
// `.link` (fully presentational, for static links) and `dropdownViewInputs`
// (stateful — see below).
//
// `dropdownViewInputs` builds the `ViewInputs` for one @foldkit/ui Popover
// submodel per item, keyed by id; the consumer wires it up with `h.submodel`
// themselves, the same way `Menubar.viewInputs`/`HoverCard.styledViewInputs`
// do — this keeps `h.submodel`, `model`, and `toParentMessage` visible at the
// call site instead of hidden behind a bespoke `(config, children, model,
// toParentMessage, h)` signature. Popover already supplies click-toggle,
// outside-click/Escape dismissal, and focus management — the nav menu
// doesn't reimplement any of that; `update` only adds "opening one item's
// dropdown closes any other open one," since a nav bar shows at most one
// dropdown at a time.
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

/** Re-export of the underlying Popover submodel's `view`, for `h.submodel`
 *  calls built from `dropdownViewInputs`. */
export const view = FoldkitPopover.view

type UpdateReturn = readonly [
  Model,
  ReadonlyArray<Command.Command<Message>>,
  Option.Option<OutMessage>,
]

/** Looks up the Popover model for `id`, throwing a message that names the
 *  bad id and the ids that were actually passed to `init` — the mismatch is
 *  otherwise easy to miss until the dropdown silently never opens. */
export const getPopover = (model: Model, id: string): FoldkitPopover.Model => {
  const popover = model.popovers[id]
  if (popover === undefined) {
    const knownIds = Object.keys(model.popovers)
    throw new Error(
      `NavigationMenu: unknown item id "${id}" — add it to the array passed to NavigationMenu.init. ` +
        `Known ids: ${knownIds.length > 0 ? knownIds.join(', ') : '(none — init was called with an empty array)'}.`,
    )
  }
  return popover
}

const toItemMessage =
  (id: string) =>
  (message: FoldkitPopover.Message): Message =>
    Message.GotItemMessage({ id, message })

/** Processes a nav-menu message. Opening one item's popover force-closes any
 *  other currently-open item, so at most one dropdown shows at a time.
 *  That auto-close is silent: only the newly opened id's `OutMessage.Opened`
 *  is emitted, the siblings are closed purely via commands with no matching
 *  `Closed` out message, so don't expect one for the item that got bumped. */
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

export const NAVIGATION_MENU_ANCHOR: AnchorConfig = { placement: 'bottom', gap: 8, padding: 8 }

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

export type DropdownConfig = Readonly<{
  id: string
  trigger: Child
  anchor?: AnchorConfig
  triggerClass?: string
  contentClass?: string
}>

/** Builds a Popover `ViewInputs` for one nav-item's trigger + dropdown
 *  panel. The consumer owns `h.submodel` (model: `NavigationMenu.getPopover(model, config.id)`,
 *  view: `FoldkitPopover.view`) and the surrounding `<li>` — wrap the
 *  `h.submodel` call in `NavigationMenu.item` yourself, the same way
 *  `Menubar.viewInputs`/`HoverCard.styledViewInputs` leave their wrapping
 *  markup to the caller instead of hiding it behind a bespoke signature. */
export const dropdownViewInputs = <M>(
  config: DropdownConfig,
  content: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): FoldkitPopover.ViewInputs => {
  const anchor = config.anchor ?? NAVIGATION_MENU_ANCHOR
  return {
    anchor,
    toView: ({ button, panel, isVisible }) =>
      h.div(
        [h.Class('contents')],
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
  }
}

/** Composable navigation menu — `NavigationMenu` is the container, with
 *  sub-builders as properties: `NavigationMenu.list`, `NavigationMenu.item`,
 *  `NavigationMenu.link` (presentational). Build a stateful dropdown item
 *  with `dropdownViewInputs` + `h.submodel` + `NavigationMenu.item`. */
export const NavigationMenu = Object.assign(navigationMenuContainer, {
  list: navigationMenuList,
  item: navigationMenuItem,
  link: navigationMenuLink,
})
