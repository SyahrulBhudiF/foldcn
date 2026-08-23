import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { nav } from '@foldcn/registry/styles/default/ui/nav'

import { DemoNav } from '../bundles'
import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const Message = defineMessageUnion({
  SelectedNav: { value: DemoNav },
})
const SelectedNav = Message.SelectedNav

const NAV_ITEMS = ['Overview', 'Components', 'Settings', 'Docs'] as const

export const navView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  nav<AppMessage, (typeof NAV_ITEMS)[number]>(
    {
      items: NAV_ITEMS,
      ariaLabel: 'Primary',
      toHref: () => '#',
      isItemCurrent: (value) => value === model.activeNav,
      onItemClick: (value) => SelectedNav({ value }),
      toLabel: (value) => value,
    },
    h,
  )

const fields = { activeNav: DemoNav }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { activeNav: 'Components' },
  messages: [SelectedNav],
  handlers: (model: State) => ({
    SelectedNav: ({ value }: typeof SelectedNav.Type): UpdateReturn => [
      evo(model, { activeNav: () => value }),
      [],
    ],
  }),
  samples: [SelectedNav({ value: 'Docs' })],
})
