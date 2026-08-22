import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { Update } from 'foldkit'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import * as HoverCard from '@foldcn/registry/styles/default/ui/hover-card'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

type State = { popover: typeof HoverCard.Model.Type }

const GotPopoverMessage = m('GotPopoverMessage', { message: HoverCard.Message })

export const hoverCardView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.submodel({
    slotId: model.popover.id,
    model: model.popover,
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
          h.p([h.Class('text-sm text-muted-foreground')], [
            'Components are copy-paste HTML-builder factories, themed with Tailwind CSS variables.',
          ]),
        ],
      },
      h,
    ),
    toParentMessage: (message) => GotPopoverMessage({ message }),
  })

const foldNoOp =
  (): ((out: HoverCard.OutMessage) => Update.Step<State, unknown>) =>
  () =>
  (model) => [model, []]

const foldHoverCardOutMessage = M.type<HoverCard.OutMessage>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    Opened: foldNoOp(),
    Closed: foldNoOp(),
  }),
)

// The hover card demo shares the popover slice's `popover` submodel field
// and its message tag. The card opens on hover, so the parent sends no open
// commands of its own.
const foldHoverCard = Update.foldChild({
  update: HoverCard.update,
  read: (model: State) => Option.some(model.popover),
  write: (model, next) => evo(model, { popover: () => next }),
  toParentMessage: (message) => GotPopoverMessage({ message }),
  foldOutMessage: foldHoverCardOutMessage,
})

export const slice = defineSlice({
  fields: {},
  init: {},
  messages: [GotPopoverMessage],
  handlers: (model: State) => ({
    GotPopoverMessage: (payload: typeof GotPopoverMessage.Type): UpdateReturn =>
      foldHoverCard(model, payload.message),
  }),
})
