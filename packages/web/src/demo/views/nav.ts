import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { nav } from '@foldcn/registry/styles/default/ui/nav'

import { DemoNav } from '../bundles'
import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const SelectedNav = m('SelectedNav', { value: DemoNav })

const NAV_ITEMS = ['Overview', 'Components', 'Settings', 'Docs'] as const

export const navView = (model: Model, h: HtmlBuilder<Message>): Html =>
  nav<Message, (typeof NAV_ITEMS)[number]>(
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
