import type { Html, HtmlBuilder } from 'foldkit/html'

import { Marker } from '@foldcn/registry/styles/default/ui/marker'
import { icon } from '@foldcn/registry/styles/default/lib/icons'
import { Check } from 'lucide'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

export const markerView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full max-w-md flex-col gap-2')],
    [
      Marker<Message>(
        {},
        [
          Marker.icon<Message>({}, [icon(h, Check)], h),
          Marker.content<Message>({}, ['Default marker with an icon and content.'], h),
        ],
        h,
      ),
      Marker<Message>(
        { variant: 'separator' },
        [Marker.content<Message>({}, ['Separator marker'], h)],
        h,
      ),
      Marker<Message>(
        { variant: 'border' },
        [Marker.content<Message>({}, ['Border marker'], h)],
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
