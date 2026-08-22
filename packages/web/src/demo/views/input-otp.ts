import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { inputOtp } from '@foldcn/registry/styles/default/ui/input-otp'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const UpdatedOtp = m('UpdatedOtp', { value: S.String })

export const inputOtpView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-4')],
    [
      inputOtp<Message>(
        { length: 6, value: model.otp, onInput: (value) => UpdatedOtp({ value }), autoFocus: true },
        h,
      ),
      h.p(
        [h.Class('text-sm text-muted-foreground')],
        [model.otp === '' ? 'Enter the 6-digit code.' : `Entered: ${model.otp}`],
      ),
    ],
  )

const fields = { otp: S.String }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { otp: '' },
  messages: [UpdatedOtp],
  handlers: (model: State) => ({
    UpdatedOtp: ({ value }: typeof UpdatedOtp.Type): UpdateReturn => [
      evo(model, { otp: () => value }),
      [],
    ],
  }),
  samples: [UpdatedOtp({ value: '1234' })],
})
