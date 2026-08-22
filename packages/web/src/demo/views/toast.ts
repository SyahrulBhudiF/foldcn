import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { Command, Update } from 'foldkit'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import * as ToastModule from '@foldcn/registry/styles/default/ui/toast'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'
import { Toast } from '../toast'

// Exported for the sonner demo, which renders the same shared toast stack.
export const GotToastMessage = m('GotToastMessage', { message: Toast.Message })
export const ClickedShowInfoToast = m('ClickedShowInfoToast')
export const ClickedShowSuccessToast = m('ClickedShowSuccessToast')
export const ClickedShowWarningToast = m('ClickedShowWarningToast')
export const ClickedShowErrorToast = m('ClickedShowErrorToast')
export const ClickedDismissAllToasts = m('ClickedDismissAllToasts')

export const toastView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex flex-col items-start gap-6')],
    [
      h.div(
        [h.Class('flex flex-wrap gap-2')],
        [
          hButton(h, 'Info', ClickedShowInfoToast()),
          hButton(h, 'Success', ClickedShowSuccessToast()),
          hButton(h, 'Warning', ClickedShowWarningToast()),
          hButton(h, 'Error', ClickedShowErrorToast()),
        ],
      ),
      h.div(
        [h.Class('flex flex-wrap gap-2')],
        [
          h.button(
            [
              h.Class('rounded-md border border-input bg-background px-4 py-2 text-sm font-medium'),
              h.OnClick(ClickedDismissAllToasts()),
            ],
            ['Dismiss all'],
          ),
        ],
      ),
      h.submodel({
        slotId: model.toast.id,
        model: model.toast,
        view: Toast.view,
        viewInputs: {
          position: 'BottomRight',
          entryToView: (entry, handlers) =>
            Toast.entryView({
              entry,
              handlers,
              h,
              toContent: (entry) => [
                h.p([h.Class(ToastModule.toastTitleClass)], [entry.payload.title]),
                ...Option.match(entry.payload.maybeDescription, {
                  onNone: () => [],
                  onSome: (description) => [
                    h.p([h.Class(ToastModule.toastDescriptionClass)], [description]),
                  ],
                }),
              ],
            }),
          entryClassName: ToastModule.toastEntryClass,
        },
        toParentMessage: (message) => GotToastMessage({ message }),
      }),
    ],
  )

const hButton = (h: HtmlBuilder<Message>, label: string, message: Message): Html =>
  h.button(
    [
      h.Class('rounded-md border border-input bg-background px-4 py-2 text-sm font-medium'),
      h.OnClick(message),
    ],
    [label],
  )

const foldNoOp =
  (): ((out: typeof Toast.OutMessage.Type) => Update.Step<State, unknown>) => () => (model) => [
    model,
    [],
  ]

const foldToastOutMessage = M.type<typeof Toast.OutMessage.Type>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    DismissedToast: foldNoOp(),
  }),
)

const foldToast = Update.foldChild({
  update: Toast.update,
  read: (model: State) => Option.some(model.toast),
  write: (model, next) => evo(model, { toast: () => next }),
  toParentMessage: (message) => GotToastMessage({ message }),
  foldOutMessage: foldToastOutMessage,
})

const showToast = (
  model: State,
  variant: 'Info' | 'Success' | 'Warning' | 'Error',
  title: string,
  maybeDescription: Option.Option<string>,
): UpdateReturn => {
  const [next, commands] = Toast.show(model.toast, {
    variant,
    payload: { title, maybeDescription },
  })
  return [
    evo(model, { toast: () => next }),
    Command.mapMessages(commands, (message) => GotToastMessage({ message })),
  ]
}

const fields = { toast: Toast.Model }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { toast: Toast.init({ id: 'toast-demo' }) },
  messages: [
    GotToastMessage,
    ClickedShowInfoToast,
    ClickedShowSuccessToast,
    ClickedShowWarningToast,
    ClickedShowErrorToast,
    ClickedDismissAllToasts,
  ],
  handlers: (model: State) => ({
    GotToastMessage: (payload: typeof GotToastMessage.Type): UpdateReturn =>
      foldToast(model, payload.message),
    ClickedShowInfoToast: (): UpdateReturn =>
      showToast(model, 'Info', 'Changes saved', Option.some('Your preferences have been updated.')),
    ClickedShowSuccessToast: (): UpdateReturn =>
      showToast(
        model,
        'Success',
        'Uploaded successfully',
        Option.some('kit-manual.pdf is now available.'),
      ),
    ClickedShowWarningToast: (): UpdateReturn =>
      showToast(
        model,
        'Warning',
        'Network slow',
        Option.some('Some assets are loading over a weak connection.'),
      ),
    ClickedShowErrorToast: (): UpdateReturn =>
      showToast(
        model,
        'Error',
        'Failed to save',
        Option.some('Check your connection and try again.'),
      ),
    ClickedDismissAllToasts: (): UpdateReturn => {
      const [next, commands] = Toast.dismissAll(model.toast)
      return [
        evo(model, { toast: () => next }),
        Command.mapMessages(commands, (message) => GotToastMessage({ message })),
      ]
    },
  }),
  samples: [ClickedShowInfoToast()],
})
