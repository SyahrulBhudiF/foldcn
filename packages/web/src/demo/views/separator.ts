import type { Html, HtmlBuilder } from 'foldkit/html'

import { separator } from '@foldcn/registry/styles/default/ui/separator'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

export const separatorView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex max-w-sm flex-col gap-4 text-sm')],
    [
      h.div(
        [h.Class('flex flex-col gap-1.5')],
        [
          h.div([h.Class('leading-none font-medium')], ['shadcn/ui']),
          h.div([h.Class('text-muted-foreground')], ['The Foundation for your Design System']),
        ],
      ),
      separator<Message>({}, h),
      h.div(
        [],
        ['A set of beautifully designed components that you can customize, extend, and build on.'],
      ),
    ],
  )

export const slice = defineSlice({
  fields: {},
  init: {},
  messages: [],
  handlers: () => ({}),
})
