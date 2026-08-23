import type { Html, HtmlBuilder } from 'foldkit/html'

import { Avatar } from '@foldcn/registry/styles/default/ui/avatar'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

export const avatarView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex flex-row flex-wrap items-center gap-6 md:gap-12')],
    [
      Avatar<Message>(
        {},
        [
          Avatar.image<Message>(
            { src: 'https://github.com/shadcn.png', alt: '@shadcn', className: 'grayscale' },
            h,
          ),
          Avatar.fallback<Message>({}, ['CN'], h),
        ],
        h,
      ),
      Avatar<Message>(
        {},
        [
          Avatar.image<Message>({ src: 'https://github.com/evilrabbit.png', alt: '@evilrabbit' }, h),
          Avatar.fallback<Message>({}, ['ER'], h),
          Avatar.badge<Message>({ className: 'bg-green-600 dark:bg-green-800' }, [], h),
        ],
        h,
      ),
      Avatar.group<Message>(
        { className: 'grayscale' },
        [
          Avatar<Message>(
            {},
            [
              Avatar.image<Message>({ src: 'https://github.com/shadcn.png', alt: '@shadcn' }, h),
              Avatar.fallback<Message>({}, ['CN'], h),
            ],
            h,
          ),
          Avatar<Message>(
            {},
            [
              Avatar.image<Message>({ src: 'https://github.com/maxleiter.png', alt: '@maxleiter' }, h),
              Avatar.fallback<Message>({}, ['LR'], h),
            ],
            h,
          ),
          Avatar<Message>(
            {},
            [
              Avatar.image<Message>({ src: 'https://github.com/evilrabbit.png', alt: '@evilrabbit' }, h),
              Avatar.fallback<Message>({}, ['ER'], h),
            ],
            h,
          ),
          Avatar.groupCount<Message>({}, ['+3'], h),
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
