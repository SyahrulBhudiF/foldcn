import { Command, Update } from 'foldkit'
import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { Animation as FoldkitAnimation } from '@foldkit/ui'

import * as animation from '@foldcn/registry/styles/default/ui/animation'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const GotAnimationMessage = m('GotAnimationMessage', { message: animation.Message })
const ToggledAnimation = m('ToggledAnimation')

export const animationView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex flex-col items-center gap-4')],
    [
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
          content: h.div(
            [h.Class('flex flex-col gap-2')],
            [
              h.p([h.Class('text-foreground')], ['This card animates in and out.']),
              h.p(
                [h.Class('text-sm text-muted-foreground')],
                [
                  'The Animation component coordinates CSS enter/leave lifecycles via data attributes; animateSize uses a CSS grid wrapper for smooth height animation.',
                ],
              ),
            ],
          ),
        }),
        toParentMessage: (message) => GotAnimationMessage({ message }),
      }),
    ],
  )

const foldAnimationOutMessage: (
  outMessage: animation.OutMessage,
  context: Update.FoldContext<animation.Message, unknown>,
) => Update.Step<State, unknown> = (outMessage, { liftCommand }) =>
  M.value(outMessage).pipe(
    M.withReturnType<Update.Step<State, unknown>>(),
    M.tagsExhaustive({
      StartedLeaveAnimating: () => (model) => [
        model,
        [liftCommand(FoldkitAnimation.defaultLeaveCommand(model.animation))],
      ],
      TransitionedOut: () => (model) => [model, []],
    }),
  )

const foldAnimation = Update.foldChild({
  update: animation.update,
  read: (model: State) => Option.some(model.animation),
  write: (model, next) => evo(model, { animation: () => next }),
  toParentMessage: (message) => GotAnimationMessage({ message }),
  foldOutMessage: foldAnimationOutMessage,
})

const fields = {
  animation: animation.Model,
  isAnimationShowing: S.Boolean,
}

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: {
    animation: animation.init({ id: 'animation-demo' }),
    isAnimationShowing: false,
  },
  messages: [GotAnimationMessage, ToggledAnimation],
  handlers: (model: State) => ({
    GotAnimationMessage: (payload: typeof GotAnimationMessage.Type): UpdateReturn =>
      foldAnimation(model, payload.message),
    ToggledAnimation: (): UpdateReturn => {
      const nextShowing = !model.isAnimationShowing
      return foldAnimation(
        evo(model, { isAnimationShowing: () => nextShowing }),
        nextShowing ? FoldkitAnimation.Showed() : FoldkitAnimation.Hid(),
      )
    },
  }),
  samples: [ToggledAnimation()],
})
