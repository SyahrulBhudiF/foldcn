import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { Command, Update } from 'foldkit'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { button } from '@foldcn/registry/styles/default/ui/button'
import * as Sheet from '@foldcn/registry/styles/default/ui/sheet'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

type State = { dialog: typeof Sheet.Model.Type }

const GotDialogMessage = m('GotDialogMessage', { message: Sheet.Message })
const ClickedOpenDialog = m('ClickedOpenDialog')

export const sheetView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex flex-col items-start gap-4')],
    [
      button<Message>({ onClick: ClickedOpenDialog() }, 'Open sheet (right)', h),
      h.submodel({
        slotId: model.dialog.id,
        model: model.dialog,
        view: Sheet.view,
        viewInputs: Sheet.styledViewInputs(
          {
            side: 'right',
            content: ({ closeButton, title, description }, h) => [
              Sheet.header(
                {},
                [
                  Sheet.title(title, {}, ['Edit profile'], h),
                  Sheet.description(
                    description,
                    {},
                    ['Make changes to your profile here. Click save when you are done.'],
                    h,
                  ),
                ],
                h,
              ),
              Sheet.footer(
                {},
                [
                  Sheet.closeButton(closeButton, {}, ['Cancel'], h),
                  h.button(
                    [
                      ...closeButton,
                      h.Class('rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground'),
                    ],
                    ['Save changes'],
                  ),
                ],
                h,
              ),
            ],
          },
          h,
        ),
        toParentMessage: (message) => GotDialogMessage({ message }),
      }),
    ],
  )

const foldNoOp = (): ((out: Sheet.OutMessage) => Update.Step<State, unknown>) => () => (model) => [
  model,
  [],
]

const foldSheetOutMessage = M.type<Sheet.OutMessage>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    Opened: foldNoOp(),
    Closed: foldNoOp(),
  }),
)

// The sheet demo shares the dialog slice's `dialog` submodel field and its
// message tags — all dialog-engine demos drive the same submodel.
const foldSheet = Update.foldChild({
  update: Sheet.update,
  read: (model: State) => Option.some(model.dialog),
  write: (model, next) => evo(model, { dialog: () => next }),
  toParentMessage: (message) => GotDialogMessage({ message }),
  foldOutMessage: foldSheetOutMessage,
})

export const slice = defineSlice({
  fields: {},
  init: {},
  messages: [GotDialogMessage, ClickedOpenDialog],
  handlers: (model: State) => ({
    GotDialogMessage: (payload: typeof GotDialogMessage.Type): UpdateReturn =>
      foldSheet(model, payload.message),
    ClickedOpenDialog: (): UpdateReturn => {
      const [next, commands] = Sheet.open(model.dialog)
      return [
        evo(model, { dialog: () => next }),
        Command.mapMessages(commands, (message) => GotDialogMessage({ message })),
      ]
    },
  }),
  samples: [ClickedOpenDialog()],
})
