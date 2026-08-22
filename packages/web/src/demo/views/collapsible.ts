import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { disclosure } from '@foldcn/registry/styles/default/ui/collapsible'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const ToggledCollapsible = m('ToggledCollapsible', { isOpen: S.Boolean })

export const collapsibleView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full flex-col gap-4')],
    [
      disclosure<Message>(
        {
          id: 'collapsible-demo',
          isOpen: model.isCollapsibleOpen,
          onToggle: (isOpen) => ToggledCollapsible({ isOpen }),
          title: 'Can I collapse this?',
          content:
            'A single collapsible section — in foldcn this is exactly the Disclosure primitive, shared with the `disclosure` component.',
        },
        h,
      ),
    ],
  )

const fields = { isCollapsibleOpen: S.Boolean }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { isCollapsibleOpen: false },
  messages: [ToggledCollapsible],
  handlers: (model: State) => ({
    ToggledCollapsible: (payload: typeof ToggledCollapsible.Type): UpdateReturn => [
      evo(model, { isCollapsibleOpen: () => payload.isOpen }),
      [],
    ],
  }),
  samples: [ToggledCollapsible({ isOpen: true })],
})
