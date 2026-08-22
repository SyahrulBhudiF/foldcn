import { Update } from 'foldkit'
import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { Menu as FoldkitMenu } from '@foldkit/ui'

import * as menu from '@foldcn/registry/styles/default/ui/menu'

import { DemoMenu } from '../bundles'
import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

export const GotMenuMessage = m('GotMenuMessage', { message: menu.Message })

export const menuView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.submodel({
    slotId: model.menu.id,
    model: model.menu,
    view: DemoMenu.view,
    viewInputs: menu.viewInputs<string>({
      items: ['Edit', 'Duplicate', 'Archive', 'Delete'],
      buttonContent: h.span([], ['Open menu']),
      itemToConfig: (item, { isActive }) => ({
        className: isActive ? 'font-medium' : '',
        content: h.span([], [item]),
      }),
    }),
    toParentMessage: (message) => GotMenuMessage({ message }),
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
  toParentMessage: (message) => GotMenuMessage({ message }),
  foldOutMessage: foldMenuOutMessage,
})

const fields = { menu: menu.Model }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { menu: menu.init({ id: 'menu-demo' }) },
  messages: [GotMenuMessage],
  handlers: (model: State) => ({
    GotMenuMessage: (payload: typeof GotMenuMessage.Type): UpdateReturn =>
      foldMenu(model, payload.message),
  }),
  samples: [],
  // Menu selection flows through the submodel's out-messages; the public
  // @foldkit/ui namespace exports no child-message constructors, so there
  // are no top-level samples to feed update().
})
