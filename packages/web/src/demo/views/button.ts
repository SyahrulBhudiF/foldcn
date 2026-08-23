import type { Html, HtmlBuilder } from 'foldkit/html'

import { button } from '@foldcn/registry/styles/default/ui/button'
import { icon } from '@foldcn/registry/styles/default/lib/icons'
import { ArrowUp } from 'lucide'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

export const buttonView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex flex-wrap items-center gap-2 md:flex-row')],
    [
      button<Message>({ variant: 'outline' }, 'Button', h),
      button<Message>({ variant: 'outline', size: 'icon' }, icon(h, ArrowUp), h, [
        h.AriaLabel('Submit'),
      ]),
    ],
  )

export const slice = defineSlice({
  fields: {},
  init: {},
  messages: [],
  handlers: (_model: unknown) => ({}),
})
