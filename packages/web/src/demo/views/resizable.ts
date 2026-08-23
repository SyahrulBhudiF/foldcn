import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { resizable } from '@foldcn/registry/styles/default/ui/resizable'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const Message = defineMessageUnion({
  ResizedSplit: { percent: S.Number },
})

// Two-pane horizontal split mirroring apps/v4/examples/base/resizable-demo.tsx
// (upstream nests a vertical group in the second pane; foldcn's resizable is
// fixed two panes, so we show One | Two).
export const resizableView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  h.div(
    [h.Class('max-w-sm rounded-lg border')],
    [
      resizable<AppMessage>(
        {
          value: model.resizablePercent,
          onValueChange: (percent) => Message.ResizedSplit({ percent }),
          firstPane: {
            content: h.div(
              [h.Class('flex h-[200px] items-center justify-center p-6')],
              [h.span([h.Class('font-semibold')], ['One'])],
            ),
          },
          secondPane: {
            content: h.div(
              [h.Class('flex h-[200px] items-center justify-center p-6')],
              [h.span([h.Class('font-semibold')], ['Two'])],
            ),
          },
        },
        h,
      ),
    ],
  )

const fields = { resizablePercent: S.Number }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { resizablePercent: 50 },
  messages: [Message.ResizedSplit],
  handlers: (model: State) => ({
    ResizedSplit: ({ percent }: typeof Message.ResizedSplit.Type): UpdateReturn => [
      evo(model, { resizablePercent: () => percent }),
      [],
    ],
  }),
  samples: [Message.ResizedSplit({ percent: 70 })],
})
