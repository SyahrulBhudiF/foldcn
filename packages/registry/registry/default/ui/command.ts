import type { Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'
import { icon } from '@/lib/icons'
import { inputClass } from './input'
import { Search } from 'lucide'

type Child = Html | string

// Command is a presentational command-palette surface. `Command` is the
// container; sub-builders are attached as properties: Command.input,
// Command.list, Command.empty, Command.group, Command.item, Command.separator,
// Command.shortcut. Filtering is handled by the consumer (wire Command.input to
// your model), mirroring shadcn's `command` base surface.

export const commandClass =
  'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground'

export const commandInputClass =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 md:text-sm dark:bg-input/30'

export const commandListClass =
  'max-h-[300px] overflow-y-auto overflow-x-hidden p-1'

export const commandEmptyClass = 'py-6 text-center text-sm'

export const commandGroupClass =
  'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground'

export const commandGroupHeadingClass = 'px-2 py-1.5 text-xs font-medium text-muted-foreground'

export const commandItemClass =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"

export const commandSeparatorClass = '-mx-1 h-px bg-border'

export const commandShortcutClass = 'ml-auto text-xs tracking-widest text-muted-foreground'

export type CommandInputConfig<M> = Readonly<{
  value?: string
  onInput?: (value: string) => M
  placeholder?: string
  isDisabled?: boolean
  className?: string
}>

type StyleConfig = Readonly<{ className?: string }>

const commandContainer = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.div([h.Class(cn(commandClass, config.className)), h.DataAttribute('slot', 'command')], children)

const commandInput = <M>(config: CommandInputConfig<M>, h: HtmlBuilder<M>): Html =>
  h.div(
    [h.Class('flex items-center border-b px-2.5'), h.DataAttribute('slot', 'command-input-wrapper')],
    [
      icon(h, Search, 'size-4 shrink-0 opacity-50'),
      h.input([
        h.Type('text'),
        ...(config.value === undefined ? [] : [h.Value(config.value)]),
        ...(config.isDisabled === true ? [h.Disabled(true)] : []),
        ...(config.placeholder === undefined ? [] : [h.Placeholder(config.placeholder)]),
        ...(config.onInput === undefined ? [] : [h.OnInput(config.onInput)]),
        h.Class(cn(commandInputClass, 'border-0 shadow-none focus-visible:ring-0', config.className)),
        h.DataAttribute('slot', 'command-input'),
      ]),
    ],
  )

const commandList = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.div([h.Class(cn(commandListClass)), h.DataAttribute('slot', 'command-list')], children)

const commandEmpty = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.div([h.Class(cn(commandEmptyClass)), h.DataAttribute('slot', 'command-empty')], children)

const commandGroup = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.div([h.Class(cn(commandGroupClass)), h.DataAttribute('slot', 'command-group'), h.Role('group')], children)

const commandItem = <M>(
  config: StyleConfig & Readonly<{ isSelected?: boolean; isDisabled?: boolean }>,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [
      h.Class(cn(commandItemClass, config.className)),
      h.DataAttribute('slot', 'command-item'),
      h.Role('menuitem'),
      ...(config.isSelected === true ? [h.DataAttribute('selected', 'true')] : []),
      ...(config.isDisabled === true ? [h.DataAttribute('disabled', 'true')] : []),
    ],
    children,
  )

const commandSeparator = <M>(config: StyleConfig, h: HtmlBuilder<M>): Html =>
  h.div([h.Class(cn(commandSeparatorClass, config.className)), h.DataAttribute('slot', 'command-separator')], [])

const commandShortcut = <M>(config: StyleConfig, children: ReadonlyArray<Child>, h: HtmlBuilder<M>): Html =>
  h.span([h.Class(cn(commandShortcutClass, config.className)), h.DataAttribute('slot', 'command-shortcut')], children)

/** Composable command palette — `Command` is the container, with sub-builders
 *  as properties. */
export const Command = Object.assign(commandContainer, {
  input: commandInput,
  list: commandList,
  empty: commandEmpty,
  group: commandGroup,
  item: commandItem,
  separator: commandSeparator,
  shortcut: commandShortcut,
})
