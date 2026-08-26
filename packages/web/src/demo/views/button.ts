import type { Html, HtmlBuilder } from 'foldkit/html'

import { button } from '../../generated/registry/ui/button'
import { icon } from '../../generated/registry/lib/icons'
import { ArrowUp } from 'lucide'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

export const buttonView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex flex-wrap items-center gap-2 md:flex-row')],
    [
      button<Message>({ variant: 'outline' }, 'Button', h),
      button<Message>(
        { variant: 'outline', size: 'icon', attributes: [h.AriaLabel('Submit')] },
        icon(h, ArrowUp),
        h,
      ),
    ],
  )

export const slice = defineSlice({
  fields: {},
  init: {},
  messages: [],
  handlers: (_model: unknown) => ({}),
})
