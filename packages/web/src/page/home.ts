import type { Html, HtmlBuilder } from 'foldkit/html'

import { categoryGroups, componentCount } from '../catalog'
import type { Item } from '../catalog/types'
import { arrowRightIcon } from '../site-icons'
import type { Message } from '../message'
import type { Model } from '../model'
import { installTabs } from './chrome'

const card = (item: Item, h: HtmlBuilder<Message>): Html =>
  h.a(
    [
      h.Href(`/components/${item.name}`),
      h.Class(
        'group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:shadow-sm',
      ),
    ],
    [
      h.div(
        [h.Class('flex items-center justify-between gap-3')],
        [
          h.span(
            [h.Class('rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground')],
            [item.type],
          ),
          arrowRightIcon(
            h,
            'size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground',
          ),
        ],
      ),
      h.span([h.Class('text-lg font-semibold tracking-tight')], [item.title]),
      h.p([h.Class('line-clamp-2 text-sm text-muted-foreground')], [item.description]),
      h.code(
        [h.Class('truncate rounded bg-muted/50 px-2 py-1 font-mono text-xs text-muted-foreground')],
        [item.install],
      ),
    ],
  )

export const homeView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex-1')],
    [
      // hero
      h.section(
        [h.Class('border-b border-border')],
        [
          h.div(
            [h.Class('mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24')],
            [
              h.div(
                [h.Class('mx-auto max-w-3xl text-center')],
                [
                  h.span(
                    [
                      h.Class(
                        'inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground',
                      ),
                    ],
                    ['The registry for Foldkit'],
                  ),
                  h.h1(
                    [h.Class('mt-6 text-balance text-4xl font-bold tracking-tight sm:text-6xl')],
                    [
                      'Copy-paste UI components for ',
                      h.span([h.Class('text-primary')], ['Foldkit.']),
                    ],
                  ),
                  h.p(
                    [h.Class('mt-6 text-pretty text-lg text-muted-foreground')],
                    [
                      'A shadcn-style registry of ',
                      String(componentCount),
                      ' accessible components and blocks — built with @foldkit/ui and Tailwind CSS v4. Add one command, then own the source.',
                    ],
                  ),
                  h.div([h.Class('mx-auto mt-10 max-w-xl')], [installTabs(h, model, 'foldcn')]),
                  h.p(
                    [h.Class('mt-4 text-sm text-muted-foreground')],
                    [
                      'or ',
                      h.a(
                        [
                          h.Href('https://foldkit.dev'),
                          h.Class('underline underline-offset-4 hover:text-foreground'),
                          h.Rel('noopener noreferrer'),
                        ],
                        ['learn Foldkit'],
                      ),
                      ' first.',
                    ],
                  ),
                  h.div(
                    [
                      h.Class(
                        'mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground',
                      ),
                    ],
                    [
                      h.span([], [`${componentCount} components`]),
                      h.span([h.Role('separator'), h.Class('h-4 w-px bg-border')], []),
                      h.span([], ['Foldkit · Elm architecture, no React']),
                      h.span([h.Role('separator'), h.Class('h-4 w-px bg-border')], []),
                      h.span([], ['Tailwind v4']),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),

      // category sections
      ...categoryGroups.map((group) =>
        h.section(
          [h.Class('mx-auto w-full max-w-6xl px-4 py-10 sm:px-6')],
          [
            h.div(
              [h.Class('mb-6 max-w-2xl')],
              [
                h.h2([h.Class('text-2xl font-semibold tracking-tight')], [group.label]),
                h.p([h.Class('mt-2 text-sm text-muted-foreground')], [group.description]),
              ],
            ),
            h.div(
              [h.Class('grid gap-4 sm:grid-cols-2 lg:grid-cols-3')],
              [...group.items.map((item) => card(item, h))],
            ),
          ],
        ),
      ),
    ],
  )

export const notFoundView = (h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Class(
        'mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-32 text-center',
      ),
    ],
    [
      h.h1([h.Class('text-6xl font-bold tracking-tight')], ['404']),
      h.p([h.Class('mt-4 text-muted-foreground')], ['That page could not be found.']),
      h.div(
        [h.Class('mt-6')],
        [
          h.a(
            [
              h.Href('/'),
              h.Class(
                'inline-flex items-center rounded-full border border-border bg-muted/40 px-4 py-1.5 text-sm font-medium text-foreground underline-offset-4 hover:border-primary/40 hover:text-primary',
              ),
            ],
            ['Back to the registry'],
          ),
        ],
      ),
    ],
  )
