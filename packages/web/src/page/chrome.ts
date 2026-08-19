import { clsx } from 'clsx'
import { Option } from 'effect'
import type { Html, HtmlBuilder } from 'foldkit/html'
import * as Tabs from '@foldkit/ui/tabs'

import { codeBlock as registryCodeBlock } from '@foldcn/registry/src/lib/code-block'
import { copyButton as registryCopyButton } from '@foldcn/registry/src/lib/copy-button'
import { styledViewInputs as tabsStyledViewInputs } from '@foldcn/registry/src/ui/tabs'

import {
  ClickedCopy,
  GotInstallTabsMessage,
  SelectedThemePreference,
  type Message,
} from '../message'
import type { Model, PackageManager, ThemePreference } from '../model'
import { arrowRightIcon, computerIcon, moonIcon, sunIcon } from '../site-icons'
import { componentCount } from '../catalog'

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
      h.Class('flex items-center gap-0.5 rounded-md border border-border bg-muted/40 p-0.5'),
    ],
    THEME_OPTIONS.map(({ preference, label, icon }) => {
      const isActive = Option.exists(model.maybeThemePreference, (p) => p === preference)
      return h.button(
        [
          h.AriaPressed(String(isActive)),
          h.Class(
            clsx(
              'rounded p-1.5 transition cursor-pointer',
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

export const headerView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.header(
    [h.Class('sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur')],
    [
      h.div(
        [
          h.Class(
            'mx-auto flex h-10 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6',
          ),
        ],
        [
          h.a(
            [h.Href('/'), h.Class('flex items-center gap-2 font-semibold tracking-tight')],
            [
              h.span(
                [
                  h.Class(
                    'flex size-5 items-center justify-center rounded bg-foreground text-background',
                  ),
                ],
                [h.span([h.Class('text-[11px] leading-none font-black')], ['F'])],
              ),
              h.span([], ['foldcn']),
            ],
          ),
          h.div(
            [h.Class('flex items-center gap-4')],
            [
              h.a(
                [
                  h.Href('/'),
                  h.Class(
                    'hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block',
                  ),
                ],
                ['Docs'],
              ),
              h.a(
                [
                  h.Href('/components/button'),
                  h.Class(
                    'hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block',
                  ),
                ],
                ['Components'],
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
              '. Built on @foldkit/ui with Foldkit TEA and Tailwind CSS.',
            ],
          ),
        ],
      ),
    ],
  )

export const copyButton = (
  h: HtmlBuilder<Message>,
  value: string,
  maybeCopied: Option.Option<string>,
): Html =>
  registryCopyButton<Message>(
    {
      value,
      onCopy: ClickedCopy({ value }),
      isCopied: Option.exists(maybeCopied, (v) => v === value),
    },
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

const PackageManagerTabs = Tabs.create<PackageManager>()

const PACKAGE_MANAGER_COMMANDS: Record<PackageManager, string> = {
  npm: 'npx',
  pnpm: 'pnpm dlx',
  bun: 'bunx',
}

const installCommand = (packageManager: PackageManager, componentName: string): string =>
  `${PACKAGE_MANAGER_COMMANDS[packageManager]} shadcn@latest add @foldcn/${componentName}`

export const installTabs = (h: HtmlBuilder<Message>, model: Model, componentName: string): Html =>
  h.submodel({
    slotId: 'install-tabs',
    model: model.installTabs,
    view: PackageManagerTabs.view,
    viewInputs: tabsStyledViewInputs<Message, PackageManager>(
      {
        tabs: ['npm', 'pnpm', 'bun'],
        selectedValue: model.selectedPackageManager,
        ariaLabel: 'Package manager',
        variant: 'line',
        panel: (tab, _render, h) => {
          const command = installCommand(tab, componentName)
          return h.div(
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
        },
      },
      h,
    ),
    toParentMessage: (message) => GotInstallTabsMessage({ message }),
  })
