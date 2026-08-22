import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { accordionItem } from '@foldcn/registry/styles/default/ui/accordion'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const ToggledAccordion = m('ToggledAccordion', { index: S.Number, isOpen: S.Boolean })

const ITEMS = [
  {
    id: 'accordion-accessibility',
    title: 'Is it accessible?',
    content:
      'Yes. It follows WAI-ARIA design patterns and uses the @foldkit/ui Disclosure primitive under the hood.',
  },
  {
    id: 'accordion-animation',
    title: 'Is it animated?',
    content:
      'Open and close are instant by default; pass isAnimated to smooth the panel transition.',
  },
  {
    id: 'accordion-controlled',
    title: 'Can I control it?',
    content:
      'Each item is controlled — the parent owns the open state per item and reacts to onToggle.',
  },
] as const

export const accordionView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full flex-col')],
    ITEMS.map((item, index) =>
      accordionItem<Message>(
        {
          id: item.id,
          isOpen: model.accordionOpen[index] ?? false,
          onToggle: (isOpen) => ToggledAccordion({ index, isOpen }),
          title: item.title,
          content: item.content,
        },
        h,
      ),
    ),
  )

const fields = { accordionOpen: S.Array(S.Boolean) }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { accordionOpen: [false, false, false] },
  messages: [ToggledAccordion],
  handlers: (model: State) => ({
    ToggledAccordion: (payload: typeof ToggledAccordion.Type): UpdateReturn => [
      evo(model, {
        accordionOpen: (arr) =>
          arr.map((value, i) => (i === payload.index ? payload.isOpen : value)),
      }),
      [],
    ],
  }),
  samples: [ToggledAccordion({ index: 0, isOpen: true })],
})
