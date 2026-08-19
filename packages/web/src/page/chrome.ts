import { clsx } from 'clsx'
import { Option } from 'effect'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { codeBlock as registryCodeBlock } from '@foldcn/registry/src/lib/code-block'
import { button } from '@foldcn/registry/src/ui/button'

import { ClickedCopy, SelectedThemePreference, type Message } from '../message'
import type { Model, ThemePreference } from '../model'
import { arrowRightIcon, checkIcon, computerIcon, copyIcon, moonIcon, sunIcon } from '../site-icons'
import { componentCount } from '../catalog'

// --- theme selector ---

const THEME_OPTIONS: ReadonlyArray<{
  preference: ThemePreference
  label: string
  icon: (h: HtmlBuilder<Message>) => Html
}> = [
  { preference: 'Light', label: 'Light mode', icon: (h) => sunIcon(h) },
  { preference: 'System', label: 'System mode', icon: (h) => computerIcon(h) },
  { preference: 'Dark', label: 'Dark mode', icon: (h) => moonIcon(h) },
]

export const themeSelector = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Role('group'),
      h.AriaLabel('Theme preference'),
      h.Class('flex items-center gap-0.5 rounded-lg border border-border bg-muted/40 p-0.5'),
    ],
    THEME_OPTIONS.map(({ preference, label, icon }) => {
      const isActive = Option.exists(model.maybeThemePreference, (p) => p === preference)
      return h.button(
        [
          h.AriaPressed(String(isActive)),
          h.Class(
            clsx(
              'rounded-md p-2 transition cursor-pointer',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            ),
          ),
          h.AriaLabel(label),
          h.OnClick(SelectedThemePreference({ preference })),
        ],
        [icon(h)],
      )
    }),
  )

// --- header / footer ---

export const headerView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.header(
    [h.Class('sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur')],
    [
      h.div(
        [
          h.Class(
            'mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6',
          ),
        ],
        [
          h.a(
            [h.Href('/'), h.Class('flex items-center gap-2 font-semibold tracking-tight')],
            [
              h.span(
                [
                  h.Class(
                    'flex size-6 items-center justify-center rounded-md bg-foreground text-background',
                  ),
                ],
                [h.span([h.Class('text-[13px] leading-none font-black')], ['F'])],
              ),
              h.span([], ['foldcn']),
            ],
          ),
          h.div(
            [h.Class('flex items-center gap-4')],
            [
              h.a(
                [
                  h.Href('/components/button'),
                  h.Class(
                    'hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block',
                  ),
                ],
                ['Browse components'],
              ),
              themeSelector(model, h),
            ],
          ),
        ],
      ),
    ],
  )

export const footerView = (h: HtmlBuilder<Message>): Html =>
  h.footer(
    [h.Class('border-t border-border')],
    [
      h.div(
        [
          h.Class(
            'mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:px-6',
          ),
        ],
        [
          h.p(
            [],
            [
              'foldcn — ',
              String(componentCount),
              ' copy-paste components for ',
              h.a(
                [
                  h.Href('https://foldkit.dev'),
                  h.Class('underline underline-offset-4 hover:text-foreground'),
                  h.Rel('noopener noreferrer'),
                ],
                ['Foldkit'],
              ),
              '.',
            ],
          ),
          h.p([], ['Built on @foldkit/ui with Tailwind CSS v4.']),
        ],
      ),
    ],
  )

// --- install / copy / code primitives ---

export const copyButton = (
  h: HtmlBuilder<Message>,
  value: string,
  maybeCopied: Option.Option<string>,
): Html =>
  button<Message>(
    {
      variant: 'ghost',
      size: 'icon',
      className: 'size-8',
      onClick: ClickedCopy({ value }),
    },
    Option.exists(maybeCopied, (v) => v === value) ? checkIcon(h, 'size-4') : copyIcon(h, 'size-4'),
    h,
  )

export const installLine = (h: HtmlBuilder<Message>, model: Model, command: string): Html =>
  h.div(
    [
      h.Class(
        'flex w-full items-center justify-between gap-3 rounded-md border border-border bg-muted/40 px-3 py-2',
      ),
    ],
    [
      h.code(
        [h.Class('select-all overflow-x-auto whitespace-nowrap font-mono text-[13px]')],
        [command],
      ),
      copyButton(h, command, model.maybeCopiedValue),
    ],
  )

export const codeBlock = (
  h: HtmlBuilder<Message>,
  model: Model,
  path: string,
  code: string,
): Html =>
  registryCodeBlock(
    {
      path,
      code,
      onCopy: ClickedCopy({ value: code }),
      isCopied: Option.exists(model.maybeCopiedValue, (v) => v === code),
    },
    h,
  )

export const sectionLink = (h: HtmlBuilder<Message>, href: string, label: string): Html =>
  h.a(
    [
      h.Href(href),
      h.Class(
        'inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline',
      ),
    ],
    [label, arrowRightIcon(h, 'size-3.5')],
  )
