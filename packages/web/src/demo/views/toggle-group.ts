import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { toggleGroup } from '@foldcn/registry/styles/default/ui/toggle-group'
import { icon } from '@foldcn/registry/styles/default/lib/icons'
import { Bold, Italic, Underline } from 'lucide'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const SelectedToggleGroup = m('SelectedToggleGroup', { value: S.Array(S.String) })

export const toggleGroupView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-4')],
    [
      toggleGroup<Message>(
        { value: model.toggleGroupValue, onValueChange: (value) => SelectedToggleGroup({ value }) },
        [
          { value: 'bold', label: 'Bold', icon: Bold },
          { value: 'italic', label: 'Italic', icon: Italic },
          { value: 'underline', label: 'Underline', icon: Underline },
        ],
        h,
      ),
      toggleGroup<Message>(
        {
          type: 'multiple',
          value: model.toggleGroupValue,
          onValueChange: (value) => SelectedToggleGroup({ value }),
        },
        [
          { value: 'bold', label: 'Bold', icon: Bold },
          { value: 'italic', label: 'Italic', icon: Italic },
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
  init: { toggleGroupValue: ['bold'] },
  messages: [SelectedToggleGroup],
  handlers: (model: State) => ({
    SelectedToggleGroup: ({ value }: typeof SelectedToggleGroup.Type): UpdateReturn => [
      evo(model, { toggleGroupValue: () => value }),
      [],
    ],
  }),
  samples: [SelectedToggleGroup({ value: ['bold', 'italic'] })],
})
