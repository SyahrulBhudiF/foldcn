import { Option } from 'effect'
import { Schema as S } from 'effect'
import { Subscription, Update } from 'foldkit'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import {
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Frame,
  GalleryVerticalEnd,
  Map,
  MoreHorizontal,
  PieChart,
  Settings2,
  Sparkles,
  SquareTerminal,
} from 'lucide'

import { icon } from '../../generated/registry/lib/icons'
import * as Sidebar from '../../generated/registry/ui/sidebar'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const Message = defineMessageUnion({
  GotSidebarMessage: { message: Sidebar.Message },
})

// Mimics apps/v4/examples/base/sidebar-demo.tsx (the flagship Team
// Switcher + collapsible Platform + Projects w/ actions + User footer
// shell). Kept static (sub-menus always expanded; dropdowns shown as
// affordances only) so the demo stays a single-slice shell demo — the
// interactive behavior it exercises is collapse/expand, rail, keyboard
// shortcut and mobile sheet.
// See also sidebar-group.tsx / sidebar-menu*.tsx for the smaller
// sub-part variants this demo composites.

export const sidebarView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  h.div(
    [h.Class('flex w-full flex-col gap-0 bg-background')],
    [
      h.p(
        [h.Class('px-4 pb-3 pt-1 text-xs text-muted-foreground')],
        [
          'Collapsible app shell — toggle with the header button, the rail hot-spot, or ',
          h.kbd([h.Class('rounded border bg-muted px-1 font-mono text-[11px]')], ['⌘B']),
          '. Collapse it, reload the page, and the demo restores the saved state from its cookie. Resize below the md breakpoint for the mobile sheet.',
        ],
      ),
      h.div(
        [
          h.Class('relative flex h-[520px] w-full overflow-hidden rounded-lg border bg-background'),
          h.Style({ transform: 'translateZ(0)' }),
        ],
        [
          h.submodel({
            slotId: 'sidebar-demo',
            model: model.sidebar,
            view: Sidebar.SidebarProvider.view,
            viewInputs: {
              side: 'left',
              variant: 'inset',
              collapsible: 'icon',
              // Inside the 420px preview card the upstream `min-h-svh`
              // / `h-svh` (viewport units) overflow. Override to `h-full`
              // so the shell is contained by the transformed preview box.
              className:
                '!min-h-0 !h-full [&_[data-slot=sidebar]]:!h-full [&_[data-slot=sidebar-container]]:!h-full',
              content: () => [
                Sidebar.header({}, [teamSwitcher(h)], h),
                Sidebar.content({}, [navMain(h), navProjects(h), secondarySupportGroup(h)], h),
                Sidebar.footer({}, [navUser(h)], h),
                Sidebar.rail(
                  [h.OnClick(Message.GotSidebarMessage({ message: Sidebar.Message.Toggled() }))],
                  {},
                  h,
                ),
              ],
              children: (slots) => [
                Sidebar.SidebarInset(
                  {},
                  [
                    h.header(
                      [
                        h.Class(
                          'flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12',
                        ),
                      ],
                      [
                        h.div(
                          [h.Class('flex items-center gap-2 px-4')],
                          [
                            Sidebar.trigger(
                              [
                                h.OnClick(
                                  Message.GotSidebarMessage({ message: Sidebar.Message.Toggled() }),
                                ),
                              ],
                              {},
                              h,
                            ),
                            Sidebar.separator({ className: '-ml-px mr-2 h-4' }, h),
                            h.span(
                              [h.Class('text-sm font-medium')],
                              [
                                slots.state === 'collapsed'
                                  ? 'Collapsed — hover the icons or press ⌘B'
                                  : 'Acme Inc — Playground / Starred',
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                    h.div(
                      [h.Class('flex flex-1 flex-col gap-4 p-4 pt-0')],
                      [
                        h.div(
                          [h.Class('grid auto-rows-min gap-4 md:grid-cols-2')],
                          [
                            h.div([h.Class('rounded-xl bg-muted/50 p-6')], []),
                            h.div([h.Class('rounded-xl bg-muted/50 p-6')], []),
                          ],
                        ),
                        h.div([h.Class('min-h-[160px] flex-1 rounded-xl bg-muted/50')], []),
                      ],
                    ),
                  ],
                  h,
                ),
              ],
            },
            toParentMessage: (message) => Message.GotSidebarMessage({ message }),
          }),
        ],
      ),
    ],
  )

const teamSwitcher = (h: HtmlBuilder<AppMessage>): Html =>
  Sidebar.menu(
    {},
    [
      Sidebar.menuItem(
        {},
        [
          Sidebar.menuButton(
            {
              size: 'lg',
              className:
                'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
            },
            [
              h.div(
                [
                  h.Class(
                    'flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground',
                  ),
                ],
                [icon(h, GalleryVerticalEnd, 'size-4')],
              ),
              h.div(
                [h.Class('grid flex-1 text-left text-sm leading-tight')],
                [
                  h.span([h.Class('truncate font-medium')], ['Acme Inc']),
                  h.span([h.Class('truncate text-xs')], ['Enterprise']),
                ],
              ),
              icon(h, ChevronsUpDown, 'ml-auto'),
            ],
            h,
          ),
        ],
        h,
      ),
    ],
    h,
  )

const navMain = (h: HtmlBuilder<AppMessage>): Html =>
  h.div(
    [],
    [
      Sidebar.group(
        {},
        [
          Sidebar.groupLabel({}, ['Platform'], h),
          Sidebar.menu(
            {},
            [
              collapsibleMenuRow({
                title: 'Playground',
                icon: SquareTerminal,
                isActive: true,
                subItems: ['History', 'Starred', 'Settings'],
                h,
              }),
              collapsibleMenuRow({
                title: 'Models',
                icon: Bot,
                subItems: ['Genesis', 'Explorer', 'Quantum'],
                h,
              }),
              collapsibleMenuRow({
                title: 'Documentation',
                icon: BookOpen,
                subItems: ['Introduction', 'Get Started', 'Tutorials', 'Changelog'],
                h,
              }),
              collapsibleMenuRow({
                title: 'Settings',
                icon: Settings2,
                subItems: ['General', 'Team', 'Billing', 'Limits'],
                h,
              }),
            ],
            h,
          ),
        ],
        h,
      ),
    ],
  )

const collapsibleMenuRow = (config: {
  title: string
  icon: Parameters<typeof icon>[1]
  isActive?: boolean
  subItems: ReadonlyArray<string>
  h: HtmlBuilder<AppMessage>
}): Html =>
  // Static open mimic: no Collapsible helper wired — the submenu is
  // always rendered, matching the defaultOpen={isActive} of the
  // upstream example. Keeps the demo single-slice.
  Sidebar.menuItem(
    {},
    [
      Sidebar.menuButton(
        { isActive: config.isActive },
        [
          icon(config.h, config.icon),
          config.h.span([], [config.title]),
          icon(
            config.h,
            ChevronRight,
            'ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90',
          ),
        ],
        config.h,
      ),
      Sidebar.menuSub(
        {},
        config.subItems.map((label) =>
          Sidebar.menuSubItem(
            {},
            [
              Sidebar.menuSubButton(
                [],
                { isActive: label === 'Starred' },
                [config.h.span([], [label])],
                config.h,
              ),
            ],
            config.h,
          ),
        ),
        config.h,
      ),
    ],
    config.h,
  )

const navProjects = (h: HtmlBuilder<AppMessage>): Html =>
  Sidebar.group(
    { className: 'group-data-[collapsible=icon]:hidden' },
    [
      Sidebar.groupLabel({}, ['Projects'], h),
      Sidebar.menu(
        {},
        [
          projectRow(Frame, 'Design Engineering', h),
          projectRow(PieChart, 'Sales & Marketing', h),
          projectRow(Map, 'Travel', h),
          Sidebar.menuItem(
            {},
            [
              Sidebar.menuButton(
                { className: 'text-sidebar-foreground/70' },
                [icon(h, MoreHorizontal, 'text-sidebar-foreground/70'), h.span([], ['More'])],
                h,
              ),
            ],
            h,
          ),
        ],
        h,
      ),
    ],
    h,
  )

const projectRow = (
  iconNode: Parameters<typeof icon>[1],
  label: string,
  h: HtmlBuilder<AppMessage>,
): Html =>
  Sidebar.menuItem(
    {},
    [
      Sidebar.menuButton({}, [icon(h, iconNode), h.span([], [label])], h),
      Sidebar.menuAction(
        [],
        { showOnHover: true },
        [icon(h, MoreHorizontal), h.span([h.Class('sr-only')], ['More'])],
        h,
      ),
    ],
    h,
  )

const secondarySupportGroup = (h: HtmlBuilder<AppMessage>): Html =>
  Sidebar.group(
    { className: 'group-data-[collapsible=icon]:hidden' },
    [
      Sidebar.groupLabel({}, ['Support'], h),
      Sidebar.menu(
        {},
        [
          Sidebar.menuItem(
            {},
            [Sidebar.menuButton({}, [icon(h, Sparkles), h.span([], ['What\u2019s new'])], h)],
            h,
          ),
          Sidebar.menuItem(
            {},
            [Sidebar.menuButton({}, [icon(h, Settings2), h.span([], ['Settings'])], h)],
            h,
          ),
        ],
        h,
      ),
    ],
    h,
  )

const navUser = (h: HtmlBuilder<AppMessage>): Html =>
  Sidebar.menu(
    {},
    [
      Sidebar.menuItem(
        {},
        [
          Sidebar.menuButton(
            {
              size: 'lg',
              className:
                'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
            },
            [
              h.span(
                [
                  h.Class(
                    'flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold',
                  ),
                ],
                ['CN'],
              ),
              h.div(
                [h.Class('grid flex-1 text-left text-sm leading-tight')],
                [
                  h.span([h.Class('truncate font-medium')], ['shadcn']),
                  h.span([h.Class('truncate text-xs')], ['m@example.com']),
                ],
              ),
              icon(h, ChevronsUpDown, 'ml-auto size-4'),
            ],
            h,
          ),
        ],
        h,
      ),
    ],
    h,
  )

const fields = { sidebar: Sidebar.Model }
const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

const foldSidebar = Update.foldChild({
  update: Sidebar.update,
  read: (model: State) => Option.some(model.sidebar),
  write: (model, next) => evo(model, { sidebar: () => next }),
  toParentMessage: (message) => Message.GotSidebarMessage({ message }),
})

export const subscriptions = Subscription.lift(Sidebar.subscriptions)<
  State,
  typeof Message.GotSidebarMessage.Type
>({
  toChildModel: (model) => model.sidebar,
  toParentMessage: (message) => Message.GotSidebarMessage({ message }),
})

export const slice = defineSlice({
  fields,
  init: {
    sidebar: Sidebar.init({
      id: 'sidebar-demo',
      defaultOpen: true,
      cookieName: 'foldcn-sidebar-demo',
    }),
  },
  messages: [Message.GotSidebarMessage],
  handlers: (model: State) => ({
    GotSidebarMessage: (payload: typeof Message.GotSidebarMessage.Type): UpdateReturn =>
      foldSidebar(model, payload.message),
  }),
  samples: [Message.GotSidebarMessage({ message: Sidebar.Message.Toggled() })],
  subscriptions,
})
