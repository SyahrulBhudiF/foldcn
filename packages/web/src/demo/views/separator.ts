import type { Html, HtmlBuilder } from 'foldkit/html'

import { separator } from '@foldcn/registry/styles/default/ui/separator'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

export const separatorView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-4')],
    [
      h.div([h.Class('text-sm text-muted-foreground')], ['Above']),
      separator<Message>({}, h),
      h.div([h.Class('text-sm text-muted-foreground')], ['Below']),
      h.div(
        [h.Class('flex h-24 items-center gap-4')],
        [
          h.div([h.Class('text-sm text-muted-foreground')], ['Left']),
          separator<Message>({ orientation: 'vertical' }, h),
          h.div([h.Class('text-sm text-muted-foreground')], ['Right']),
        ],
      ),
    ],
  )

export const slice = defineSlice({
  fields: {},
  init: {},
  messages: [],
  handlers: () => ({}),
})
