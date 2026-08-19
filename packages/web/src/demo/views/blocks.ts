import type { Html, HtmlBuilder } from 'foldkit/html'

import { dataTable } from '@foldcn/registry/src/blocks/data-table/data-table'
import { loginForm } from '@foldcn/registry/src/blocks/login-form/login-form'
import { settingsPage } from '@foldcn/registry/src/blocks/settings-page/settings-page'

import {
  ClickedSaveSettings,
  SubmittedLogin,
  ToggledSettingsEmailNotifs,
  ToggledSettingsTfa,
  UpdatedLoginEmail,
  UpdatedLoginPassword,
  UpdatedSettingsBio,
  UpdatedSettingsEmail,
  UpdatedSettingsLanguage,
  UpdatedSettingsName,
  UpdatedTableSearch,
  type Message,
} from '../message'
import type { Model } from '../model'
import { filteredRows } from '../update'

export const loginFormView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('w-full overflow-hidden rounded-xl border border-border')],
    [
      loginForm<Message>(
        {
          email: model.loginEmail,
          onEmailInput: (value) => UpdatedLoginEmail({ value }),
          password: model.loginPassword,
          onPasswordInput: (value) => UpdatedLoginPassword({ value }),
          onSubmit: SubmittedLogin(),
        },
        h,
      ),
      ...(model.loginSubmitted
        ? [
            h.p(
              [h.Class('mb-4 px-6 text-center text-sm text-emerald-600 dark:text-emerald-400')],
              ['Signed in (demo).'],
            ),
          ]
        : []),
    ],
  )

export const settingsPageView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('w-full overflow-hidden rounded-xl border border-border')],
    [
      settingsPage<Message>(
        {
          name: model.settingsName,
          onNameInput: (value) => UpdatedSettingsName({ value }),
          email: model.settingsEmail,
          onEmailInput: (value) => UpdatedSettingsEmail({ value }),
          bio: model.settingsBio,
          onBioInput: (value) => UpdatedSettingsBio({ value }),
          language: model.settingsLanguage,
          onLanguageChange: (value) => UpdatedSettingsLanguage({ value }),
          isEmailNotificationsEnabled: model.settingsEmailNotifs,
          onToggleEmailNotifications: (isChecked) => ToggledSettingsEmailNotifs({ isChecked }),
          isTwoFactorEnabled: model.settingsTfa,
          onToggleTwoFactor: (isChecked) => ToggledSettingsTfa({ isChecked }),
          onSave: ClickedSaveSettings(),
        },
        h,
      ),
      ...(model.settingsSaved
        ? [
            h.p(
              [
                h.Class(
                  'mx-auto max-w-2xl px-6 pb-6 text-sm text-emerald-600 dark:text-emerald-400',
                ),
              ],
              ['Settings saved (demo).'],
            ),
          ]
        : []),
    ],
  )

const TABLE_COLUMNS = [
  { key: 'name', title: 'Name' },
  { key: 'email', title: 'Email' },
  { key: 'plan', title: 'Plan', align: 'right' as const },
  { key: 'status', title: 'Status', align: 'right' as const },
]

export const dataTableView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('w-full rounded-xl border border-border')],
    [
      dataTable<Message>(
        {
          columns: TABLE_COLUMNS,
          rows: filteredRows(model.tableSearch).map((row) => ({
            id: row.id,
            cells: {
              name: row.name,
              email: row.email,
              plan: row.plan,
              status: row.status,
            },
          })),
          searchValue: model.tableSearch,
          onSearchInput: (value) => UpdatedTableSearch({ value }),
        },
        h,
      ),
    ],
  )
