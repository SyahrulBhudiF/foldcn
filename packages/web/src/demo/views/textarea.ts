import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { textarea } from '@foldcn/registry/styles/default/ui/textarea'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const UpdatedTextareaValue = m('UpdatedTextareaValue', { value: S.String })

export const textareaView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('w-full max-w-sm')],
    [
      textarea<Message>(
        {
          id: 'textarea-bio',
          label: 'Bio',
          value: model.textareaValue,
          onInput: (value) => UpdatedTextareaValue({ value }),
          rows: 4,
          placeholder: 'Tell us about yourself...',
          maybeDescription: 'Appears on your public profile.',
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
  messages: [UpdatedTextareaValue],
  handlers: (model: State) => ({
    UpdatedTextareaValue: ({ value }: typeof UpdatedTextareaValue.Type): UpdateReturn => [
      evo(model, { textareaValue: () => value }),
      [],
    ],
  }),
  samples: [UpdatedTextareaValue({ value: 'Hello, world!' })],
})
