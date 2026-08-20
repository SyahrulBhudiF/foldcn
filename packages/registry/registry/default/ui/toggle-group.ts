import type { Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'
import { icon } from '@/lib/icons'
import { toggle, type ToggleSize, type ToggleVariant } from './toggle'

type IconNode = Parameters<typeof icon>[1]
type Child = Html | string

// ToggleGroup is a set of connected toggles that share a single (or multiple)
// selection. It is a pure presentational control — wire `onValueChange` to your
// own model (mirrors shadcn's `toggle-group` base).

export const toggleGroupClass =
  'group/toggle-group flex w-fit items-center rounded-md border border-input shadow-xs *:not-first:-ml-px *:not-first:rounded-l-none *:not-last:rounded-r-none *:shadow-none'

export const toggleGroupItemClass = 'rounded-md focus-visible:z-10 relative'

export type ToggleGroupType = 'single' | 'multiple'

export type ToggleGroupItem = Readonly<{
  value: string
  label: string
  icon?: IconNode
  ariaLabel?: string
}>

export type ToggleGroupConfig<M> = Readonly<{
  type?: ToggleGroupType
  value: ReadonlyArray<string>
  onValueChange?: (value: ReadonlyArray<string>) => M
  isDisabled?: boolean
  variant?: ToggleVariant
  size?: ToggleSize
  ariaLabel?: string
  className?: string
}>

const nextValue = (
  current: ReadonlyArray<string>,
  value: string,
  type: ToggleGroupType,
): ReadonlyArray<string> => {
  const isSelected = current.includes(value)
  if (type === 'single') return isSelected ? [] : [value]
  return isSelected ? current.filter((v) => v !== value) : [...current, value]
}

/** A connected group of toggles with shared selection. */
export const toggleGroup = <M>(
  config: ToggleGroupConfig<M>,
  items: ReadonlyArray<ToggleGroupItem>,
  h: HtmlBuilder<M>,
): Html => {
  const type = config.type ?? 'single'
  const value = config.value
  return h.div(
    [
      ...(config.ariaLabel === undefined ? [] : [h.AriaLabel(config.ariaLabel)]),
      h.Role('group'),
      h.Class(cn(toggleGroupClass, config.className)),
      h.DataAttribute('slot', 'toggle-group'),
    ],
    items.map((item) =>
      toggle<M>(
        {
          variant: config.variant ?? 'outline',
          size: config.size ?? 'sm',
          isPressed: value.includes(item.value),
          isDisabled: config.isDisabled,
          ariaLabel: item.ariaLabel ?? item.label,
          className: toggleGroupItemClass,
          onToggle: () => config.onValueChange!(nextValue(value, item.value, type)),
        },
        item.icon === undefined ? item.label : h.span([], [icon(h, item.icon), item.label]),
        h,
      ),
    ),
  )
}
