import type { Html, HtmlBuilder } from 'foldkit/html'

import { aspectRatio } from '../../generated/registry/ui/aspect-ratio'

import { defineSlice } from '../slice'
import type { Message, Model } from '../assemble'

export const aspectRatioView = (model: Model, h: HtmlBuilder<Message>): Html =>
  aspectRatio<Message>(
    { ratio: 16 / 9, className: 'w-full max-w-sm rounded-lg bg-muted' },
    [
      h.img([
        h.Src('https://avatar.vercel.sh/shadcn1'),
        h.Alt('Photo'),
        h.Class('rounded-lg object-cover grayscale dark:brightness-20'),
        h.Style({
          position: 'absolute',
          height: '100%',
          width: '100%',
          left: '0',
          top: '0',
          right: '0',
          bottom: '0',
          color: 'transparent',
        }),
      ]),
    ],
    h,
  )

export const slice = defineSlice({
  fields: {},
  init: {},
  messages: [],
  handlers: () => ({}),
})
