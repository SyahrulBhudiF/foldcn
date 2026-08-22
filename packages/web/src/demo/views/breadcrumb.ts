import type { Html, HtmlBuilder } from 'foldkit/html'

import { Breadcrumb } from '@foldcn/registry/styles/default/ui/breadcrumb'

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
