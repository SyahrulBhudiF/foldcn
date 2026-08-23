import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { accordion } from '@foldcn/registry/styles/default/ui/accordion'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const Message = defineMessageUnion({
  ToggledAccordion: { value: S.Array(S.Boolean) },
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
  accordion<AppMessage>(
    {
      type: 'multiple',
      value: model.accordionOpen,
      onValueChange: (value) => Message.ToggledAccordion({ value }),
      className: 'max-w-lg',
      items: ITEMS.map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content,
      })),
    },
    h,
  )

const fields = { accordionOpen: S.Array(S.Boolean) }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { accordionOpen: [true, false, false] },
  messages: [Message.ToggledAccordion],
  handlers: (model: State) => ({
    ToggledAccordion: (payload: typeof Message.ToggledAccordion.Type): UpdateReturn => [
      evo(model, { accordionOpen: () => payload.value }),
      [],
    ],
  }),
  samples: [Message.ToggledAccordion({ value: [true, false, false] })],
})
