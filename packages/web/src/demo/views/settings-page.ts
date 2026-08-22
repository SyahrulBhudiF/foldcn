import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { settingsPage } from '@foldcn/registry/styles/default/blocks/settings-page/settings-page'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const UpdatedSettingsName = m('UpdatedSettingsName', { value: S.String })
const UpdatedSettingsEmail = m('UpdatedSettingsEmail', { value: S.String })
const UpdatedSettingsBio = m('UpdatedSettingsBio', { value: S.String })
const UpdatedSettingsLanguage = m('UpdatedSettingsLanguage', { value: S.String })
const ToggledSettingsEmailNotifs = m('ToggledSettingsEmailNotifs', { isChecked: S.Boolean })
const ToggledSettingsTfa = m('ToggledSettingsTfa', { isChecked: S.Boolean })
const ClickedSaveSettings = m('ClickedSaveSettings')

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

const fields = {
  settingsName: S.String,
  settingsEmail: S.String,
  settingsBio: S.String,
  settingsLanguage: S.String,
  settingsEmailNotifs: S.Boolean,
  settingsTfa: S.Boolean,
  settingsSaved: S.Boolean,
}

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: {
    settingsName: '',
    settingsEmail: '',
    settingsBio: '',
    settingsLanguage: 'en',
    settingsEmailNotifs: true,
    settingsTfa: false,
    settingsSaved: false,
  },
  messages: [
    UpdatedSettingsName,
    UpdatedSettingsEmail,
    UpdatedSettingsBio,
    UpdatedSettingsLanguage,
    ToggledSettingsEmailNotifs,
    ToggledSettingsTfa,
    ClickedSaveSettings,
  ],
  handlers: (model: State) => ({
    UpdatedSettingsName: ({ value }: typeof UpdatedSettingsName.Type): UpdateReturn => [
      evo(model, { settingsName: () => value }),
      [],
    ],
    UpdatedSettingsEmail: ({ value }: typeof UpdatedSettingsEmail.Type): UpdateReturn => [
      evo(model, { settingsEmail: () => value }),
      [],
    ],
    UpdatedSettingsBio: ({ value }: typeof UpdatedSettingsBio.Type): UpdateReturn => [
      evo(model, { settingsBio: () => value }),
      [],
    ],
    UpdatedSettingsLanguage: ({ value }: typeof UpdatedSettingsLanguage.Type): UpdateReturn => [
      evo(model, { settingsLanguage: () => value }),
      [],
    ],
    ToggledSettingsEmailNotifs: ({
      isChecked,
    }: typeof ToggledSettingsEmailNotifs.Type): UpdateReturn => [
      evo(model, { settingsEmailNotifs: () => isChecked }),
      [],
    ],
    ToggledSettingsTfa: ({ isChecked }: typeof ToggledSettingsTfa.Type): UpdateReturn => [
      evo(model, { settingsTfa: () => isChecked }),
      [],
    ],
    ClickedSaveSettings: (): UpdateReturn => [evo(model, { settingsSaved: () => true }), []],
  }),
  samples: [
    UpdatedSettingsName({ value: 'Ada' }),
    ToggledSettingsTfa({ isChecked: true }),
    ClickedSaveSettings(),
  ],
})
