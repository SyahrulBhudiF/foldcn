import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { switch_ } from '@foldcn/registry/styles/default/ui/switch'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const Message = defineMessageUnion({
  ToggledSwitch: { isChecked: S.Boolean },
})

export const switchView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  h.div(
    [h.Class('flex items-center space-x-2')],
    [
      switch_<AppMessage>(
        {
          id: 'airplane-mode',
          label: 'Airplane Mode',
          isChecked: model.isSwitchChecked,
          onToggle: (isChecked) => Message.ToggledSwitch({ isChecked }),
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
  messages: [Message.ToggledSwitch],
  handlers: (model: State) => ({
    ToggledSwitch: ({ isChecked }: typeof Message.ToggledSwitch.Type): UpdateReturn => [
      evo(model, { isSwitchChecked: () => isChecked }),
      [],
    ],
  }),
  samples: [Message.ToggledSwitch({ isChecked: true })],
})
