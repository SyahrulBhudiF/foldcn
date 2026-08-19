import { Option } from 'effect'
import type { Html, HtmlBuilder } from 'foldkit/html'

import * as Demo from '../demo'
import { itemByName } from '../catalog'
import type { Item } from '../catalog/types'
import { GotDemoMessage, type Message } from '../message'
import type { Model } from '../model'
import { checkIcon } from '../site-icons'
import { codeBlock, installLine } from './chrome'
import { notFoundView } from './home'

type CssVars = Readonly<{
  light?: Record<string, string>
  dark?: Record<string, string>
}>

const cssVarsOf = (item: Item): CssVars => {
  const raw = item.maybeTheme as
    | { theme?: CssVars; light?: Record<string, string>; dark?: Record<string, string> }
    | undefined
  if (raw === undefined) return {}
  return {
    light: raw.theme?.light ?? raw.light,
    dark: raw.theme?.dark ?? raw.dark,
  }
}

/** Tokens worth rendering as swatches (skip raw colors the theme maps, fonts). */
const SWATCH_EXCLUDE = new Set(['--font-sans', '--font-mono'])

const swatch = (
  h: HtmlBuilder<Message>,
  token: string,
  value: string,
): Html => {
  const [key, hsl] = [token, value]
  return h.div(
    [h.Class('flex flex-col gap-2')],
    [
      h.div(
        [
          h.Class('h-12 w-full rounded-md border border-border'),
          h.Style({ background: `hsl(${hsl})` }),
        ],
        [],
      ),
      h.code([h.Class('truncate font-mono text-[11px] text-muted-foreground')], [key]),
      h.code([h.Class('truncate font-mono text-[11px] text-muted-foreground')], [hsl]),
    ],
  )
}

const themeSwatches = (item: Item, h: HtmlBuilder<Message>): Html => {
  const vars = cssVarsOf(item)
  const renderTokens = (tokens: Record<string, string> | undefined, label: string): Html =>
    h.div([h.Class('flex-1')], [
      h.h3([h.Class('mb-4 text-sm font-semibold')], [label]),
      h.div(
        [h.Class('grid grid-cols-2 gap-3 sm:grid-cols-3')],
        Object.entries(tokens ?? {})
          .filter(([token]) => !SWATCH_EXCLUDE.has(token))
          .map(([token, value]) => swatch(h, token, value)),
      ),
    ])

  return h.div([h.Class('grid gap-8 lg:grid-cols-2')], [
    renderTokens(vars.light, 'Light'),
    renderTokens(vars.dark, 'Dark'),
  ])
}

const categoryLabel = (category: Item['category']): string =>
  ({ Base: 'Base', Lib: 'Lib', Components: 'Components', Blocks: 'Blocks' })[category]

const dependencyChips = (
  h: HtmlBuilder<Message>,
  dependencies: ReadonlyArray<string> | undefined,
): ReadonlyArray<Html> =>
  (dependencies ?? []).map(dependency =>
    h.code(
      [h.Class('rounded bg-muted/60 px-1.5 py-0.5 font-mono text-xs text-muted-foreground')],
      [dependency],
    ),
  )

type PreviewKind = 'demo' | 'swatches' | 'none'

const previewKindOf = (name: string): PreviewKind =>
  name === 'foldcn' ? 'swatches' : name === 'utils' ? 'none' : 'demo'

export const itemPage = (
  model: Model,
  name: string,
  h: HtmlBuilder<Message>,
): Html => {
  const item = itemByName[name]
  if (item === undefined) return notFoundView(h)

  const previewKind = previewKindOf(item.name)

  return h.div([h.Class('flex-1')], [
    h.div([h.Class('mx-auto w-full max-w-4xl px-4 py-12 sm:px-6')], [
      // breadcrumb
      h.nav([h.Class('mb-6 flex items-center gap-2 text-sm text-muted-foreground')], [
        h.a([h.Href('/'), h.Class('transition-colors hover:text-foreground')], ['Registry']),
        h.span([], ['/']),
        h.span([h.Class('text-foreground')], [categoryLabel(item.category)]),
        h.span([], ['/']),
        h.span([], [item.title]),
      ]),

      // title
      h.div([h.Class('flex flex-wrap items-center gap-2')], [
        h.h1([h.Class('text-3xl font-bold tracking-tight sm:text-4xl')], [item.title]),
        h.span([h.Class('rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground')], [item.type]),
      ]),
      h.p([h.Class('mt-4 text-pretty text-muted-foreground')], [item.description]),

      // dependencies
      ...(item.maybeDependencies && item.maybeDependencies.length > 0
        ? [
            h.div([h.Class('mt-4 flex flex-wrap items-center gap-1.5')], [
              h.span([h.Class('text-xs font-medium text-muted-foreground')], ['Dependencies:']),
              ...dependencyChips(h, item.maybeDependencies),
            ]),
          ]
        : []),

      // preview
      ...(previewKind !== 'none'
        ? [
            h.div([h.Class('mt-10 overflow-hidden rounded-xl border border-border bg-background')], [
              h.div([h.Class('flex items-center justify-between border-b border-border px-4 py-2.5')], [
                h.span([h.Class('text-xs font-medium text-muted-foreground')], ['Preview']),
                h.span([h.Class('flex items-center gap-1.5 text-xs text-muted-foreground')], [
                  checkIcon(h, 'size-3.5'),
                  previewKind === 'swatches' ? 'Theme tokens' : 'Interactive demo',
                ]),
              ]),
              h.div(
                [h.Class('flex min-h-[260px] items-center justify-center p-6')],
                previewKind === 'swatches'
                  ? [ themeSwatches(item, h) ]
                  : [
                      h.submodel({
                        slotId: 'demo-harness',
                        model: model.demo,
                        view: Demo.view,
                        viewInputs: { itemName: item.name },
                        toParentMessage: message => GotDemoMessage({ message }),
                      }),
                    ],
              ),
            ]),
          ]
        : []),

      // install
      h.div([h.Class('mt-12')], [
        h.h2([h.Class('text-lg font-semibold tracking-tight')], ['Installation']),
        h.p([h.Class('mt-2 mb-3 text-sm text-muted-foreground')], [
          'Add this component to your project:',
        ]),
        installLine(h, model, item.install),
      ]),

      // source
      ...(item.maybeSource
        ? [
            h.div([h.Class('mt-12')], [
              h.h2([h.Class('text-lg font-semibold tracking-tight')], ['Source']),
              h.p([h.Class('mt-2 mb-3 text-sm text-muted-foreground')], [
                'The component ships as plain source — no build step, no wrapper. Copy it and make it yours.',
              ]),
              codeBlock(h, model, item.maybeSource.path, item.maybeSource.code),
            ]),
          ]
        : []),
    ]),
  ])
}