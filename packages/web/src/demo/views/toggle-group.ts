import { Update } from 'foldkit'
import { Bold, Italic, Underline } from 'lucide'
import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import * as toggleGroup from '@foldcn/registry/styles/default/ui/toggle-group'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const Message = defineMessageUnion({
  GotToggleGroupMessage: { message: toggleGroup.Message },
})

export const toggleGroupView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-4')],
    [
      h.submodel({
        slotId: model.toggleGroup.id,
        model: model.toggleGroup,
        view: toggleGroup.view,
        viewInputs: {
          variant: 'outline',
          items: [
            { value: 'bold', label: 'Bold', icon: Bold },
            { value: 'italic', label: 'Italic', icon: Italic },
            { value: 'strikethrough', label: 'Strikethrough', icon: Underline },
          ],
        },
        toParentMessage: (message) => Message.GotToggleGroupMessage({ message }),
      }),
    ],
  )

const foldNoOp =
  <Out>(): ((out: Out) => Update.Step<State, unknown>) =>
  () =>
  (model) => [model, []]

const foldToggleGroupOutMessage = M.type<toggleGroup.OutMessage>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    ChangedValue: foldNoOp(),
  }),
)

const foldToggleGroup = Update.foldChild({
  update: toggleGroup.update,
  read: (model: State) => Option.some(model.toggleGroup),
  write: (model, next) => evo(model, { toggleGroup: () => next }),
  toParentMessage: (message) => Message.GotToggleGroupMessage({ message }),
  foldOutMessage: foldToggleGroupOutMessage,
})

const fields = { toggleGroup: toggleGroup.Model }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: {
    toggleGroup: toggleGroup.init({ id: 'toggle-group-demo', type: 'multiple', value: ['bold'] }),
  },
  messages: [Message.GotToggleGroupMessage],
  handlers: (model: State) => ({
    GotToggleGroupMessage: (payload: typeof Message.GotToggleGroupMessage.Type): UpdateReturn =>
      foldToggleGroup(model, payload.message),
  }),
  samples: [Message.GotToggleGroupMessage({ message: toggleGroup.Message.ToggledItem({ value: 'italic' }) })],
})
