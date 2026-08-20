import type { Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'

// InputOtp renders one transparent <input> overlaid across a row of visual
// slots. Every keystroke lands in that single input, so the browser handles
// the hard parts natively — auto-advancing as digits are typed, stepping back
// on Backspace, arrow-key navigation, and pasting a full code into the slots —
// the way shadcn's `input-otp` base surface does through the `input-otp`
// library. The slots are purely presentational: each shows one character of
// `value`, and the active (next-to-fill) slot shows a blinking caret.

export const inputOtpClass = 'relative flex items-center gap-2 has-[:disabled]:opacity-50'

export const inputOtpInputClass =
  'absolute inset-0 z-10 h-full w-full rounded-md bg-transparent text-transparent caret-transparent outline-none'

export const inputOtpSlotClass =
  'relative flex h-10 w-9 items-center justify-center rounded-md border border-input text-base tabular-nums shadow-xs outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 data-[active=true]:border-ring data-[active=true]:ring-[3px] data-[active=true]:ring-ring/50'

export type InputOtpConfig<M> = Readonly<{
  length: number
  value: string
  onInput?: (value: string) => M
  onComplete?: (value: string) => M
  isDisabled?: boolean
  autoFocus?: boolean
  className?: string
}>

/** A row of single-character OTP slots backed by one combined string `value`. */
export const inputOtp = <M>(config: InputOtpConfig<M>, h: HtmlBuilder<M>): Html => {
  const digits = config.value.replace(/\D/g, '').slice(0, config.length).split('')
  const isComplete = digits.length >= config.length
  const activeIndex = isComplete ? -1 : digits.length

  const slot = (index: number): Html =>
    h.div(
      [
        h.Class(inputOtpSlotClass),
        h.DataAttribute('slot', 'input-otp-slot'),
        ...(index === activeIndex ? [h.DataAttribute('active', 'true')] : []),
      ],
      [
        digits[index] ?? '',
        index === activeIndex
          ? h.div(
              [h.Class('pointer-events-none absolute inset-0 flex items-center justify-center')],
              [h.div([h.Class('h-4 w-px bg-foreground animate-caret-blink duration-1000')], [])],
            )
          : null,
      ],
    )

  return h.div(
    [h.Class(cn(inputOtpClass, config.className)), h.DataAttribute('slot', 'input-otp')],
    [
      h.input([
        h.Type('text'),
        h.InputMode('numeric'),
        h.Attribute('autocomplete', 'one-time-code'),
        h.Maxlength(config.length),
        h.Spellcheck(false),
        ...(config.isDisabled === true ? [h.Disabled(true)] : []),
        ...(config.autoFocus === true ? [h.Autofocus(true)] : []),
        h.Value(digits.join('')),
        h.Class(inputOtpInputClass),
        h.DataAttribute('slot', 'input-otp-input'),
        ...(config.onInput === undefined && config.onComplete === undefined
          ? []
          : [
              h.OnInput((raw) => {
                const next = raw.replace(/\D/g, '').slice(0, config.length)
                if (config.onComplete !== undefined && next.length === config.length) {
                  return config.onComplete(next)
                }
                if (config.onInput !== undefined) {
                  return config.onInput(next)
                }
                return config.onComplete!(next)
              }),
            ]),
      ]),
      ...Array.from({ length: config.length }, (_, index) => slot(index)),
    ],
  )
}
