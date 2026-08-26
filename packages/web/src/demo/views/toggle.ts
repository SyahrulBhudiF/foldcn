import { Update } from 'foldkit'
import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import * as toggle from '../../generated/registry/ui/toggle'
import { icon } from '../../generated/registry/lib/icons'
import { Bookmark } from 'lucide'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const Message = defineMessageUnion({
  GotToggleMessage: { message: toggle.Message },
})

export const toggleView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-4')],
    [
      h.submodel({
        slotId: model.toggle.id,
        model: model.toggle,
        view: toggle.view,
        viewInputs: {
          variant: 'outline',
          size: 'sm',
          ariaLabel: 'Toggle bookmark',
          label: h.span(
            [],
            [
              icon(h, Bookmark, 'size-4 shrink-0 group-aria-pressed/toggle:fill-foreground'),
              ' Bookmark',
            ],
          ),
        },
        toParentMessage: (message) => Message.GotToggleMessage({ message }),
      }),
    ],
  )

const foldNoOp =
  <Out>(): ((out: Out) => Update.Step<State, unknown>) =>
  () =>
  (model) => [model, []]

const foldToggleOutMessage = M.type<toggle.OutMessage>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    ChangedPressed: foldNoOp(),
  }),
)

const foldToggle = Update.foldChild({
  update: toggle.update,
  read: (model: State) => Option.some(model.toggle),
  write: (model, next) => evo(model, { toggle: () => next }),
  toParentMessage: (message) => Message.GotToggleMessage({ message }),
  foldOutMessage: foldToggleOutMessage,
})

const fields = { toggle: toggle.Model }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { toggle: toggle.init({ id: 'toggle-demo' }) },
  messages: [Message.GotToggleMessage],
  handlers: (model: State) => ({
    GotToggleMessage: (payload: typeof Message.GotToggleMessage.Type): UpdateReturn =>
      foldToggle(model, payload.message),
  }),
  samples: [],
  // Pressed state flows entirely through the submodel; the parent only sees
  // the ChangedPressed out-message, which this demo ignores.
})
