import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { resizable } from '@foldcn/registry/styles/default/ui/resizable'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const ResizedSplit = m('ResizedSplit', { percent: S.Number })

export const resizableView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('h-48 w-full rounded-md border')],
    [
      resizable<Message>(
        {
          value: model.resizablePercent,
          onValueChange: (percent) => ResizedSplit({ percent }),
          firstPane: {
            content: h.div(
              [
                h.Class(
                  'flex h-full items-center justify-center p-4 text-sm text-muted-foreground',
                ),
              ],
              ['Sidebar'],
            ),
            className: 'bg-muted/30',
          },
          secondPane: {
            content: h.div(
              [h.Class('flex h-full items-center justify-center p-4 text-sm')],
              ['Content'],
            ),
            className: 'bg-muted/30',
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
  messages: [ResizedSplit],
  handlers: (model: State) => ({
    ResizedSplit: ({ percent }: typeof ResizedSplit.Type): UpdateReturn => [
      evo(model, { resizablePercent: () => percent }),
      [],
    ],
  }),
  samples: [ResizedSplit({ percent: 70 })],
})
