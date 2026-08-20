import type { Attribute, Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'

// InputOtp renders a row of single-character slots backed by one combined
// string `value`. It is a presentational control — wire `onInput` to keep your
// model in sync and `onComplete` to react when every slot is filled (mirrors
// shadcn's `input-otp` base surface).

export const inputOtpClass = 'flex items-center gap-2 has-disabled:opacity-50'

export const inputOtpSlotClass =
  'relative flex h-10 w-9 items-center justify-center rounded-md border border-input text-base tabular-nums shadow-xs outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40'

export type InputOtpConfig<M> = Readonly<{
  length: number
  value: string
  onInput?: (value: string) => M
  onComplete?: (value: string) => M
  isDisabled?: boolean
  autoFocus?: boolean
  className?: string
}>

/** A row of single-character OTP slots. */
export const inputOtp = <M>(config: InputOtpConfig<M>, h: HtmlBuilder<M>): Html => {
  const chars = config.value.split('')
  const slotAttributes = (index: number): ReadonlyArray<Attribute<M>> => [
    h.Type('text'),
    h.Attribute('inputmode', 'numeric'),
    h.Attribute('maxlength', '1'),
    h.Attribute('autocomplete', 'one-time-code'),
    h.Pattern('[0-9]'),
    ...(config.isDisabled === true ? [h.Disabled(true)] : []),
    ...(config.autoFocus === true && index === 0 ? [h.Autofocus(true)] : []),
    h.Value(chars[index] ?? ''),
    h.Class(inputOtpSlotClass),
    h.DataAttribute('slot', 'input-otp-slot'),
    ...(config.onInput === undefined && config.onComplete === undefined
      ? []
      : [
          h.OnInput((raw) => {
            const nextChar = raw.replace(/\D/g, '').slice(-1)
            const arr = config.value.split('')
            while (arr.length < config.length) arr.push('')
            arr[index] = nextChar
            const newValue = arr.join('').slice(0, config.length)
            const isComplete = newValue.length === config.length && !newValue.includes('')
            return isComplete && config.onComplete !== undefined
              ? config.onComplete(newValue)
              : config.onInput!(newValue)
          }),
        ]),
  ]
  return h.div(
    [h.Class(cn(inputOtpClass, config.className)), h.DataAttribute('slot', 'input-otp')],
    Array.from({ length: config.length }, (_, index) => h.input(slotAttributes(index))),
  )
}
