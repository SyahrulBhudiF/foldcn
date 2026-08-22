import type { Html, HtmlBuilder } from 'foldkit/html'

import * as ContextMenu from '@foldcn/registry/styles/default/ui/context-menu'
import { DemoMenu } from '../bundles'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

import { GotMenuMessage } from './menu'

export const contextMenuView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.submodel({
    slotId: model.menu.id,
    model: model.menu,
    view: DemoMenu.view,
    viewInputs: ContextMenu.viewInputs<string>({
      items: ['Profile', 'Billing', 'Team', 'Subscription'],
      buttonContent: h.span([], ['Open context menu']),
      itemToConfig: (item, { isActive }) => ({
        className: isActive ? 'font-medium' : '',
        content: h.span([], [item]),
      }),
    }),
    toParentMessage: (message) => GotMenuMessage({ message }),
  })

// The context-menu demo has no state of its own — it renders the shared
// DemoMenu bundle bound to the menu slice's `menu` field, whose slice owns
// all of the menu wiring.
export const slice = defineSlice({
  fields: {},
  init: {},
  messages: [],
  handlers: () => ({}),
})
