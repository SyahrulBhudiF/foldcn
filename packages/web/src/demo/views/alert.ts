import type { Html, HtmlBuilder } from 'foldkit/html'

import { Alert } from '@foldcn/registry/styles/default/ui/alert'
import { icon } from '@foldcn/registry/styles/default/lib/icons'
import { CheckCircle2, Info } from 'lucide'

import { defineSlice } from '../slice'
import type { Message, Model } from '../assemble'

export const alertView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('grid w-full max-w-md items-start gap-4')],
    [
      Alert<Message>(
        {},
        [
          icon(h, CheckCircle2),
          Alert.title<Message>({}, ['Payment successful'], h),
          Alert.description<Message>(
            {},
            [
              'Your payment of $29.99 has been processed. A receipt has been sent to your email address.',
            ],
            h,
          ),
        ],
        h,
      ),
      Alert<Message>(
        {},
        [
          icon(h, Info),
          Alert.title<Message>({}, ['New feature available'], h),
          Alert.description<Message>(
            {},
            ["We've added dark mode support. You can enable it in your account settings."],
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
