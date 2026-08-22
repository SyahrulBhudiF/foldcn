import type { Html, HtmlBuilder } from 'foldkit/html'

import { Avatar } from '@foldcn/registry/styles/default/ui/avatar'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

export const avatarView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex flex-col gap-6')],
    [
      h.div(
        [h.Class('flex items-center gap-4')],
        [
          Avatar<Message>({ size: 'sm' }, [Avatar.fallback<Message>({}, ['FK'], h)], h),
          Avatar<Message>({}, [Avatar.fallback<Message>({}, ['FK'], h)], h),
          Avatar<Message>({ size: 'lg' }, [Avatar.fallback<Message>({}, ['FK'], h)], h),
        ],
      ),
      Avatar.group<Message>(
        {},
        [
          Avatar<Message>({}, [Avatar.fallback<Message>({}, ['A'], h)], h),
          Avatar<Message>({}, [Avatar.fallback<Message>({}, ['B'], h)], h),
          Avatar<Message>({}, [Avatar.fallback<Message>({}, ['C'], h)], h),
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
