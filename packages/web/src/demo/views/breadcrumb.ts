import type { Html, HtmlBuilder } from 'foldkit/html'

import { Breadcrumb } from '../../generated/registry/ui/breadcrumb'
import { icon } from '../../generated/registry/lib/icons'
import { MoreHorizontal } from 'lucide'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

export const breadcrumbView = (model: Model, h: HtmlBuilder<Message>): Html =>
  Breadcrumb(
    {},
    [
      Breadcrumb.list(
        {},
        [
          Breadcrumb.item({}, [Breadcrumb.link({}, ['Home'], h)], h),
          Breadcrumb.separator({}, [], h),
          Breadcrumb.item(
            {},
            [
              h.div(
                [h.Class('relative inline-flex')],
                [
                  h.button(
                    [
                      h.Class(
                        'inline-flex size-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      ),
                      h.AriaLabel('Toggle menu'),
                    ],
                    [
                      icon(h, MoreHorizontal, 'size-4'),
                      h.span([h.Class('sr-only')], ['Toggle menu']),
                    ],
                  ),
                ],
              ),
            ],
            h,
          ),
          Breadcrumb.separator({}, [], h),
          Breadcrumb.item({}, [Breadcrumb.link({}, ['Components'], h)], h),
          Breadcrumb.separator({}, [], h),
          Breadcrumb.item({}, [Breadcrumb.page({}, ['Breadcrumb'], h)], h),
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
