import { Update } from 'foldkit'
import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import * as popover from '@foldcn/registry/styles/default/ui/popover'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const GotPopoverMessage = m('GotPopoverMessage', { message: popover.Message })

export const popoverView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.submodel({
    slotId: model.popover.id,
    model: model.popover,
    view: popover.view,
    viewInputs: popover.styledViewInputs(
      {
        anchor: { placement: 'bottom-start', gap: 4, padding: 8 },
        trigger: 'Open popover',
        content: [
          h.p([h.Class('text-sm font-medium')], ['Dimensions']),
          h.p(
            [h.Class('mt-1 text-sm text-muted-foreground')],
            [
              'Set the dimensions for the layer. Positioned with an anchor, dismissed on outside press.',
            ],
          ),
        ],
      },
      h,
    ),
    toParentMessage: (message) => GotPopoverMessage({ message }),
  })

const foldNoOp =
  <Out>(): ((out: Out) => Update.Step<State, unknown>) =>
  () =>
  (model) => [model, []]

const foldPopoverOutMessage = M.type<popover.OutMessage>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    Opened: foldNoOp(),
    Closed: foldNoOp(),
  }),
)

const foldPopover = Update.foldChild({
  update: popover.update,
  read: (model: State) => Option.some(model.popover),
  write: (model, next) => evo(model, { popover: () => next }),
  toParentMessage: (message) => GotPopoverMessage({ message }),
  foldOutMessage: foldPopoverOutMessage,
})

const fields = { popover: popover.Model }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { popover: popover.init({ id: 'popover-demo' }) },
  messages: [GotPopoverMessage],
  handlers: (model: State) => ({
    GotPopoverMessage: (payload: typeof GotPopoverMessage.Type): UpdateReturn =>
      foldPopover(model, payload.message),
  }),
  samples: [],
  // Popover open/close flows entirely through the submodel; the public
  // @foldkit/ui namespace exports no child-message constructors, so there
  // are no top-level samples to feed update().
})
