import type { Attribute, Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'
import { inputClass } from './input'

type Child = Html | string

// InputGroup draws a shared bordered box and lets you slot text/icon add-ons
// around a connected input (mirrors shadcn's `input-group` base). The input
// inside drops its own border/radius so the group frame shows through.

export const inputGroupClass =
  'flex w-full min-w-0 items-stretch rounded-md border border-input bg-transparent text-sm shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-[>textarea]:h-auto'

export const inputGroupTextClass =
  'flex items-center justify-center gap-2 rounded-none px-3 py-1 text-sm text-muted-foreground'

export const inputGroupInputClass =
  'h-9 w-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 py-1 text-base shadow-none outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30 focus-visible:ring-0'

export type InputGroupInputConfig<M> = Readonly<{
  id: string
  value?: string
  onInput?: (value: string) => M
  isDisabled?: boolean
  isReadOnly?: boolean
  isInvalid?: boolean
  placeholder?: string
  name?: string
  type?: string
  className?: string
}>

/** The connected input for use inside `inputGroup`. */
export const inputGroupInput = <M>(
  config: InputGroupInputConfig<M>,
  h: HtmlBuilder<M>,
  extraAttributes: ReadonlyArray<Attribute<M>> = [],
): Html =>
  h.input(
    [
      h.Id(config.id),
      ...(config.onInput === undefined ? [] : [h.OnInput(config.onInput)]),
      ...(config.value === undefined ? [] : [h.Value(config.value)]),
      ...(config.isDisabled === true ? [h.Disabled(true)] : []),
      ...(config.isReadOnly === true ? [h.Attribute('readonly', 'true')] : []),
      ...(config.isInvalid === true ? [h.AriaInvalid(true)] : []),
      ...(config.name === undefined ? [] : [h.Name(config.name)]),
      ...(config.type === undefined ? [] : [h.Type(config.type)]),
      ...(config.placeholder === undefined ? [] : [h.Placeholder(config.placeholder)]),
      h.Class(cn(inputGroupInputClass, config.className)),
      ...extraAttributes,
    ],
  )

type StyleConfig = Readonly<{ className?: string }>

/** Add-on (text or icon) for either side of the group. */
export const inputGroupText = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div([h.Class(cn(inputGroupTextClass, config.className)), h.DataAttribute('slot', 'input-group-text')], children)

/** Segmented container — pass `inputGroupText` / `inputGroupInput` children. */
export const inputGroup = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div([h.Class(cn(inputGroupClass, config.className)), h.DataAttribute('slot', 'input-group')], children)
