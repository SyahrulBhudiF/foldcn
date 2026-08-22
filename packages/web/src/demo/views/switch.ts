import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { switch_ } from '@foldcn/registry/styles/default/ui/switch'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const ToggledSwitchEmail = m('ToggledSwitchEmail', { isChecked: S.Boolean })
const ToggledSwitchTfa = m('ToggledSwitchTfa', { isChecked: S.Boolean })

export const switchView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-5')],
    [
      switch_<Message>(
        {
          id: 'switch-email',
          label: 'Email notifications',
          maybeDescription: 'Receive emails about your account activity.',
          isChecked: model.isSwitchEmailChecked,
          onToggle: (isChecked) => ToggledSwitchEmail({ isChecked }),
        },
        h,
      ),
      switch_<Message>(
        {
          id: 'switch-2fa',
          label: 'Two-factor authentication',
          maybeDescription: 'Add an extra layer of security to your account.',
          isChecked: model.isSwitchTfaChecked,
          onToggle: (isChecked) => ToggledSwitchTfa({ isChecked }),
        },
        h,
      ),
    ],
  )

const fields = { isSwitchEmailChecked: S.Boolean, isSwitchTfaChecked: S.Boolean }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { isSwitchEmailChecked: true, isSwitchTfaChecked: false },
  messages: [ToggledSwitchEmail, ToggledSwitchTfa],
  handlers: (model: State) => ({
    ToggledSwitchEmail: ({ isChecked }: typeof ToggledSwitchEmail.Type): UpdateReturn => [
      evo(model, { isSwitchEmailChecked: () => isChecked }),
      [],
    ],
    ToggledSwitchTfa: ({ isChecked }: typeof ToggledSwitchTfa.Type): UpdateReturn => [
      evo(model, { isSwitchTfaChecked: () => isChecked }),
      [],
    ],
  }),
  samples: [ToggledSwitchEmail({ isChecked: false }), ToggledSwitchTfa({ isChecked: true })],
})
