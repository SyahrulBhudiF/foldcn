import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { disclosure } from '@foldcn/registry/styles/default/ui/disclosure'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const ToggledDisclosureBasic = m('ToggledDisclosureBasic', { isOpen: S.Boolean })
const ToggledDisclosureAnimated = m('ToggledDisclosureAnimated', { isOpen: S.Boolean })

export const disclosureView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full flex-col gap-4')],
    [
      disclosure<Message>(
        {
          id: 'disclosure-basic',
          isOpen: model.isDisclosureBasicOpen,
          onToggle: (isOpen) => ToggledDisclosureBasic({ isOpen }),
          title: 'What is foldcn?',
          content:
            'A shadcn-style registry of copy-paste styled components built on @foldkit/ui, themed with Tailwind CSS variables.',
        },
        h,
      ),
      disclosure<Message>(
        {
          id: 'disclosure-animated',
          isOpen: model.isDisclosureAnimatedOpen,
          onToggle: (isOpen) => ToggledDisclosureAnimated({ isOpen }),
          title: 'Does it animate?',
          content:
            'Yes — pass isAnimated to smooth the panel open/close with a CSS transition instead of an instant toggle.',
          isAnimated: true,
        },
        h,
      ),
    ],
  )

const fields = { isDisclosureBasicOpen: S.Boolean, isDisclosureAnimatedOpen: S.Boolean }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { isDisclosureBasicOpen: false, isDisclosureAnimatedOpen: false },
  messages: [ToggledDisclosureBasic, ToggledDisclosureAnimated],
  handlers: (model: State) => ({
    ToggledDisclosureBasic: ({ isOpen }: typeof ToggledDisclosureBasic.Type): UpdateReturn => [
      evo(model, { isDisclosureBasicOpen: () => isOpen }),
      [],
    ],
    ToggledDisclosureAnimated: (
      { isOpen }: typeof ToggledDisclosureAnimated.Type,
    ): UpdateReturn => [evo(model, { isDisclosureAnimatedOpen: () => isOpen }), []],
  }),
  samples: [ToggledDisclosureBasic({ isOpen: true }), ToggledDisclosureAnimated({ isOpen: true })],
})
