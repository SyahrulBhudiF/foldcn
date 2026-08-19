import { Schema as S } from 'effect'
import { Model as InstallTabsModel } from '@foldkit/ui/tabs'

import { Model as DemoModelSchema } from './demo/model'
import { AppRoute } from './route'

export const ThemePreference = S.Literals(['Dark', 'Light', 'System'])
export type ThemePreference = typeof ThemePreference.Type

export const ResolvedTheme = S.Literals(['Dark', 'Light'])
export type ResolvedTheme = typeof ResolvedTheme.Type

export const PackageManager = S.Literals(['npm', 'pnpm', 'bun'])
export type PackageManager = typeof PackageManager.Type

export const Model = S.Struct({
  route: AppRoute,
  maybeThemePreference: S.Option(ThemePreference),
  resolvedTheme: ResolvedTheme,
  /** The last install/external string copied, briefly shown as "Copied". */
  maybeCopiedValue: S.Option(S.String),
  demo: DemoModelSchema,
  installTabs: InstallTabsModel,
  selectedPackageManager: PackageManager,
})
export type Model = typeof Model.Type
