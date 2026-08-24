import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { input } from '@foldcn/registry/styles/default/ui/input'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const Message = defineMessageUnion({
  UpdatedInputValue: { value: S.String },
})

export const inputView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  h.div(
    [h.Class('w-full max-w-sm')],
    [
      input<AppMessage>(
        {
          id: 'input-demo-api-key',
          label: 'API Key',
          type: 'password',
          value: model.inputValue,
          onInput: (value) => Message.UpdatedInputValue({ value }),
          placeholder: 'sk-...',
          description: 'Your API key is encrypted and stored securely.',
        },
        h,
      ),
    ],
  )

const fields = { inputValue: S.String }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { inputValue: '' },
  messages: [Message.UpdatedInputValue],
  handlers: (model: State) => ({
    UpdatedInputValue: ({ value }: typeof Message.UpdatedInputValue.Type): UpdateReturn => [
      evo(model, { inputValue: () => value }),
      [],
    ],
  }),
  samples: [Message.UpdatedInputValue({ value: 'sk-1234' })],
})
