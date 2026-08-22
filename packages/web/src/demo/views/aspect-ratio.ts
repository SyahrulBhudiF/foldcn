import type { Html, HtmlBuilder } from 'foldkit/html'

import { aspectRatio } from '@foldcn/registry/styles/default/ui/aspect-ratio'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

export const aspectRatioView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('w-full max-w-sm')],
    [
      aspectRatio<Message>(
        { ratio: 16 / 9 },
        [
          h.div(
            [
              h.Class(
                'flex h-full w-full items-center justify-center rounded-lg border bg-muted text-sm text-muted-foreground',
              ),
            ],
            ['16 / 9'],
          ),
        ],
        h,
      ),
    ],
  )

export const slice = defineSlice({
  fields: {},
  init: {},
  messages: [],
  handlers: () => ({}),
})
