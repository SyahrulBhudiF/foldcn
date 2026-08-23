import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { checkbox } from '@foldcn/registry/styles/default/ui/checkbox'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const ToggledLabelCheckbox = m('ToggledLabelCheckbox', { isChecked: S.Boolean })

export const labelView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex gap-2')],
    [
      checkbox<Message>(
        {
          id: 'terms',
          label: 'Accept terms and conditions',
          isChecked: model.isLabelChecked,
          onToggle: (isChecked) => ToggledLabelCheckbox({ isChecked }),
        },
        h,
      ),
    ],
  )

const fields = { isLabelChecked: S.Boolean }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { isLabelChecked: false },
  messages: [ToggledLabelCheckbox],
  handlers: (model: State) => ({
    ToggledLabelCheckbox: ({ isChecked }: typeof ToggledLabelCheckbox.Type): UpdateReturn => [
      evo(model, { isLabelChecked: () => isChecked }),
      [],
    ],
  }),
  samples: [ToggledLabelCheckbox({ isChecked: true })],
})
