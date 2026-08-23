import type { Html, HtmlBuilder } from 'foldkit/html'

import { Item } from '@foldcn/registry/styles/default/ui/item'
import { spinner } from '@foldcn/registry/styles/default/ui/spinner'

import { defineSlice } from '../slice'
import type { Message, Model } from '../assemble'

export const spinnerView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full max-w-xs flex-col gap-4 [--radius:1rem]')],
    [
      Item<Message>(
        { variant: 'muted' },
        [
          Item.media<Message>({}, [spinner<Message>({}, h)], h),
          Item.content<Message>(
            {},
            [Item.title<Message>({ className: 'line-clamp-1' }, ['Processing payment...'], h)],
            h,
          ),
          Item.content<Message>(
            { className: 'flex-none justify-end' },
            [h.span([h.Class('text-sm tabular-nums')], ['$100.00'])],
            h,
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
