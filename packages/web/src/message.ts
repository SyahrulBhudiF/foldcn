import { Schema as S } from 'effect'
import { defineMessageUnion } from 'foldkit/message'
import { Url } from 'foldkit'
import { UrlRequest } from 'foldkit/navigation'

import { Message as DemoMessage } from './demo'
import { Message as InstallTabsMessage } from '@foldkit/ui/tabs'
import { PackageManager, ResolvedTheme, ThemePreference } from './model'

export const Message = defineMessageUnion({
  ClickedLink: { request: UrlRequest },
  ChangedUrl: { url: Url.Url },
  GotDemoMessage: { message: DemoMessage },
  SelectedThemePreference: { preference: ThemePreference },
  ChangedSystemTheme: { theme: ResolvedTheme },
  CompletedApplyTheme: {},
  CompletedSaveThemePreference: {},
  LoadedBrowserEnvironment: {
    maybePreference: S.Option(ThemePreference),
    systemTheme: ResolvedTheme,
    packageManager: PackageManager,
  },
  ClickedCopy: { value: S.String },
  CompletedCopy: { value: S.String },
  ToggledCodeBlock: { id: S.String },
  GotInstallTabsMessage: { message: InstallTabsMessage },
  CompletedSavePackageManager: {},
  CompletedNavigateInternal: {},
  CompletedLoadExternal: {},
  CompletedScrollToTop: {},
})
export type Message = typeof Message.Type

export const ClickedLink = Message.ClickedLink
export const ChangedUrl = Message.ChangedUrl
export const GotDemoMessage = Message.GotDemoMessage
export const SelectedThemePreference = Message.SelectedThemePreference
export const ChangedSystemTheme = Message.ChangedSystemTheme
export const CompletedApplyTheme = Message.CompletedApplyTheme
export const CompletedSaveThemePreference = Message.CompletedSaveThemePreference
export const LoadedBrowserEnvironment = Message.LoadedBrowserEnvironment
export const ClickedCopy = Message.ClickedCopy
export const CompletedCopy = Message.CompletedCopy
export const ToggledCodeBlock = Message.ToggledCodeBlock
export const GotInstallTabsMessage = Message.GotInstallTabsMessage
export const CompletedSavePackageManager = Message.CompletedSavePackageManager
export const CompletedNavigateInternal = Message.CompletedNavigateInternal
export const CompletedLoadExternal = Message.CompletedLoadExternal
export const CompletedScrollToTop = Message.CompletedScrollToTop
