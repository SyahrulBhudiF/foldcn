import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { textarea } from '../../generated/registry/ui/textarea'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const Message = defineMessageUnion({
  UpdatedTextareaValue: { value: S.String },
})

export const textareaView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  h.div(
    [h.Class('w-full max-w-sm')],
    [
      textarea<AppMessage>(
        {
          id: 'textarea-demo',
          label: 'Message',
          value: model.textareaValue,
          onInput: (value) => Message.UpdatedTextareaValue({ value }),
          placeholder: 'Type your message here.',
        },
        h,
      ),
    ],
  )

const fields = { textareaValue: S.String }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { textareaValue: '' },
  messages: [Message.UpdatedTextareaValue],
  handlers: (model: State) => ({
    UpdatedTextareaValue: ({ value }: typeof Message.UpdatedTextareaValue.Type): UpdateReturn => [
      evo(model, { textareaValue: () => value }),
      [],
    ],
  }),
  samples: [Message.UpdatedTextareaValue({ value: 'Hello, world!' })],
})
