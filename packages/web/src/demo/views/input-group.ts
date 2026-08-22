import type { Html, HtmlBuilder } from 'foldkit/html'

import {
  inputGroup,
  inputGroupAddon,
  inputGroupButton,
  inputGroupText,
  inputGroupInput,
} from '@foldcn/registry/styles/default/ui/input-group'
import { icon } from '@foldcn/registry/styles/default/lib/icons'
import { Search, Mail, CreditCard, Check, Star, Info } from 'lucide'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

// Mirrors the upstream base-registry examples: text/icons ride inside
// `inputGroupAddon` (which owns the padding/alignment), never flush against
// the group frame.
export const inputGroupView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-4')],
    [
      inputGroup(
        {},
        [
          inputGroupAddon({}, [icon(h, Search)], h),
          inputGroupInput({ id: 'ig-search', placeholder: 'Search…' }, h),
        ],
        h,
      ),
      inputGroup(
        {},
        [
          inputGroupAddon({}, [icon(h, Mail)], h),
          inputGroupInput({ id: 'ig-email', placeholder: 'Enter your email' }, h),
        ],
        h,
      ),
      inputGroup(
        {},
        [
          inputGroupAddon({}, [icon(h, CreditCard)], h),
          inputGroupInput({ id: 'ig-card', placeholder: 'Card number' }, h),
          inputGroupAddon({ align: 'inline-end' }, [icon(h, Check)], h),
        ],
        h,
      ),
      inputGroup(
        {},
        [
          inputGroupAddon({}, [icon(h, CreditCard)], h),
          inputGroupInput({ id: 'ig-card-actions', placeholder: 'Card number' }, h),
          inputGroupAddon(
            { align: 'inline-end' },
            [
              inputGroupButton({ size: 'icon-xs' }, icon(h, Star), h),
              inputGroupButton({ size: 'icon-xs' }, icon(h, Info), h),
            ],
            h,
          ),
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
