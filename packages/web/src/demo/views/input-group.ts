import type { Html, HtmlBuilder } from 'foldkit/html'

import {
  inputGroup,
  inputGroupAddon,
  inputGroupInput,
} from '@foldcn/registry/styles/default/ui/input-group'
import { icon } from '@foldcn/registry/styles/default/lib/icons'
import { Search } from 'lucide'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

// Minimal demo mirroring apps/v4/examples/base/input-group-demo.tsx
export const inputGroupView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-4')],
    [
      inputGroup(
        { className: 'max-w-xs' },
        [
          inputGroupInput({ id: 'input-group-demo', placeholder: 'Search…' }, h),
          inputGroupAddon({}, [icon(h, Search)], h),
          inputGroupAddon({ align: 'inline-end' }, ['12 results'], h),
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
