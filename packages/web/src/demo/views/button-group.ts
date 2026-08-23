import type { Html, HtmlBuilder } from 'foldkit/html'

import { button } from '@foldcn/registry/styles/default/ui/button'
import { buttonGroup } from '@foldcn/registry/styles/default/ui/button-group'
import { icon } from '@foldcn/registry/styles/default/lib/icons'
import { ArrowLeft, MoreHorizontal } from 'lucide'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

export const buttonGroupView = (model: Model, h: HtmlBuilder<Message>): Html =>
  buttonGroup<Message>(
    {},
    [
      buttonGroup<Message>(
        { className: 'hidden sm:flex' },
        [
          button<Message>({ variant: 'outline', size: 'icon' }, icon(h, ArrowLeft), h, [
            h.AriaLabel('Go Back'),
          ]),
        ],
        h,
      ),
      buttonGroup<Message>(
        {},
        [
          button<Message>({ variant: 'outline' }, 'Archive', h),
          button<Message>({ variant: 'outline' }, 'Report', h),
        ],
        h,
      ),
      buttonGroup<Message>(
        {},
        [
          button<Message>({ variant: 'outline' }, 'Snooze', h),
          button<Message>({ variant: 'outline', size: 'icon' }, icon(h, MoreHorizontal), h, [
            h.AriaLabel('More Options'),
          ]),
        ],
        h,
      ),
    ],
    h,
  )

export const slice = defineSlice({
  fields: {},
  init: {},
  messages: [],
  handlers: () => ({}),
})
