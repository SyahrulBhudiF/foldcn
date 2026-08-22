import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { Command, Update } from 'foldkit'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { button } from '@foldcn/registry/styles/default/ui/button'
import * as Drawer from '@foldcn/registry/styles/default/ui/drawer'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

type State = { dialog: typeof Drawer.Model.Type }

const GotDialogMessage = m('GotDialogMessage', { message: Drawer.Message })
const ClickedOpenDialog = m('ClickedOpenDialog')

export const drawerView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex flex-col items-start gap-4')],
    [
      button<Message>({ onClick: ClickedOpenDialog() }, 'Open drawer', h),
      h.submodel({
        slotId: model.dialog.id,
        model: model.dialog,
        view: Drawer.view,
        viewInputs: Drawer.styledViewInputs(
          {
            isHandleVisible: true,
            content: ({ closeButton, title, description }, h) => [
              Drawer.header(
                {},
                [
                  Drawer.title(title, {}, ['Move to folder'], h),
                  Drawer.description(
                    description,
                    {},
                    ['Choose a destination for the selected items.'],
                    h,
                  ),
                ],
                h,
              ),
              Drawer.footer(
                {},
                [
                  button<Message>({}, 'Move', h),
                  Drawer.closeButton(closeButton, {}, ['Cancel'], h),
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

const foldNoOp = (): ((out: Drawer.OutMessage) => Update.Step<State, unknown>) => () => (model) => [
  model,
  [],
]

const foldDrawerOutMessage = M.type<Drawer.OutMessage>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    Opened: foldNoOp(),
    Closed: foldNoOp(),
  }),
)

// The drawer demo shares the dialog slice's `dialog` submodel field and its
// message tags — all dialog-engine demos drive the same submodel.
const foldDrawer = Update.foldChild({
  update: Drawer.update,
  read: (model: State) => Option.some(model.dialog),
  write: (model, next) => evo(model, { dialog: () => next }),
  toParentMessage: (message) => GotDialogMessage({ message }),
  foldOutMessage: foldDrawerOutMessage,
})

export const slice = defineSlice({
  fields: {},
  init: {},
  messages: [GotDialogMessage, ClickedOpenDialog],
  handlers: (model: State) => ({
    GotDialogMessage: (payload: typeof GotDialogMessage.Type): UpdateReturn =>
      foldDrawer(model, payload.message),
    ClickedOpenDialog: (): UpdateReturn => {
      const [next, commands] = Drawer.open(model.dialog)
      return [
        evo(model, { dialog: () => next }),
        Command.mapMessages(commands, (message) => GotDialogMessage({ message })),
      ]
    },
  }),
  samples: [ClickedOpenDialog()],
})
