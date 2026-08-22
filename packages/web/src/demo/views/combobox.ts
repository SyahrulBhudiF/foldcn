import { Update } from 'foldkit'
import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { Combobox as FoldkitCombobox } from '@foldkit/ui'

import * as combobox from '@foldcn/registry/styles/default/ui/combobox'

import { CityCombobox, City } from '../bundles'
import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const GotComboboxMessage = m('GotComboboxMessage', { message: combobox.Message })

const CITIES: ReadonlyArray<City> = [
  'Johannesburg',
  'Kyiv',
  'Oxford',
  'Plymouth',
  'Quito',
  'Wellington',
  'Zurich',
]

export const comboboxView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('w-full max-w-xs')],
    [
      h.submodel({
        slotId: model.combobox.id,
        model: model.combobox,
        view: CityCombobox.view,
        viewInputs: combobox.viewInputs<City>({
          items: CITIES,
          restingInputValue: Option.getOrElse(model.maybeComboboxValue, () => ''),
          maybeSelectedValue: model.maybeComboboxValue,
          itemToValue: (city) => city,
          itemToDisplayText: (city) => city,
          inputPlaceholder: 'Select a city...',
          itemToConfig: (city, { isSelected, isActive }) => ({
            className: isActive ? 'font-medium' : '',
            content: h.span(
              [h.Class('flex w-full items-center justify-between gap-2')],
              [h.span([], [city]), ...(isSelected ? [h.span([], ['✓'])] : [])],
            ),
          }),
        }),
        toParentMessage: (message) => GotComboboxMessage({ message }),
      }),
    ],
  )

const foldComboboxOutMessage = M.type<FoldkitCombobox.OutMessage<City>>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    Selected:
      ({ value }) =>
      (model) => [evo(model, { maybeComboboxValue: () => Option.some(value) }), []],
    ClearedSelection: () => (model) => [model, []],
  }),
)

const foldCombobox = Update.foldChild({
  update: CityCombobox.update,
  read: (model: State) => Option.some(model.combobox),
  write: (model, next) => evo(model, { combobox: () => next }),
  toParentMessage: (message) => GotComboboxMessage({ message }),
  foldOutMessage: foldComboboxOutMessage,
})

const fields = { combobox: combobox.Model, maybeComboboxValue: S.Option(City) }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: {
    combobox: combobox.init({ id: 'combobox-demo' }),
    maybeComboboxValue: Option.none(),
  },
  messages: [GotComboboxMessage],
  handlers: (model: State) => ({
    GotComboboxMessage: (payload: typeof GotComboboxMessage.Type): UpdateReturn =>
      foldCombobox(model, payload.message),
  }),
  samples: [],
  // Selection flows through the submodel's out-messages; the public
  // @foldkit/ui namespace exports no child-message constructors, so there
  // are no top-level samples to feed update().
})
