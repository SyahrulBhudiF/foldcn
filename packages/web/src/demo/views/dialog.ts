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
      button<Message>({ variant: 'outline', onClick: ClickedOpenDialog() }, 'Open Dialog', h),
      h.submodel({
        slotId: model.dialog.id,
        model: model.dialog,
        view: Dialog.view,
        viewInputs: Dialog.styledViewInputs(
          {
            content: ({ closeButton, title, description }, h) => [
              Dialog.header(
                {},
                [
                  Dialog.title(title, {}, ['Edit profile'], h),
                  Dialog.description(
                    description,
                    {},
                    ['Make changes to your profile here. Click save when you are done.'],
                    h,
                  ),
                ],
                h,
              ),
              h.div(
                [h.Class('grid gap-4 py-4')],
                [
                  h.div(
                    [h.Class('grid gap-3')],
                    [
                      h.label(
                        [
                          h.Class('flex items-center gap-2 text-sm leading-none font-medium'),
                          h.For('dialog-name-1'),
                        ],
                        ['Name'],
                      ),
                      h.input([
                        h.Class(
                          'flex h-8 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
                        ),
                        h.Id('dialog-name-1'),
                        h.Attribute('name', 'name'),
                        h.Attribute('defaultValue', 'Pedro Duarte'),
                      ]),
                    ],
                  ),
                  h.div(
                    [h.Class('grid gap-3')],
                    [
                      h.label(
                        [
                          h.Class('flex items-center gap-2 text-sm leading-none font-medium'),
                          h.For('dialog-username-1'),
                        ],
                        ['Username'],
                      ),
                      h.input([
                        h.Class(
                          'flex h-8 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
                        ),
                        h.Id('dialog-username-1'),
                        h.Attribute('name', 'username'),
                        h.Attribute('defaultValue', '@peduarte'),
                      ]),
                    ],
                  ),
                ],
              ),
              Dialog.footer(
                {},
                [
                  h.button(
                    [
                      ...closeButton,
                      h.Class(
                        'inline-flex h-8 items-center justify-center rounded-lg border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                      ),
                    ],
                    ['Cancel'],
                  ),
                  h.button(
                    [
                      h.Class(
                        'inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90',
                      ),
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
