import { Match as M, Option } from 'effect'
import { Command, Update } from 'foldkit'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { button } from '@foldcn/registry/styles/default/ui/button'
import * as AlertDialog from '@foldcn/registry/styles/default/ui/alert-dialog'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

type State = { dialog: typeof AlertDialog.Model.Type }

const Message = defineMessageUnion({
  GotDialogMessage: { message: AlertDialog.Message },
  ClickedOpenDialog: {},
})

export const alertDialogView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  h.div(
    [h.Class('flex flex-col items-start gap-4')],
    [
      button<AppMessage>({ variant: 'outline', onClick: Message.ClickedOpenDialog() }, 'Show Dialog', h),
      h.submodel({
        slotId: model.dialog.id,
        model: model.dialog,
        view: AlertDialog.view,
        viewInputs: AlertDialog.styledViewInputs(
          {
            content: ({ closeButton, title, description }, h) => [
              AlertDialog.header(
                {},
                [
                  AlertDialog.title(title, {}, ['Are you absolutely sure?'], h),
                  AlertDialog.description(
                    description,
                    {},
                    [
                      'This action cannot be undone. This will permanently delete your account from our servers.',
                    ],
                    h,
                  ),
                ],
                h,
              ),
              AlertDialog.footer(
                {},
                [
                  AlertDialog.cancelButton(closeButton, {}, ['Cancel'], h),
                  AlertDialog.actionButton(closeButton, {}, ['Continue'], h),
                ],
                h,
              ),
            ],
          },
          h,
        ),
        toParentMessage: (message) => Message.GotDialogMessage({ message }),
      }),
    ],
  )

const foldNoOp =
  (): ((out: AlertDialog.OutMessage) => Update.Step<State, unknown>) => () => (model) => [model, []]

const foldAlertDialogOutMessage = M.type<AlertDialog.OutMessage>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    Opened: foldNoOp(),
    Closed: foldNoOp(),
  }),
)

// The alert dialog demo shares the dialog slice's `dialog` submodel field
// and its message tags — all dialog-engine demos drive the same submodel.
const foldAlertDialog = Update.foldChild({
  update: AlertDialog.update,
  read: (model: State) => Option.some(model.dialog),
  write: (model, next) => evo(model, { dialog: () => next }),
  toParentMessage: (message) => Message.GotDialogMessage({ message }),
  foldOutMessage: foldAlertDialogOutMessage,
})

export const slice = defineSlice({
  fields: {},
  init: {},
  messages: [Message.GotDialogMessage, Message.ClickedOpenDialog],
  handlers: (model: State) => ({
    GotDialogMessage: (payload: typeof Message.GotDialogMessage.Type): UpdateReturn =>
      foldAlertDialog(model, payload.message),
    ClickedOpenDialog: (): UpdateReturn => {
      const [next, commands] = AlertDialog.open(model.dialog)
      return [
        evo(model, { dialog: () => next }),
        Command.mapMessages(commands, (message) => Message.GotDialogMessage({ message })),
      ]
    },
  }),
  samples: [Message.ClickedOpenDialog()],
})
