import type { Html, HtmlBuilder } from 'foldkit/html'

import * as ContextMenu from '../../generated/registry/ui/context-menu'
import { DemoMenu } from '../bundles'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

import { Message as MenuMessage } from './menu'

// Presentational — mirrors apps/v4/examples/base/context-menu-demo.tsx.
// Foldkit's Menu opens on activation at a fixed anchor (no right-click
// anchoring); checkbox/radio/submenu/destructive kinds are not primitive-level
// (see registry/default/ui/context-menu.ts gap notes). Visual labels match upstream.
export const contextMenuView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.submodel({
    slotId: model.menu.id,
    model: model.menu,
    view: DemoMenu.view,
    viewInputs: ContextMenu.viewInputs<string>({
      items: [
        'Back',
        'Forward',
        'Reload',
        'More Tools',
        'Show Bookmarks',
        'Show Full URLs',
        'Pedro Duarte',
        'Colm Tuite',
      ],
      buttonContent: h.span([], ['Right click here']),
      itemToConfig: (item, { isActive }) => ({
        className: isActive ? 'font-medium' : '',
        content: h.span([], [item]),
      }),
    }),
    toParentMessage: (message) => MenuMessage.GotMenuMessage({ message }),
  })

export const slice = defineSlice({
  fields: {},
  init: {},
  messages: [],
  handlers: () => ({}),
})
