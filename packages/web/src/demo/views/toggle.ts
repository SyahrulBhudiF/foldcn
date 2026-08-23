import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { toggle } from '@foldcn/registry/styles/default/ui/toggle'
import { icon } from '@foldcn/registry/styles/default/lib/icons'
import { Bookmark } from 'lucide'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const Message = defineMessageUnion({
  ToggledToggle: { isPressed: S.Boolean },
})

export const toggleView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-4')],
    [
      toggle<AppMessage>(
        {
          variant: 'outline',
          size: 'sm',
          isPressed: model.isToggleOn,
          onToggle: (isPressed) => Message.ToggledToggle({ isPressed }),
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
  messages: [Message.ToggledToggle],
  handlers: (model: State) => ({
    ToggledToggle: ({ isPressed }: typeof Message.ToggledToggle.Type): UpdateReturn => [
      evo(model, { isToggleOn: () => isPressed }),
      [],
    ],
  }),
  samples: [Message.ToggledToggle({ isPressed: true })],
})
