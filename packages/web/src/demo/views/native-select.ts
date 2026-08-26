import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { nativeSelect } from '../../generated/registry/ui/native-select'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const Message = defineMessageUnion({
  ChangedFruit: { value: S.String },
})

const FRUITS = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple'] as const

export const nativeSelectView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  h.div(
    [h.Class('w-full max-w-48')],
    [
      nativeSelect<AppMessage>(
        {
          id: 'native-select-demo',
          label: 'Favorite fruit',
          value: model.fruit,
          onChange: (value) => Message.ChangedFruit({ value }),
          description: 'Rendered by the native select element.',
          options: FRUITS.map((fruit) => h.option([h.Value(fruit)], [fruit])),
        },
        h,
      ),
    ],
  )

const fields = { fruit: S.String }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { fruit: 'Apple' },
  messages: [Message.ChangedFruit],
  handlers: (model: State) => ({
    ChangedFruit: ({ value }: typeof Message.ChangedFruit.Type): UpdateReturn => [
      evo(model, { fruit: () => value }),
      [],
    ],
  }),
  samples: [Message.ChangedFruit({ value: 'Blueberry' })],
})
