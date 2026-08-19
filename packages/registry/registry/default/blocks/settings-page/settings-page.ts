import type { Html, HtmlBuilder } from 'foldkit/html'

import { button } from '@/components/ui/button'
import { fieldset } from '@/components/ui/fieldset'
import { input } from '@/components/ui/input'
import { select } from '@/components/ui/select'
import { switch_ } from '@/components/ui/switch'
import { textarea } from '@/components/ui/textarea'

export type SettingsPageConfig<M> = Readonly<{
  name: string
  onNameInput: (value: string) => M
  email: string
  onEmailInput: (value: string) => M
  bio: string
  onBioInput: (value: string) => M
  language: string
  onLanguageChange: (value: string) => M
  isEmailNotificationsEnabled: boolean
  onToggleEmailNotifications: (isChecked: boolean) => M
  isTwoFactorEnabled: boolean
  onToggleTwoFactor: (isChecked: boolean) => M
  onSave: M
  className?: string
}>

/** Settings page block: profile + preferences sections composed from foldcn
 *  primitives. */
export const settingsPage = <M>(config: SettingsPageConfig<M>, h: HtmlBuilder<M>): Html =>
  h.div(
    [h.Class('mx-auto flex w-full max-w-2xl flex-col gap-8 p-6')],
    [
      h.div(
        [],
        [
          h.h2([h.Class('text-3xl font-bold tracking-tight')], ['Settings']),
          h.p(
            [h.Class('text-muted-foreground')],
            ['Manage your account settings and preferences.'],
          ),
        ],
      ),

      fieldset<M>(
        {
          id: 'settings-profile',
          legend: 'Profile',
          maybeDescription: 'This information will be displayed publicly.',
          children: [
            input<M>(
              {
                id: 'settings-name',
                label: 'Name',
                value: config.name,
                onInput: config.onNameInput,
                placeholder: 'Ada Lovelace',
              },
              h,
            ),
            input<M>(
              {
                id: 'settings-email',
                label: 'Email',
                type: 'email',
                value: config.email,
                onInput: config.onEmailInput,
                placeholder: 'ada@example.com',
              },
              h,
            ),
            textarea<M>(
              {
                id: 'settings-bio',
                label: 'Bio',
                value: config.bio,
                onInput: config.onBioInput,
                rows: 4,
                placeholder: 'Tell us about yourself...',
              },
              h,
            ),
            select<M>(
              {
                id: 'settings-language',
                label: 'Language',
                value: config.language,
                onChange: config.onLanguageChange,
                options: [
                  h.option([h.Value('en')], ['English']),
                  h.option([h.Value('id')], ['Bahasa Indonesia']),
                  h.option([h.Value('ja')], ['日本語']),
                  h.option([h.Value('es')], ['Español']),
                ],
              },
              h,
            ),
          ],
        },
        h,
      ),

      fieldset<M>(
        {
          id: 'settings-preferences',
          legend: 'Preferences',
          maybeDescription: 'Control how you receive notifications.',
          children: [
            switch_<M>(
              {
                id: 'settings-email-notifications',
                label: 'Email notifications',
                maybeDescription: 'Receive emails about your account activity.',
                isChecked: config.isEmailNotificationsEnabled,
                onToggle: config.onToggleEmailNotifications,
              },
              h,
            ),
            switch_<M>(
              {
                id: 'settings-two-factor',
                label: 'Two-factor authentication',
                maybeDescription: 'Add an extra layer of security to your account.',
                isChecked: config.isTwoFactorEnabled,
                onToggle: config.onToggleTwoFactor,
              },
              h,
            ),
          ],
        },
        h,
      ),

      h.div(
        [h.Class('flex justify-end')],
        [button<M>({ onClick: config.onSave }, 'Save changes', h)],
      ),
    ],
  )
