import { Subscription, Update } from 'foldkit'
import { Match as M, Option, Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { Slider as FoldkitSlider } from '@foldkit/ui'

import * as Slider from '@foldcn/registry/styles/default/ui/slider'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const GotSliderMessage = m('GotSliderMessage', { message: Slider.Message })

// Single thumb mirroring apps/v4/examples/base/slider-demo.tsx
export const sliderView = (model: Model, h: HtmlBuilder<Message>): Html =>
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
        toParentMessage: (message) => GotSliderMessage({ message }),
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
  toParentMessage: (message) => GotSliderMessage({ message }),
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
})<State, typeof GotSliderMessage.Type>({
  toChildModel: (model) => model.sliderDemo,
  toParentMessage: (message) => GotSliderMessage({ message }),
})

export const slice = defineSlice({
  fields,
  init: {
    sliderDemo: Slider.init({ id: 'slider-demo', min: 0, max: 100, step: 1 }),
    sliderValue: 75,
  },
  messages: [GotSliderMessage],
  handlers: (model: State) => ({
    GotSliderMessage: (payload: typeof GotSliderMessage.Type): UpdateReturn =>
      foldSlider(model, payload.message),
  }),
  samples: [],
  subscriptions,
})
