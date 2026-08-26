import { Subscription, Update } from 'foldkit'
import { Match as M, Option, Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { Slider as FoldkitSlider } from '@foldkit/ui'

import * as Slider from '../../generated/registry/ui/slider'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const Message = defineMessageUnion({
  GotSliderMessage: { message: Slider.Message },
})

// Single thumb mirroring apps/v4/examples/base/slider-demo.tsx
export const sliderView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  h.div(
    [h.Class('flex w-full max-w-xs flex-col gap-2')],
    [
      h.submodel({
        slotId: model.sliderDemo.id,
        model: model.sliderDemo,
        view: Slider.view,
        viewInputs: Slider.styledViewInputs(
          {
            value: model.sliderValue,
            ariaLabel: 'Value',
          },
          h,
        ),
        toParentMessage: (message) => Message.GotSliderMessage({ message }),
      }),
    ],
  )

const foldOutMessage = M.type<Slider.OutMessage>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    ChangedValue:
      ({ value }) =>
      (model) => [evo(model, { sliderValue: () => value }), []],
  }),
)

const foldSlider = Update.foldChild({
  update: Slider.update,
  read: (model: State) => Option.some(model.sliderDemo),
  write: (model, next) => evo(model, { sliderDemo: () => next }),
  toParentMessage: (message) => Message.GotSliderMessage({ message }),
  foldOutMessage,
})

const fields = {
  sliderDemo: Slider.Model,
  sliderValue: S.Number,
}

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const subscriptions = Subscription.lift({
  sliderPointer: FoldkitSlider.subscriptions.dragPointer,
  sliderEscape: FoldkitSlider.subscriptions.dragEscape,
})<State, typeof Message.GotSliderMessage.Type>({
  toChildModel: (model) => model.sliderDemo,
  toParentMessage: (message) => Message.GotSliderMessage({ message }),
})

export const slice = defineSlice({
  fields,
  init: {
    sliderDemo: Slider.init({ id: 'slider-demo', min: 0, max: 100, step: 1 }),
    sliderValue: 75,
  },
  messages: [Message.GotSliderMessage],
  handlers: (model: State) => ({
    GotSliderMessage: (payload: typeof Message.GotSliderMessage.Type): UpdateReturn =>
      foldSlider(model, payload.message),
  }),
  samples: [],
  subscriptions,
})
