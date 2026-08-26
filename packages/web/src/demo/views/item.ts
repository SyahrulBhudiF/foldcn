import type { Html, HtmlBuilder } from 'foldkit/html'

import { button } from '../../generated/registry/ui/button'
import { Item } from '../../generated/registry/ui/item'
import { icon } from '../../generated/registry/lib/icons'
import { BadgeCheck, ChevronRight } from 'lucide'

import { defineSlice } from '../slice'
import type { Message, Model } from '../assemble'

export const itemView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full max-w-md flex-col gap-6')],
    [
      Item<Message>(
        { variant: 'outline' },
        [
          Item.content<Message>(
            {},
            [
              Item.title<Message>({}, ['Basic Item'], h),
              Item.description<Message>({}, ['A simple item with title and description.'], h),
            ],
            h,
          ),
          Item.actions<Message>(
            {},
            [button<Message>({ variant: 'outline', size: 'sm' }, 'Action', h)],
            h,
          ),
        ],
        h,
      ),
      Item<Message>(
        { variant: 'outline', size: 'sm' },
        [
          Item.media<Message>({}, [icon(h, BadgeCheck, 'size-5')], h),
          Item.content<Message>(
            {},
            [Item.title<Message>({}, ['Your profile has been verified.'], h)],
            h,
          ),
          Item.actions<Message>({}, [icon(h, ChevronRight, 'size-4')], h),
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
