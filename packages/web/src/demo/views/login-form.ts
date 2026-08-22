import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { loginForm } from '@foldcn/registry/styles/default/blocks/login-form/login-form'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const UpdatedLoginEmail = m('UpdatedLoginEmail', { value: S.String })
const UpdatedLoginPassword = m('UpdatedLoginPassword', { value: S.String })
const SubmittedLogin = m('SubmittedLogin')

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

const fields = {
  loginEmail: S.String,
  loginPassword: S.String,
  loginSubmitted: S.Boolean,
}

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: {
    loginEmail: '',
    loginPassword: '',
    loginSubmitted: false,
  },
  messages: [UpdatedLoginEmail, UpdatedLoginPassword, SubmittedLogin],
  handlers: (model: State) => ({
    UpdatedLoginEmail: ({ value }: typeof UpdatedLoginEmail.Type): UpdateReturn => [
      evo(model, { loginEmail: () => value }),
      [],
    ],
    UpdatedLoginPassword: ({ value }: typeof UpdatedLoginPassword.Type): UpdateReturn => [
      evo(model, { loginPassword: () => value }),
      [],
    ],
    SubmittedLogin: (): UpdateReturn => [evo(model, { loginSubmitted: () => true }), []],
  }),
  samples: [UpdatedLoginEmail({ value: 'ada@example.com' }), SubmittedLogin()],
})
