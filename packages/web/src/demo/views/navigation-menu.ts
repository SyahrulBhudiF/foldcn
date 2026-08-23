import { Schema as S } from 'effect'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { NavigationMenu } from '@foldcn/registry/styles/default/ui/navigation-menu'
import { icon } from '@foldcn/registry/styles/default/lib/icons'
import { CircleAlert, CircleCheck, CircleDashed } from 'lucide'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

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

export const navigationMenuView = (model: Model, h: HtmlBuilder<Message>): Html =>
  NavigationMenu(
    {},
    [
      NavigationMenu.list(
        {},
        [
          NavigationMenu.item(
            {},
            [
              NavigationMenu.trigger({}, ['Getting started'], h),
              NavigationMenu.content(
                {},
                [
                  h.ul(
                    [h.Class('grid w-96 gap-1')],
                    [
                      navListItem(
                        h,
                        'Introduction',
                        '/docs',
                        'Re-usable components built with Tailwind CSS.',
                      ),
                      navListItem(
                        h,
                        'Installation',
                        '/docs/installation',
                        'How to install dependencies and structure your app.',
                      ),
                      navListItem(
                        h,
                        'Typography',
                        '/docs/primitives/typography',
                        'Styles for headings, paragraphs, lists...etc',
                      ),
                    ],
                  ),
                ],
                h,
              ),
            ],
            h,
          ),
          NavigationMenu.item(
            {},
            [
              NavigationMenu.trigger({}, ['Components'], h),
              NavigationMenu.content(
                {},
                [
                  h.ul(
                    [h.Class('grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]')],
                    COMPONENTS.map((c) => navListItem(h, c.title, c.href, c.description)),
                  ),
                ],
                h,
              ),
            ],
            h,
          ),
          NavigationMenu.item(
            {},
            [
              NavigationMenu.trigger({}, ['With Icon'], h),
              NavigationMenu.content(
                {},
                [
                  h.ul(
                    [h.Class('grid w-[200px] gap-1')],
                    [
                      h.li(
                        [],
                        [
                          NavigationMenu.link({}, [icon(h, CircleAlert, 'size-4'), ' Backlog'], h),
                          NavigationMenu.link({}, [icon(h, CircleDashed, 'size-4'), ' To Do'], h),
                          NavigationMenu.link({}, [icon(h, CircleCheck, 'size-4'), ' Done'], h),
                        ],
                      ),
                    ],
                  ),
                ],
                h,
              ),
            ],
            h,
          ),
          NavigationMenu.item({}, [NavigationMenu.link({}, ['Docs'], h)], h),
        ],
        h,
      ),
    ],
    h,
  )

const navListItem = (
  h: HtmlBuilder<Message>,
  title: string,
  href: string,
  description: string,
): Html =>
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

const fields = {} as const
const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: {},
  messages: [],
  handlers: (_model: State) => ({}),
})
