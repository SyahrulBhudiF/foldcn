import { Update } from 'foldkit'
import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { Listbox as FoldkitListbox } from '@foldkit/ui'

import * as listbox from '@foldcn/registry/styles/default/ui/listbox'

import { ItemListbox, ListboxItem } from '../bundles'
import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const GotListboxMessage = m('GotListboxMessage', { message: listbox.Message })

const LISTBOX_ITEMS: ReadonlyArray<ListboxItem> = [
  'Michael Bluth',
  'Lindsay Funke',
  'Gob Bluth',
  'George Michael',
  'Tobias Funke',
]

export const listboxView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex flex-col gap-1.5')],
    [
      h.label([h.Class('text-sm font-medium')], ['Family member']),
      h.submodel({
        slotId: model.listbox.id,
        model: model.listbox,
        view: ItemListbox.view,
        viewInputs: listbox.viewInputs<ListboxItem, ListboxItem>({
          items: LISTBOX_ITEMS,
          maybeSelectedValue: model.maybeListboxValue,
          buttonContent: h.span(
            [],
            [Option.getOrElse(model.maybeListboxValue, () => 'Select a Bluth')],
          ),
          itemToConfig: (item, { isSelected, isActive }) => ({
            className: isActive ? 'font-medium' : '',
            content: h.span(
              [h.Class('flex w-full items-center justify-between gap-2')],
              [h.span([], [item]), ...(isSelected ? [h.span([], ['✓'])] : [])],
            ),
          }),
        }),
        toParentMessage: (message) => GotListboxMessage({ message }),
      }),
    ],
  )

const foldListboxOutMessage = M.type<FoldkitListbox.OutMessage<ListboxItem>>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    Selected:
      ({ value }) =>
      (model) => [evo(model, { maybeListboxValue: () => Option.some(value) }), []],
  }),
)

const foldListbox = Update.foldChild({
  update: ItemListbox.update,
  read: (model: State) => Option.some(model.listbox),
  write: (model, next) => evo(model, { listbox: () => next }),
  toParentMessage: (message) => GotListboxMessage({ message }),
  foldOutMessage: foldListboxOutMessage,
})

const fields = { listbox: listbox.Model, maybeListboxValue: S.Option(ListboxItem) }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: {
    listbox: listbox.init({ id: 'listbox-demo' }),
    maybeListboxValue: Option.none(),
  },
  messages: [GotListboxMessage],
  handlers: (model: State) => ({
    GotListboxMessage: (payload: typeof GotListboxMessage.Type): UpdateReturn =>
      foldListbox(model, payload.message),
  }),
  samples: [],
  // Selection flows through the submodel's out-messages; the public
  // @foldkit/ui namespace exports no child-message constructors, so there
  // are no top-level samples to feed update().
})
