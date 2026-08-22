import { Schema as S } from 'effect'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { button } from '@foldcn/registry/styles/default/ui/button'
import { Card } from '@foldcn/registry/styles/default/ui/card'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

export const cardView = (model: Model, h: HtmlBuilder<Message>): Html =>
  Card<Message>(
    {},
    [
      Card.header<Message>(
        {},
        [
          Card.title<Message>({}, ['Card title'], h),
          Card.description<Message>(
            {},
            ['Cards group related content. Wrap a header, body and footer — or just a body.'],
            h,
          ),
        ],
        h,
      ),
      Card.content<Message>(
        {},
        [
          h.p(
            [h.Class('text-sm text-muted-foreground')],
            ['You can add as much content as you like here, in any layout.'],
          ),
        ],
        h,
      ),
      Card.footer<Message>({}, [button<Message>({ size: 'sm' }, 'Action', h)], h),
    ],
    h,
  )

const fields = {} as const
const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: {},
  messages: [],
  handlers: (model: State) => {
    void model
    return {}
  },
})
