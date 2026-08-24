import { Update } from 'foldkit'
import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import * as collapsible from '@foldcn/registry/styles/default/ui/collapsible'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const Message = defineMessageUnion({
  GotCollapsibleMessage: { message: collapsible.Message },
})

// Single-section disclosure mirroring apps/v4/examples/base/collapsible-demo.tsx
// (Order #4189). The upstream demo shows an always-visible Status row outside
// the collapsible; foldcn's Disclosure primitive owns the whole panel, so the
// title carries the order header and the content holds the details that toggle.
export const collapsibleView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  h.div(
    [h.Class('flex w-[350px] flex-col gap-2')],
    [
      h.submodel({
        slotId: model.collapsible.id,
        model: model.collapsible,
        view: collapsible.view,
        viewInputs: {
          title: 'Order #4189 — Shipped',
          content:
            'Shipping address: 100 Market St, San Francisco · Items: 2× Studio Headphones',
        },
        toParentMessage: (message) => Message.GotCollapsibleMessage({ message }),
      }),
    ],
  )

const foldNoOp =
  <Out>(): ((out: Out) => Update.Step<State, unknown>) =>
  () =>
  (model) => [model, []]

const foldCollapsibleOutMessage = M.type<collapsible.OutMessage>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    ChangedOpen: foldNoOp(),
  }),
)

const foldCollapsible = Update.foldChild({
  update: collapsible.update,
  read: (model: State) => Option.some(model.collapsible),
  write: (model, next) => evo(model, { collapsible: () => next }),
  toParentMessage: (message) => Message.GotCollapsibleMessage({ message }),
  foldOutMessage: foldCollapsibleOutMessage,
})

const fields = { collapsible: collapsible.Model }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { collapsible: collapsible.init({ id: 'collapsible-demo', isAnimated: true }) },
  messages: [Message.GotCollapsibleMessage],
  handlers: (model: State) => ({
    GotCollapsibleMessage: (payload: typeof Message.GotCollapsibleMessage.Type): UpdateReturn =>
      foldCollapsible(model, payload.message),
  }),
  samples: [],
  // Open state flows entirely through the submodel; the parent only sees the
  // ChangedOpen out-message, which this demo ignores.
})
