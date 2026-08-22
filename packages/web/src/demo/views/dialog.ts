import { Command, Update } from 'foldkit'
import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { button } from '@foldcn/registry/styles/default/ui/button'
import * as Dialog from '@foldcn/registry/styles/default/ui/dialog'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const GotDialogMessage = m('GotDialogMessage', { message: Dialog.Message })
const ClickedOpenDialog = m('ClickedOpenDialog')

export const dialogView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex flex-col items-start gap-4')],
    [
      button<Message>({ onClick: ClickedOpenDialog() }, 'Open dialog', h),
      h.submodel({
        slotId: model.dialog.id,
        model: model.dialog,
        view: Dialog.view,
        viewInputs: Dialog.styledViewInputs(
          {
            content: ({ closeButton, title, description }, h) => [
              h.h2([...title, h.Class('text-lg font-semibold')], ['Edit profile']),
              h.p(
                [...description, h.Class('text-sm text-muted-foreground')],
                ['Make changes to your profile here. Click save when you are done.'],
              ),
              h.div(
                [h.Class('mt-4 bg-muted p-3 text-sm text-muted-foreground')],
                ['This modal traps focus and closes on Esc or backdrop click.'],
              ),
              h.div(
                [h.Class('mt-6 flex justify-end gap-2')],
                [
                  h.button(
                    [...closeButton, h.Class('rounded-md border border-input px-4 py-2 text-sm')],
                    ['Cancel'],
                  ),
                  h.button(
                    [
                      ...closeButton,
                      h.Class('rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground'),
                    ],
                    ['Save'],
                  ),
                ],
              ),
            ],
          },
          h,
        ),
        toParentMessage: (message) => GotDialogMessage({ message }),
      }),
    ],
  )

const foldNoOp = (): ((out: Dialog.OutMessage) => Update.Step<State, unknown>) => () => (model) => [
  model,
  [],
]

const foldDialogOutMessage = M.type<Dialog.OutMessage>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    Opened: foldNoOp(),
    Closed: foldNoOp(),
  }),
)

const foldDialog = Update.foldChild({
  update: Dialog.update,
  read: (model: State) => Option.some(model.dialog),
  write: (model, next) => evo(model, { dialog: () => next }),
  toParentMessage: (message) => GotDialogMessage({ message }),
  foldOutMessage: foldDialogOutMessage,
})

const fields = { dialog: Dialog.Model }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { dialog: Dialog.init({ id: 'dialog-demo' }) },
  messages: [GotDialogMessage, ClickedOpenDialog],
  handlers: (model: State) => ({
    GotDialogMessage: (payload: typeof GotDialogMessage.Type): UpdateReturn =>
      foldDialog(model, payload.message),
    ClickedOpenDialog: (): UpdateReturn => {
      const [next, commands] = Dialog.open(model.dialog)
      return [
        evo(model, { dialog: () => next }),
        Command.mapMessages(commands, (message) => GotDialogMessage({ message })),
      ]
    },
  }),
  samples: [ClickedOpenDialog()],
})
