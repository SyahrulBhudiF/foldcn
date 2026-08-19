import { Option } from 'effect'
import type { Html, HtmlBuilder } from 'foldkit/html'

import * as animation from '@foldcn/registry/src/ui/animation'
import * as ToastModule from '@foldcn/registry/src/ui/toast'

import {
  ClickedDismissAllToasts,
  ClickedShowErrorToast,
  ClickedShowInfoToast,
  ClickedShowSuccessToast,
  ClickedShowWarningToast,
  GotAnimationMessage,
  GotToastMessage,
  ToggledAnimation,
  type Message,
} from '../message'
import type { Model } from '../model'
import { Toast } from '../toast'

export const toastView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div([h.Class('flex flex-col items-start gap-6')], [
    h.div([h.Class('flex flex-wrap gap-2')], [
      hButton(h, 'Info', ClickedShowInfoToast()),
      hButton(h, 'Success', ClickedShowSuccessToast()),
      hButton(h, 'Warning', ClickedShowWarningToast()),
      hButton(h, 'Error', ClickedShowErrorToast()),
    ]),
    h.div([h.Class('flex flex-wrap gap-2')], [
      h.button(
        [
          h.Class('rounded-md border border-input bg-background px-4 py-2 text-sm font-medium'),
          h.OnClick(ClickedDismissAllToasts()),
        ],
        ['Dismiss all'],
      ),
    ]),
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
            toContent: entry => [
              h.p([h.Class(ToastModule.toastTitleClass)], [entry.payload.title]),
              ...Option.match(entry.payload.maybeDescription, {
                onNone: () => [],
                onSome: description => [
                  h.p([h.Class(ToastModule.toastDescriptionClass)], [description]),
                ],
              }),
            ],
          }),
        entryClassName: ToastModule.toastEntryClass,
      },
      toParentMessage: message => GotToastMessage({ message }),
    }),
  ])

export const animationView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div([h.Class('flex flex-col items-start gap-4')], [
    h.button(
      [
        h.Class('rounded-md border border-input bg-background px-4 py-2 text-sm font-medium'),
        h.OnClick(ToggledAnimation()),
      ],
      [model.isAnimationShowing ? 'Hide content' : 'Show content'],
    ),
    h.submodel({
      slotId: model.animation.id,
      model: model.animation,
      view: animation.view,
      viewInputs: animation.styledViewInputs({
        animateSize: true,
        content: h.div([h.Class('flex flex-col gap-2')], [
          h.p([h.Class('text-foreground')], ['This card animates in and out.']),
          h.p([h.Class('text-sm text-muted-foreground')], [
            'The Animation component coordinates CSS enter/leave lifecycles via data attributes; animateSize uses a CSS grid wrapper for smooth height animation.',
          ]),
        ]),
      }),
      toParentMessage: message => GotAnimationMessage({ message }),
    }),
  ])

const hButton = (
  h: HtmlBuilder<Message>,
  label: string,
  message: Message,
): Html =>
  h.button(
    [
      h.Class('rounded-md border border-input bg-background px-4 py-2 text-sm font-medium'),
      h.OnClick(message),
    ],
    [label],
  )