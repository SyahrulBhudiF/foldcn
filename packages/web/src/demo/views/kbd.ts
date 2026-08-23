import type { Html, HtmlBuilder } from 'foldkit/html'

import { Kbd } from '@foldcn/registry/styles/default/ui/kbd'

import { defineSlice } from '../slice'
import type { Message, Model } from '../assemble'

export const kbdView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex flex-col items-center gap-4')],
    [
      Kbd.group<Message>(
        {},
        [
          Kbd<Message>({}, ['⌘'], h),
          Kbd<Message>({}, ['⇧'], h),
          Kbd<Message>({}, ['⌥'], h),
          Kbd<Message>({}, ['⌃'], h),
        ],
        h,
      ),
      Kbd.group<Message>(
        {},
        [Kbd<Message>({}, ['Ctrl'], h), h.span([], ['+']), Kbd<Message>({}, ['B'], h)],
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
