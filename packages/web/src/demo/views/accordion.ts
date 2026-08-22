import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { accordion } from '@foldcn/registry/styles/default/ui/accordion'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const ToggledAccordion = m('ToggledAccordion', { value: S.Array(S.Boolean) })

const ITEMS = [
  {
    id: 'accordion-accessibility',
    title: 'Is it accessible?',
    content:
      'Yes. It follows WAI-ARIA design patterns and uses the @foldkit/ui Disclosure primitive under the hood.',
    animate: false,
  },
  {
    id: 'accordion-animation',
    title: 'Is it animated?',
    content:
      'Open and close are instant by default; pass isAnimated to smooth the panel transition.',
    animate: true,
  },
  {
    id: 'accordion-controlled',
    title: 'Can I control it?',
    content:
      'The group is controlled — the parent owns the open-state array and reacts to onValueChange.',
    animate: false,
  },
] as const

export const accordionView = (model: Model, h: HtmlBuilder<Message>): Html =>
  accordion<Message>(
    {
      type: 'multiple',
      value: model.accordionOpen,
      onValueChange: (value) => ToggledAccordion({ value }),
      items: ITEMS.map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        isAnimated: item.animate,
      })),
    },
    h,
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
      evo(model, { accordionOpen: () => payload.value }),
      [],
    ],
  }),
  samples: [ToggledAccordion({ value: [true, false, false] })],
})
