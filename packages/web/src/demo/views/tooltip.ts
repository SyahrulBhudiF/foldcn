import { Update } from 'foldkit'
import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import * as tooltip from '@foldcn/registry/styles/default/ui/tooltip'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const GotTooltipMessage = m('GotTooltipMessage', { message: tooltip.Message })

export const tooltipView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.submodel({
    slotId: model.tooltip.id,
    model: model.tooltip,
    view: tooltip.view,
    viewInputs: tooltip.styledViewInputs(
      {
        anchor: { placement: 'top', gap: 4, padding: 8 },
        trigger: 'Hover',
        content: 'Add to library',
      },
      h,
    ),
    toParentMessage: (message) => GotTooltipMessage({ message }),
  })

const foldNoOp =
  <Out>(): ((out: Out) => Update.Step<State, unknown>) =>
  () =>
  (model) => [model, []]

const foldTooltipOutMessage = M.type<tooltip.OutMessage>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    Shown: foldNoOp(),
    Hidden: foldNoOp(),
  }),
)

const foldTooltip = Update.foldChild({
  update: tooltip.update,
  read: (model: State) => Option.some(model.tooltip),
  write: (model, next) => evo(model, { tooltip: () => next }),
  toParentMessage: (message) => GotTooltipMessage({ message }),
  foldOutMessage: foldTooltipOutMessage,
})

const fields = { tooltip: tooltip.Model }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { tooltip: tooltip.init({ id: 'tooltip-demo' }) },
  messages: [GotTooltipMessage],
  handlers: (model: State) => ({
    GotTooltipMessage: (payload: typeof GotTooltipMessage.Type): UpdateReturn =>
      foldTooltip(model, payload.message),
  }),
  samples: [],
  // Tooltip show/hide flows entirely through the submodel; the public
  // @foldkit/ui namespace exports no child-message constructors, so there
  // are no top-level samples to feed update().
})
