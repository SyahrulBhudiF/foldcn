import type { Html, HtmlBuilder } from 'foldkit/html'

import { skeleton } from '../../generated/registry/ui/skeleton'

import { defineSlice } from '../slice'
import type { Message, Model } from '../assemble'

export const skeletonView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex items-center gap-4')],
    [
      skeleton<Message>({ className: 'h-12 w-12 rounded-full' }, [], h),
      h.div(
        [h.Class('space-y-2')],
        [
          skeleton<Message>({ className: 'h-4 w-[250px]' }, [], h),
          skeleton<Message>({ className: 'h-4 w-[200px]' }, [], h),
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
