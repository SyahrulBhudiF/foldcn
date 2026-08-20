import type { Attribute, Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'

// Toggle is a two-state button (pressed / not) marked with `aria-pressed` and
// `data-state`. It is a pure presentational control — wire `onToggle` to your
// own model (mirrors shadcn's `toggle` base).

export const toggleVariantKeys = ['default', 'outline'] as const
export type ToggleVariant = (typeof toggleVariantKeys)[number]

export const toggleVariants: Record<ToggleVariant, string> = {
  default: 'bg-transparent',
  outline: 'border border-input bg-transparent shadow-xs',
}

export const toggleSizeKeys = ['default', 'sm', 'lg'] as const
export type ToggleSize = (typeof toggleSizeKeys)[number]

export const toggleSizes: Record<ToggleSize, string> = {
  default: 'h-9 px-2 min-w-9',
  sm: 'h-8 px-1.5 min-w-8',
  lg: 'h-10 px-2.5 min-w-10',
}

export const toggleBase =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-[color,box-shadow] outline-none hover:bg-muted hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:border-input [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

export type ToggleConfig<M> = Readonly<{
  variant?: ToggleVariant
  size?: ToggleSize
  isPressed?: boolean
  isDisabled?: boolean
  ariaLabel?: string
  onToggle?: (isPressed: boolean) => M
  className?: string
}>

/** A two-state toggle button. */
export const toggle = <M>(config: ToggleConfig<M>, label: Html | string, h: HtmlBuilder<M>): Html =>
  h.button(
    [
      h.Type('button'),
      ...(config.ariaLabel === undefined ? [] : [h.AriaLabel(config.ariaLabel)]),
      ...(config.isDisabled === true ? [h.Disabled(true)] : []),
      ...(config.onToggle === undefined ? [] : [h.OnClick(config.onToggle(!Boolean(config.isPressed)))]),
      h.DataAttribute('slot', 'toggle'),
      h.DataAttribute('state', config.isPressed === true ? 'on' : 'off'),
      ...(config.isPressed === true ? [h.AriaPressed('true')] : [h.AriaPressed('false')]),
      h.Class(
        cn(
          toggleBase,
          toggleVariants[config.variant ?? 'default'],
          toggleSizes[config.size ?? 'default'],
          config.className,
        ),
      ),
    ],
    [label],
  )
