import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { switch_ } from '@foldcn/registry/styles/default/ui/switch'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const ToggledSwitch = m('ToggledSwitch', { isChecked: S.Boolean })

export const switchView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex items-center space-x-2')],
    [
      switch_<Message>(
        {
          id: 'airplane-mode',
          label: 'Airplane Mode',
          isChecked: model.isSwitchChecked,
          onToggle: (isChecked) => ToggledSwitch({ isChecked }),
        },
        h,
      ),
    ],
  )

const fields = { isSwitchChecked: S.Boolean }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { isSwitchChecked: false },
  messages: [ToggledSwitch],
  handlers: (model: State) => ({
    ToggledSwitch: ({ isChecked }: typeof ToggledSwitch.Type): UpdateReturn => [
      evo(model, { isSwitchChecked: () => isChecked }),
      [],
    ],
  }),
  samples: [ToggledSwitch({ isChecked: true })],
})
