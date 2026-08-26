import type { Html, HtmlBuilder } from 'foldkit/html'

import { button } from '../../generated/registry/ui/button'
import { Empty } from '../../generated/registry/ui/empty'
import { icon } from '../../generated/registry/lib/icons'
import { ArrowUpRight, FolderCode } from 'lucide'

import { defineSlice } from '../slice'
import type { Message, Model } from '../assemble'

export const emptyView = (model: Model, h: HtmlBuilder<Message>): Html =>
  Empty<Message>(
    {},
    [
      Empty.header<Message>(
        {},
        [
          Empty.media<Message>({ variant: 'icon' }, [icon(h, FolderCode)], h),
          Empty.title<Message>({}, ['No Projects Yet'], h),
          Empty.description<Message>(
            {},
            ["You haven't created any projects yet. Get started by creating your first project."],
            h,
          ),
        ],
        h,
      ),
      Empty.content<Message>(
        { className: 'flex-row justify-center gap-2' },
        [
          button<Message>({}, 'Create Project', h),
          button<Message>({ variant: 'outline' }, 'Import Project', h),
        ],
        h,
      ),
      h.div(
        [h.Class('flex justify-center')],
        [
          button<Message>(
            { variant: 'link', size: 'sm', className: 'text-muted-foreground' },
            // shadcn link button renders as <a> with ArrowUpRightIcon
            h.span(
              [h.Class('inline-flex items-center gap-1')],
              ['Learn More ', icon(h, ArrowUpRight)],
            ),
            h,
          ),
        ],
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
