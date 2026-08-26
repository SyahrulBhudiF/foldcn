import type { Html, HtmlBuilder } from 'foldkit/html'

import { progress } from '../../generated/registry/ui/progress'

import { defineSlice } from '../slice'
import type { Message, Model } from '../assemble'

export const progressView = (model: Model, h: HtmlBuilder<Message>): Html =>
  progress<Message>({ value: 66, className: 'w-[60%]' }, h)

export const slice = defineSlice({
  fields: {},
  init: {},
  messages: [],
  handlers: () => ({}),
})
