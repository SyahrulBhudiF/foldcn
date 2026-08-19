import type { Html, HtmlBuilder } from 'foldkit/html'

import * as Demo from '../demo'
import { type DemoItemName, hasDemo } from '../demo/view'
import { itemByName } from '../catalog'
import type { Item } from '../catalog/types'
import { GotDemoMessage, type Message } from '../message'
import type { Model } from '../model'

import { codeBlock, installTabs } from './chrome'
import { notFoundView } from './home'

const categoryLabel = (category: Item['category']): string =>
  ({ Base: 'Base', Lib: 'Lib', Components: 'Components', Blocks: 'Blocks' })[category]

const dependencyChips = (
  h: HtmlBuilder<Message>,
  dependencies: ReadonlyArray<string> | undefined,
): ReadonlyArray<Html> =>
  (dependencies ?? []).map((dependency) =>
    h.code(
      [h.Class('rounded bg-muted/60 px-1.5 py-0.5 font-mono text-xs text-muted-foreground')],
      [dependency],
    ),
  )



export const itemPage = (model: Model, name: string, h: HtmlBuilder<Message>): Html => {
  const item = itemByName[name]
  if (item === undefined) return notFoundView(h)

  const demoName: DemoItemName | undefined = hasDemo(item.name) ? item.name : undefined

  return h.div(
    [h.Class('flex-1')],
    [
      h.div(
        [h.Class('mx-auto w-full max-w-4xl px-4 py-12 sm:px-6')],
        [
          // breadcrumb
          h.nav(
            [h.Class('mb-6 flex items-center gap-2 text-sm text-muted-foreground')],
            [
              h.a([h.Href('/'), h.Class('transition-colors hover:text-foreground')], ['Registry']),
              h.span([], ['/']),
              h.span([h.Class('text-foreground')], [categoryLabel(item.category)]),
              h.span([], ['/']),
              h.span([], [item.title]),
            ],
          ),

          // title
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              h.h1([h.Class('text-3xl font-bold tracking-tight sm:text-4xl')], [item.title]),
              h.span(
                [
                  h.Class(
                    'rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground',
                  ),
                ],
                [item.type],
              ),
            ],
          ),
          h.p([h.Class('mt-4 text-pretty text-muted-foreground')], [item.description]),

          // dependencies
          ...(item.maybeDependencies && item.maybeDependencies.length > 0
            ? [
                h.div(
                  [h.Class('mt-4 flex flex-wrap items-center gap-1.5')],
                  [
                    h.span(
                      [h.Class('text-xs font-medium text-muted-foreground')],
                      ['Dependencies:'],
                    ),
                    ...dependencyChips(h, item.maybeDependencies),
                  ],
                ),
              ]
            : []),

          // preview
          ...(demoName !== undefined
            ? [
                h.div(
                  [h.Class('mt-10 overflow-hidden rounded-xl border border-border bg-background')],
                  [
                    h.div(
                      [
                        h.Class(
                          'flex items-center justify-between border-b border-border px-4 py-2.5',
                        ),
                      ],
                      [
                        h.span([h.Class('text-xs font-medium text-muted-foreground')], ['Preview']),
                        h.span(
                          [h.Class('flex items-center gap-1.5 text-xs text-muted-foreground')],
                          ['Interactive demo'],
                        ),
                      ],
                    ),
                    h.div(
                      [h.Class('flex min-h-[260px] items-center justify-center p-6')],
                      [
                        h.submodel({
                          slotId: 'demo-harness',
                          model: model.demo,
                          view: Demo.view,
                          viewInputs: { itemName: demoName! },
                          toParentMessage: (message) => GotDemoMessage({ message }),
                        }),
                      ],
                    ),
                  ],
                ),
              ]
            : []),

          // install
          h.div(
            [h.Class('mt-12')],
            [
              h.h2([h.Class('text-lg font-semibold tracking-tight')], ['Installation']),
              h.p(
                [h.Class('mt-2 mb-3 text-sm text-muted-foreground')],
                ['Add this component to your project:'],
              ),
              installTabs(h, model, item.name),
            ],
          ),

          // source
          ...(item.maybeSource
            ? [
                h.div(
                  [h.Class('mt-12')],
                  [
                    h.h2([h.Class('text-lg font-semibold tracking-tight')], ['Source']),
                    h.p(
                      [h.Class('mt-2 mb-3 text-sm text-muted-foreground')],
                      [
                        'The component ships as plain source — no build step, no wrapper. Copy it and make it yours.',
                      ],
                    ),
                    codeBlock(h, model, item.maybeSource.path, item.maybeSource.code),
                  ],
                ),
              ]
            : []),
        ],
      ),
    ],
  )
}
