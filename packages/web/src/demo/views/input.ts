import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { input } from '@foldcn/registry/styles/default/ui/input'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const UpdatedInputValue = m('UpdatedInputValue', { value: S.String })

export const inputView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-4')],
    [
      input<Message>(
        {
          id: 'input-email',
          label: 'Email',
          type: 'email',
          value: model.inputValue,
          onInput: (value) => UpdatedInputValue({ value }),
          placeholder: 'you@example.com',
          maybeDescription: 'We never share your email.',
        },
        h,
      ),
      input<Message>(
        {
          id: 'input-disabled',
          label: 'Disabled',
          value: 'Read only',
          isDisabled: true,
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
  messages: [UpdatedInputValue],
  handlers: (model: State) => ({
    UpdatedInputValue: ({ value }: typeof UpdatedInputValue.Type): UpdateReturn => [
      evo(model, { inputValue: () => value }),
      [],
    ],
  }),
  samples: [UpdatedInputValue({ value: 'ada@example.com' })],
})
