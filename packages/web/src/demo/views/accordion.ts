import { Update } from 'foldkit'
import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import * as accordion from '../../generated/registry/ui/accordion'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const Message = defineMessageUnion({
  GotAccordionMessage: { message: accordion.Message },
})

// Mirrors apps/v4/examples/base/accordion-demo.tsx
const ITEMS = [
  {
    id: 'shipping',
    title: 'What are your shipping options?',
    content:
      'We offer standard (5-7 days), express (2-3 days), and overnight shipping. Free shipping on international orders.',
  },
  {
    id: 'returns',
    title: 'What is your return policy?',
    content:
      'Returns accepted within 30 days. Items must be unused and in original packaging. Refunds processed within 5-7 business days.',
  },
  {
    id: 'support',
    title: 'How can I contact customer support?',
    content:
      'Reach us via email, live chat, or phone. We respond within 24 hours during business days.',
  },
] as const

export const accordionView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  h.submodel({
    slotId: model.accordion.id,
    model: model.accordion,
    view: accordion.view,
    viewInputs: {
      className: 'max-w-lg',
      items: ITEMS.map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content,
      })),
    },
    toParentMessage: (message) => Message.GotAccordionMessage({ message }),
  })

const foldNoOp =
  <Out>(): ((out: Out) => Update.Step<State, unknown>) =>
  () =>
  (model) => [model, []]

const foldAccordionOutMessage = M.type<accordion.OutMessage>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    ChangedValue: foldNoOp(),
  }),
)

const foldAccordion = Update.foldChild({
  update: accordion.update,
  read: (model: State) => Option.some(model.accordion),
  write: (model, next) => evo(model, { accordion: () => next }),
  toParentMessage: (message) => Message.GotAccordionMessage({ message }),
  foldOutMessage: foldAccordionOutMessage,
})

const fields = { accordion: accordion.Model }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: {
    accordion: accordion.init({
      id: 'accordion-demo',
      type: 'multiple',
      value: [true, false, false],
    }),
  },
  messages: [Message.GotAccordionMessage],
  handlers: (model: State) => ({
    GotAccordionMessage: (payload: typeof Message.GotAccordionMessage.Type): UpdateReturn =>
      foldAccordion(model, payload.message),
  }),
  samples: [],
  // Open state flows entirely through the submodel; the parent only sees the
  // ChangedValue out-message, which this demo ignores.
})
