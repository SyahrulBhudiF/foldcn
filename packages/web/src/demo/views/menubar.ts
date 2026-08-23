import type { Html, HtmlBuilder } from 'foldkit/html'

import * as Menubar from '@foldcn/registry/styles/default/ui/menubar'
import { DemoMenu } from '../bundles'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

import { Message as MenuMessage } from './menu'

// Presentational menubar mirroring apps/v4/examples/base/menubar-demo.tsx.
// Each trigger is an independent Menu bundle — no cross-menu arrow traversal
// (see registry/default/ui/menubar.ts). "File" is interactive; the remaining
// triggers are visual affordances.
export const menubarView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex flex-col items-start gap-4')],
    [
      Menubar.menubar(
        [
          h.submodel({
            slotId: model.menu.id,
            model: model.menu,
            view: DemoMenu.view,
            viewInputs: Menubar.viewInputs<string>({
              items: ['New Tab', 'New Window', 'New Incognito Window', 'Share', 'Print…'],
              buttonContent: h.span([], ['File']),
              itemToConfig: (item, { isActive }) => ({
                className: isActive ? 'font-medium' : '',
                content: h.span([], [item]),
              }),
            }),
            toParentMessage: (message) => MenuMessage.GotMenuMessage({ message }),
          }),
          h.button([h.Class(Menubar.menubarTriggerClass)], ['Edit']),
          h.button([h.Class(Menubar.menubarTriggerClass)], ['View']),
          h.button([h.Class(Menubar.menubarTriggerClass)], ['Profiles']),
        ],
        h,
      ),
    ],
  )

export const slice = defineSlice({
  fields: {},
  init: {},
  messages: [],
  handlers: () => ({}),
})
