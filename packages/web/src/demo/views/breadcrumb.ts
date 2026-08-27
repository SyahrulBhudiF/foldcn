import type { Html, HtmlBuilder } from 'foldkit/html'

import { Breadcrumb } from '../../generated/registry/ui/breadcrumb'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

export const breadcrumbView = (_model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full flex-col gap-8')],
    [
      h.div(
        [h.Class('flex w-full flex-col gap-2')],
        [
          h.div([h.Class('px-1 text-xs font-medium text-muted-foreground')], ['Basic']),
          Breadcrumb(
            {},
            [
              Breadcrumb.list(
                {},
                [
                  Breadcrumb.item({}, [Breadcrumb.link({}, ['Home'], h)], h),
                  Breadcrumb.separator({}, [], h),
                  Breadcrumb.item({}, [Breadcrumb.link({}, ['Components'], h)], h),
                  Breadcrumb.separator({}, [], h),
                  Breadcrumb.item({}, [Breadcrumb.page({}, ['Breadcrumb'], h)], h),
                ],
                h,
              ),
            ],
            h,
          ),
        ],
      ),
      h.div(
        [h.Class('flex w-full flex-col gap-2')],
        [
          h.div([h.Class('px-1 text-xs font-medium text-muted-foreground')], ['With Dropdown']),
          Breadcrumb(
            {},
            [
              Breadcrumb.list(
                {},
                [
                  Breadcrumb.item({}, [Breadcrumb.link({}, ['Home'], h)], h),
                  Breadcrumb.separator({}, [], h),
                  Breadcrumb.ellipsis({}, [], h),
                  Breadcrumb.separator({}, [], h),
                  Breadcrumb.item({}, [Breadcrumb.link({}, ['Components'], h)], h),
                  Breadcrumb.separator({}, [], h),
                  Breadcrumb.item({}, [Breadcrumb.page({}, ['Breadcrumb'], h)], h),
                ],
                h,
              ),
            ],
            h,
          ),
        ],
      ),
      h.div(
        [h.Class('flex w-full flex-col gap-2')],
        [
          h.div([h.Class('px-1 text-xs font-medium text-muted-foreground')], ['With Link']),
          Breadcrumb(
            {},
            [
              Breadcrumb.list(
                {},
                [
                  Breadcrumb.item({}, [Breadcrumb.link({}, ['Home'], h)], h),
                  Breadcrumb.separator({}, [], h),
                  Breadcrumb.ellipsis({}, [], h),
                  Breadcrumb.separator({}, [], h),
                  Breadcrumb.item({}, [Breadcrumb.link({}, ['Components'], h)], h),
                  Breadcrumb.separator({}, [], h),
                  Breadcrumb.item({}, [Breadcrumb.page({}, ['Breadcrumb'], h)], h),
                ],
                h,
              ),
            ],
            h,
          ),
        ],
      ),
    ],
  )

export const slice = defineSlice({
  fields: {},
  init: {},
  messages: [],
  handlers: () => ({}),
})
