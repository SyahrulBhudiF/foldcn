import { Option, pipe } from 'effect'
import { Command } from 'foldkit'
import type { Url } from 'foldkit'
import * as Tabs from '@foldkit/ui/tabs'

import * as Demo from './demo'
import { parseRoute } from './route'
import { GotDemoMessage, GotInstallTabsMessage, type Message } from './message'
import { Model, type PackageManager, ResolvedTheme, type ThemePreference as TP } from './model'

export const THEME_STORAGE_KEY = 'foldcn-theme'
export const PACKAGE_MANAGER_STORAGE_KEY = 'foldcn-package-manager'

export type InitReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const fromStored = (raw: string): TP | undefined =>
  raw === 'dark' ? 'Dark' : raw === 'light' ? 'Light' : raw === 'system' ? 'System' : undefined

const readStoredPreference = (): Option.Option<TP> =>
  typeof localStorage === 'undefined'
    ? Option.none()
    : pipe(
        Option.some(localStorage.getItem(THEME_STORAGE_KEY)),
        Option.flatMap((raw) => (raw === null ? Option.none() : Option.some(fromStored(raw)))),
        Option.flatMap((parsed) => (parsed === undefined ? Option.none() : Option.some(parsed))),
      )

const fromStoredPackageManager = (raw: string): PackageManager | undefined =>
  raw === 'npm' ? 'npm' : raw === 'pnpm' ? 'pnpm' : raw === 'bun' ? 'bun' : undefined

const readStoredPackageManager = (): PackageManager =>
  typeof localStorage === 'undefined'
    ? 'npm'
    : pipe(
        Option.some(localStorage.getItem(PACKAGE_MANAGER_STORAGE_KEY)),
        Option.flatMap((raw) =>
          raw === null ? Option.none() : Option.some(fromStoredPackageManager(raw)),
        ),
        Option.match({
          onNone: () => 'npm' as PackageManager,
          onSome: (parsed) => (parsed === undefined ? 'npm' : parsed),
        }),
      )

const systemPrefersDark = (): ResolvedTheme =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'Dark'
    : 'Light'

/** Initial resolved theme from the stored preference, falling back to the
 *  system preference. Only the stored value is read here — the live system
 *  subscription handles changes while the preference is System. */
const initialResolved = (maybePreference: Option.Option<TP>): ResolvedTheme =>
  Option.match(maybePreference, {
    onNone: () => systemPrefersDark(),
    onSome: (preference) => (preference === 'System' ? systemPrefersDark() : preference),
  })

export const init = (url: Url.Url): InitReturn => {
  const maybePreference = readStoredPreference()
  const [demo, demoCommands] = Demo.init()
  const installTabs = Tabs.init({ id: 'install-tabs' })

  return [
    {
      route: parseRoute(url),
      maybeThemePreference: maybePreference,
      resolvedTheme: initialResolved(maybePreference),
      maybeCopiedValue: Option.none(),
      demo,
      installTabs,
      selectedPackageManager: readStoredPackageManager(),
    },
    Command.mapMessages(demoCommands, (message) => GotDemoMessage({ message })),
  ]
}
