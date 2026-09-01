/** ⚠ BEHAVIOR GAP vs upstream shadcn: no filtering, no arrow-key/Enter selection, no roving tabindex and no Dialog wrapper — all behavior is consumer-owned. Consider `combobox` for a searchable dropdown with real behavior.
 *  The styled surface matches, but this behavior is absent — do not use
 *  where that behavior is required.
 */
import type { Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'
import { icon } from '@/lib/icons'
import { Search } from 'lucide'
import { inputGroup, inputGroupAddon, inputGroupInput } from './input-group'

type Child = Html | string

// foldcn gaps vs upstream: no cmdk behavior layer (filtering, arrow-key
// selection and Enter-to-select are consumer-owned) and no Dialog wrapper
// (CommandDialog missing export is OK — document gap); the [cmdk-*] descendant
// selectors in the group token are inert here — use Command.group for heading
// styles. Input wrapper now uses cn-command-input-wrapper/group tokens per
// upstream; item/group/separator are bare cn-* tokens (layout in style-nova.css).

export const commandClass = 'cn-command flex size-full flex-col overflow-hidden'

export const commandInputClass =
  'cn-command-input outline-hidden disabled:cursor-not-allowed disabled:opacity-50'

export const commandListClass = 'cn-command-list overflow-x-hidden overflow-y-auto'

export const commandEmptyClass = 'cn-command-empty'

export const commandGroupClass = 'cn-command-group'

export const commandGroupHeadingClass = 'cn-command-group'

export const commandItemClass =
  'cn-command-item group/command-item data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0'

export const commandSeparatorClass = 'cn-command-separator'

export const commandShortcutClass = 'cn-command-shortcut'

export type CommandInputConfig<M> = Readonly<{
  id?: string
  value?: string
  onInput?: (value: string) => M
  placeholder?: string
  isDisabled?: boolean
  className?: string
}>

type StyleConfig = Readonly<{ className?: string }>

const commandContainer = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div([h.Class(cn(commandClass, config.className)), h.DataAttribute('slot', 'command')], children)

const commandInput = <M>(config: CommandInputConfig<M>, h: HtmlBuilder<M>): Html =>
  h.div(
    [h.Class(cn('cn-command-input-wrapper')), h.DataAttribute('slot', 'command-input-wrapper')],
    [
      inputGroup(
        { className: 'cn-command-input-group' },
        [
          inputGroupAddon({}, [icon(h, Search, 'cn-command-input-icon')], h),
          inputGroupInput(
            {
              id: config.id ?? 'command-input',
              ariaLabel: 'Search commands',
              onInput: config.onInput,
              value: config.value,
              isDisabled: config.isDisabled,
              placeholder: config.placeholder,
              className: cn(commandInputClass, config.className),
              attributes: [h.DataAttribute('slot', 'command-input')],
            },
            h,
          ),
        ],
        h,
      ),
    ],
  )

const commandList = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html => h.div([h.Class(cn(commandListClass)), h.DataAttribute('slot', 'command-list')], children)

const commandEmpty = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div([h.Class(cn(commandEmptyClass)), h.DataAttribute('slot', 'command-empty')], children)

const commandGroup = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [h.Class(cn(commandGroupClass)), h.DataAttribute('slot', 'command-group'), h.Role('group')],
    children,
  )

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
  h.div(
    [
      h.Class(cn(commandSeparatorClass, config.className)),
      h.DataAttribute('slot', 'command-separator'),
    ],
    [],
  )

const commandShortcut = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.span(
    [
      h.Class(cn(commandShortcutClass, config.className)),
      h.DataAttribute('slot', 'command-shortcut'),
    ],
    children,
  )

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
