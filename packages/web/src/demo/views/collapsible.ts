import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { collapsible } from '@foldcn/registry/styles/default/ui/collapsible'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const ToggledCollapsible = m('ToggledCollapsible', { isOpen: S.Boolean })

// Single-section disclosure mirroring apps/v4/examples/base/collapsible-demo.tsx
// (Order #4189). The upstream demo shows an always-visible Status row outside
// the collapsible; foldcn's Disclosure primitive owns the whole panel, so the
// title carries the order header and the content holds the details that toggle.
export const collapsibleView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-[350px] flex-col gap-2')],
    [
      collapsible<Message>(
        {
          id: 'collapsible-demo',
          isOpen: model.isCollapsibleOpen,
          onToggle: (isOpen) => ToggledCollapsible({ isOpen }),
          title: 'Order #4189 — Shipped',
          content:
            'Shipping address: 100 Market St, San Francisco · Items: 2× Studio Headphones',
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
