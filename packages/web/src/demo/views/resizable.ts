import { Update } from 'foldkit'
import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import * as resizable from '@foldcn/registry/styles/default/ui/resizable'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const Message = defineMessageUnion({
  GotResizableMessage: { message: resizable.Message },
})

// Two-pane horizontal split mirroring apps/v4/examples/base/resizable-demo.tsx
// (upstream nests a vertical group in the second pane; foldcn's resizable is
// fixed two panes, so we show One | Two).
export const resizableView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  h.div(
    [h.Class('max-w-sm rounded-lg border')],
    [
      h.submodel({
        slotId: model.resizable.id,
        model: model.resizable,
        view: resizable.view,
        viewInputs: {
          firstPane: {
            content: h.div(
              [h.Class('flex h-[200px] items-center justify-center p-6')],
              [h.span([h.Class('font-semibold')], ['One'])],
            ),
          },
          secondPane: {
            content: h.div(
              [h.Class('flex h-[200px] items-center justify-center p-6')],
              [h.span([h.Class('font-semibold')], ['Two'])],
            ),
          },
        },
        toParentMessage: (message) => Message.GotResizableMessage({ message }),
      }),
    ],
  )

const foldNoOp =
  <Out>(): ((out: Out) => Update.Step<State, unknown>) =>
  () =>
  (model) => [model, []]

const foldResizableOutMessage = M.type<resizable.OutMessage>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    ChangedValue: foldNoOp(),
  }),
)

const foldResizable = Update.foldChild({
  update: resizable.update,
  read: (model: State) => Option.some(model.resizable),
  write: (model, next) => evo(model, { resizable: () => next }),
  toParentMessage: (message) => Message.GotResizableMessage({ message }),
  foldOutMessage: foldResizableOutMessage,
})

const fields = { resizable: resizable.Model }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { resizable: resizable.init({ id: 'resizable-demo', initialValue: 50 }) },
  messages: [Message.GotResizableMessage],
  handlers: (model: State) => ({
    GotResizableMessage: (payload: typeof Message.GotResizableMessage.Type): UpdateReturn =>
      foldResizable(model, payload.message),
  }),
  samples: [
    Message.GotResizableMessage({ message: resizable.Message.Resized({ value: 70 }) }),
  ],
})
