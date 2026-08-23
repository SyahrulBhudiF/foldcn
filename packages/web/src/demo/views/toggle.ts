import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { toggle } from '@foldcn/registry/styles/default/ui/toggle'
import { icon } from '@foldcn/registry/styles/default/lib/icons'
import { Bookmark } from 'lucide'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const ToggledToggle = m('ToggledToggle', { isPressed: S.Boolean })

export const toggleView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-4')],
    [
      toggle<Message>(
        {
          variant: 'outline',
          size: 'sm',
          isPressed: model.isToggleOn,
          onToggle: (isPressed) => ToggledToggle({ isPressed }),
          ariaLabel: 'Toggle bookmark',
        },
        h.span([], [icon(h, Bookmark, 'size-4 shrink-0 group-aria-pressed/toggle:fill-foreground'), ' Bookmark']),
        h,
      ),
    ],
  )

const fields = { isToggleOn: S.Boolean }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { isToggleOn: false },
  messages: [ToggledToggle],
  handlers: (model: State) => ({
    ToggledToggle: ({ isPressed }: typeof ToggledToggle.Type): UpdateReturn => [
      evo(model, { isToggleOn: () => isPressed }),
      [],
    ],
  }),
  samples: [ToggledToggle({ isPressed: true })],
})
