import type { Html, HtmlBuilder } from 'foldkit/html'

import { badge } from '../../generated/registry/ui/badge'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

export const badgeView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full flex-wrap justify-center gap-2')],
    [
      badge<Message>({}, ['Badge'], h),
      badge<Message>({ variant: 'secondary' }, ['Secondary'], h),
      badge<Message>({ variant: 'destructive' }, ['Destructive'], h),
      badge<Message>({ variant: 'outline' }, ['Outline'], h),
    ],
  )

export const slice = defineSlice({
  fields: {},
  init: {},
  messages: [],
  handlers: () => ({}),
})
