import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { inputOtp } from '../../generated/registry/ui/input-otp'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const Message = defineMessageUnion({
  UpdatedOtp: { value: S.String },
})

// 6-digit OTP mirroring apps/v4/examples/base/input-otp-demo.tsx
export const inputOtpView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  inputOtp<AppMessage>(
    { length: 6, value: model.otp, onInput: (value) => Message.UpdatedOtp({ value }) },
    h,
  )

const fields = { otp: S.String }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { otp: '123456' },
  messages: [Message.UpdatedOtp],
  handlers: (model: State) => ({
    UpdatedOtp: ({ value }: typeof Message.UpdatedOtp.Type): UpdateReturn => [
      evo(model, { otp: () => value }),
      [],
    ],
  }),
  samples: [Message.UpdatedOtp({ value: '1234' })],
})
