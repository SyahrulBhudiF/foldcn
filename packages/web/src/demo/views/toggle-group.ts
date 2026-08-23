import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { toggleGroup } from '@foldcn/registry/styles/default/ui/toggle-group'
import { Bold, Italic, Underline } from 'lucide'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const Message = defineMessageUnion({
  SelectedToggleGroup: { value: S.Array(S.String) },
})

export const toggleGroupView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-4')],
    [
      toggleGroup<AppMessage>(
        {
          variant: 'outline',
          type: 'multiple',
          value: model.toggleGroupValue,
          onValueChange: (value) => Message.SelectedToggleGroup({ value: [...value] }),
        },
        [
          { value: 'bold', label: 'Bold', icon: Bold },
          { value: 'italic', label: 'Italic', icon: Italic },
          { value: 'strikethrough', label: 'Strikethrough', icon: Underline },
        ],
        h,
      ),
    ],
  )

const fields = { toggleGroupValue: S.Array(S.String) }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { toggleGroupValue: [] },
  messages: [Message.SelectedToggleGroup],
  handlers: (model: State) => ({
    SelectedToggleGroup: ({ value }: typeof Message.SelectedToggleGroup.Type): UpdateReturn => [
      evo(model, { toggleGroupValue: () => [...value] }),
      [],
    ],
  }),
  samples: [Message.SelectedToggleGroup({ value: ['bold'] })],
})
