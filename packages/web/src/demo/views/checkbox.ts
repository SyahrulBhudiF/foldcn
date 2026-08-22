import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { checkbox } from '@foldcn/registry/styles/default/ui/checkbox'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const ToggledCheckbox = m('ToggledCheckbox', { isChecked: S.Boolean })

export const checkboxView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-5')],
    [
      checkbox<Message>(
        {
          id: 'checkbox-terms',
          label: 'Accept terms and conditions',
          maybeDescription: 'Required before you can continue.',
          isChecked: model.isCheckboxChecked,
          onToggle: (isChecked) => ToggledCheckbox({ isChecked }),
        },
        h,
      ),
      checkbox<Message>(
        {
          id: 'checkbox-indeterminate',
          label: 'Notify me of updates',
          isChecked: false,
          isIndeterminate: true,
          onToggle: () => ToggledCheckbox({ isChecked: false }),
        },
        h,
      ),
    ],
  )

const fields = { isCheckboxChecked: S.Boolean }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { isCheckboxChecked: true },
  messages: [ToggledCheckbox],
  handlers: (model: State) => ({
    ToggledCheckbox: ({ isChecked }: typeof ToggledCheckbox.Type): UpdateReturn => [
      evo(model, { isCheckboxChecked: () => isChecked }),
      [],
    ],
  }),
  samples: [ToggledCheckbox({ isChecked: false })],
})
