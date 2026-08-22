import { Update } from 'foldkit'
import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import * as HoverCard from '@foldcn/registry/styles/default/ui/hover-card'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const GotHoverCardMessage = m('GotHoverCardMessage', { message: HoverCard.Message })

export const hoverCardView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.submodel({
    slotId: model.hoverCard.popover.id,
    model: model.hoverCard,
    view: HoverCard.view,
    viewInputs: HoverCard.styledViewInputs(
      {
        trigger: '@foldcn on GitHub',
        content: [
          HoverCard.header(
            {},
            [
              HoverCard.title({}, ['@foldcn'], h),
              HoverCard.description({}, ['A shadcn-style registry built on @foldkit/ui.'], h),
            ],
            h,
          ),
          h.p(
            [h.Class('text-sm text-muted-foreground')],
            [
              'Opens on hover after a short delay, stays open while you move into the card, and closes after a grace period once you leave.',
            ],
          ),
        ],
      },
      h,
    ),
    toParentMessage: (message) => GotHoverCardMessage({ message }),
  })

const foldNoOp =
  <Out>(): ((out: Out) => Update.Step<State, unknown>) =>
  () =>
  (model) => [model, []]

const foldHoverCardOutMessage = M.type<HoverCard.OutMessage>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    Opened: foldNoOp(),
    Closed: foldNoOp(),
  }),
)

const foldHoverCard = Update.foldChild({
  update: HoverCard.update,
  read: (model: State) => Option.some(model.hoverCard),
  write: (model, next) => evo(model, { hoverCard: () => next }),
  toParentMessage: (message) => GotHoverCardMessage({ message }),
  foldOutMessage: foldHoverCardOutMessage,
})

const fields = { hoverCard: HoverCard.Model }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { hoverCard: HoverCard.init({ id: 'hover-card-demo' }) },
  messages: [GotHoverCardMessage],
  handlers: (model: State) => ({
    GotHoverCardMessage: (payload: typeof GotHoverCardMessage.Type): UpdateReturn =>
      foldHoverCard(model, payload.message),
  }),
  samples: [],
  // Open/close flows entirely through the submodel (hover, focus, Escape);
  // the card emits no parent commands, so there are no top-level samples.
})
