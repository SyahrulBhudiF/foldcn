import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'
import * as Update from 'foldkit/update'

import * as NavMenu from '@foldcn/registry/styles/default/ui/navigation-menu'
import { icon } from '@foldcn/registry/styles/default/lib/icons'
import { CircleAlert, CircleCheck, CircleDashed } from 'lucide'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const NavigationMenu = NavMenu.NavigationMenu

const Message = defineMessageUnion({
  GotNavigationMenuMessage: { message: NavMenu.Message },
})

// Mirrors apps/v4/examples/base/navigation-menu-demo.tsx (minimal)
const COMPONENTS: ReadonlyArray<{ title: string; href: string; description: string }> = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description: 'A modal dialog that interrupts the user with important content.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description: 'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description: 'Displays an indicator showing the completion progress of a task.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description: 'A set of layered sections of content displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description: 'A popup that displays information related to an element.',
  },
]

const toParentMessage = (message: NavMenu.Message): AppMessage =>
  Message.GotNavigationMenuMessage({ message })

export const navigationMenuView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  NavigationMenu(
    {},
    [
      NavigationMenu.list(
        {},
        [
          NavigationMenu.dropdown(
            { id: 'getting-started', trigger: 'Getting started' },
            [
              h.ul(
                [h.Class('grid w-96 gap-1')],
                [
                  navListItem(h, 'Introduction', '/docs', 'Re-usable components built with Tailwind CSS.'),
                  navListItem(h, 'Installation', '/docs/installation', 'How to install dependencies and structure your app.'),
                  navListItem(h, 'Typography', '/docs/primitives/typography', 'Styles for headings, paragraphs, lists...etc'),
                ],
              ),
            ],
            model.navigationMenu,
            toParentMessage,
            h,
          ),
          NavigationMenu.dropdown(
            { id: 'components', trigger: 'Components' },
            [
              h.ul(
                [h.Class('grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]')],
                COMPONENTS.map((c) => navListItem(h, c.title, c.href, c.description)),
              ),
            ],
            model.navigationMenu,
            toParentMessage,
            h,
          ),
          NavigationMenu.dropdown(
            { id: 'with-icon', trigger: 'With Icon' },
            [
              h.ul(
                [h.Class('grid w-[200px] gap-1')],
                [
                  h.li([], [NavigationMenu.link({}, [icon(h, CircleAlert, 'size-4'), ' Backlog'], h)]),
                  h.li([], [NavigationMenu.link({}, [icon(h, CircleDashed, 'size-4'), ' To Do'], h)]),
                  h.li([], [NavigationMenu.link({}, [icon(h, CircleCheck, 'size-4'), ' Done'], h)]),
                ],
              ),
            ],
            model.navigationMenu,
            toParentMessage,
            h,
          ),
          NavigationMenu.item({}, [NavigationMenu.link({}, ['Docs'], h)], h),
        ],
        h,
      ),
    ],
    h,
  )

const navListItem = (h: HtmlBuilder<AppMessage>, title: string, href: string, description: string): Html =>
  h.li(
    [],
    [
      NavigationMenu.link(
        {},
        [
          h.div(
            [h.Class('flex flex-col gap-1 text-sm')],
            [
              h.div([h.Class('leading-none font-medium')], [title]),
              h.div([h.Class('line-clamp-2 text-muted-foreground')], [description]),
            ],
          ),
        ],
        h,
      ),
    ],
  )

const NAV_ITEM_IDS = ['getting-started', 'components', 'with-icon']

const fields = { navigationMenu: NavMenu.Model }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

const foldNoOp =
  <Out>(): ((out: Out) => Update.Step<State, unknown>) =>
  () =>
  (model) => [model, []]

const foldNavigationMenuOutMessage = M.type<NavMenu.OutMessage>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    Opened: foldNoOp(),
    Closed: foldNoOp(),
  }),
)

const foldNavigationMenu = Update.foldChild({
  update: NavMenu.update,
  read: (model: State) => Option.some(model.navigationMenu),
  write: (model, next) => evo(model, { navigationMenu: () => next }),
  toParentMessage,
  foldOutMessage: foldNavigationMenuOutMessage,
})

export const slice = defineSlice({
  fields,
  init: { navigationMenu: NavMenu.init(NAV_ITEM_IDS) },
  messages: [Message.GotNavigationMenuMessage],
  handlers: (model: State) => ({
    GotNavigationMenuMessage: (payload: typeof Message.GotNavigationMenuMessage.Type): UpdateReturn =>
      foldNavigationMenu(model, payload.message),
  }),
  samples: [],
  // Open/close/dismiss flows entirely through the embedded Popover
  // submodels (click, outside click, Escape); the menu emits no parent
  // commands, so there are no top-level samples.
})
