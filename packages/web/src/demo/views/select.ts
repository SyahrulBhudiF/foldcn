import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { Listbox as FoldkitListbox } from '@foldkit/ui'
import { Update } from 'foldkit'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import * as select from '@foldcn/registry/styles/default/ui/select'
import { LanguageSelect } from '../bundles'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const GotSelectMessage = m('GotSelectMessage', { message: select.Message })

const LANGUAGE_OPTIONS = [
  ['en', 'English'],
  ['id', 'Bahasa Indonesia'],
  ['ja', '日本語'],
] as const

export const selectView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class(select.selectWrapperClass)],
    [
      select.selectLabel('Language', h),
      h.submodel({
        slotId: model.select.id,
        model: model.select,
        view: LanguageSelect.view,
        viewInputs: select.styledViewInputs<Message, { value: string; label: string }, string>({
          options: LANGUAGE_OPTIONS.map(([value, label]) => ({ value, label })),
          maybeSelectedValue: model.maybeSelectValue,
          itemToValue: (item) => item.value,
          itemToLabel: (item) => item.label,
          label: 'Language',
          description: 'Choose your interface language.',
          isInvalid: false,
        }, h),
        toParentMessage: (message) => GotSelectMessage({ message }),
      }),
      select.selectDescription('Choose your interface language.', h)
    ],
  )

const foldSelectOutMessage = M.type<FoldkitListbox.OutMessage<string>>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    Selected:
      ({ value }) =>
      (model) => [evo(model, { maybeSelectValue: () => Option.some(value) }), []],
  }),
)

const foldSelect = Update.foldChild({
  update: LanguageSelect.update,
  read: (model: State) => Option.some(model.select),
  write: (model, next) => evo(model, { select: () => next }),
  toParentMessage: (message) => GotSelectMessage({ message }),
  foldOutMessage: foldSelectOutMessage,
})

const fields = {
    select: select.Model,
    maybeSelectValue: S.Option(S.String),
  }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: {
    select: select.init({ id: 'select-language' }),
    maybeSelectValue: Option.some('en'),
  },
  messages: [GotSelectMessage],
  handlers: (model: State) => ({
    GotSelectMessage: (payload: typeof GotSelectMessage.Type): UpdateReturn =>
      foldSelect(model, payload.message),
  }),
  samples: [
    GotSelectMessage({ message: FoldkitListbox.Opened({ maybeActiveItemIndex: Option.none() }) }),
  ],
})
