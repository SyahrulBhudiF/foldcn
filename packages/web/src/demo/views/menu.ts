import { Update } from 'foldkit'
import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { Menu as FoldkitMenu } from '@foldkit/ui'

import * as menu from '../../generated/registry/ui/menu'

import { DemoMenu } from '../bundles'
import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

export const Message = defineMessageUnion({
  GotMenuMessage: { message: menu.Message },
})

// Items mirror apps/v4/examples/base/dropdown-menu-demo.tsx (flat list;
// foldcn's Menu has no checkbox/radio/submenu/destructive kinds — presentational gap noted in registry).
export const menuView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  h.submodel({
    slotId: model.menu.id,
    model: model.menu,
    view: DemoMenu.view,
    viewInputs: menu.viewInputs<string>({
      items: [
        'Profile',
        'Billing',
        'Settings',
        'Team',
        'Invite users',
        'New Team',
        'GitHub',
        'Support',
        'API',
        'Log out',
      ],
      buttonContent: h.span([], ['Open']),
      itemToConfig: (item, { isActive }) => ({
        className: isActive ? 'font-medium' : '',
        content: h.span([], [item]),
      }),
    }),
    toParentMessage: (message) => Message.GotMenuMessage({ message }),
  })

const foldNoOp =
  <Out>(): ((out: Out) => Update.Step<State, unknown>) =>
  () =>
  (model) => [model, []]

const foldMenuOutMessage = M.type<FoldkitMenu.OutMessage>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    Selected: foldNoOp(),
  }),
)

const foldMenu = Update.foldChild({
  update: DemoMenu.update,
  read: (model: State) => Option.some(model.menu),
  write: (model, next) => evo(model, { menu: () => next }),
  toParentMessage: (message) => Message.GotMenuMessage({ message }),
  foldOutMessage: foldMenuOutMessage,
})

const fields = { menu: menu.Model }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { menu: menu.init({ id: 'menu-demo' }) },
  messages: [Message.GotMenuMessage],
  handlers: (model: State) => ({
    GotMenuMessage: (payload: typeof Message.GotMenuMessage.Type): UpdateReturn =>
      foldMenu(model, payload.message),
  }),
  samples: [],
})
