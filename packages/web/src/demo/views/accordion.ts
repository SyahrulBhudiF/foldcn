import type { Html, HtmlBuilder } from 'foldkit/html'

import { accordion } from '@foldcn/registry/src/ui/accordion'

import { ToggledAccordion, type Message } from '../message'
import type { Model } from '../model'

const ITEMS = [
  {
    id: 'accordion-accessibility',
    title: 'Is it accessible?',
    animate: false,
    content:
      'Yes. It follows WAI-ARIA design patterns and uses the @foldkit/ui Disclosure primitive under the hood.',
  },
  {
    id: 'accordion-animation',
    title: 'Is it animated?',
    animate: true,
    content:
      'Open and close are instant by default; pass isAnimated to smooth the panel transition.',
  },
  {
    id: 'accordion-controlled',
    title: 'Can I control it?',
    animate: false,
    content:
      'Each item is controlled — the parent owns the open state per item and reacts to onToggle.',
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
