import { Subscription, Update } from 'foldkit'
import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { Slider as FoldkitSlider } from '@foldkit/ui'

import * as slider from '@foldcn/registry/styles/default/ui/slider'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const GotSliderRatingMessage = m('GotSliderRatingMessage', { message: slider.Message })
const GotSliderVolumeMessage = m('GotSliderVolumeMessage', { message: slider.Message })

export const sliderView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-8')],
    [
      h.submodel({
        slotId: model.sliderRating.id,
        model: model.sliderRating,
        view: slider.view,
        viewInputs: slider.styledViewInputs(
          { value: model.sliderRatingValue, label: 'Rating', formatValue: (value) => `${value} / 10` },
          h,
        ),
        toParentMessage: (message) => GotSliderRatingMessage({ message }),
      }),
      h.submodel({
        slotId: model.sliderVolume.id,
        model: model.sliderVolume,
        view: slider.view,
        viewInputs: slider.styledViewInputs(
          {
            value: model.sliderVolumeValue,
            label: 'Volume',
            formatValue: (value) => `${Math.round(value * 100)}%`,
          },
          h,
        ),
        toParentMessage: (message) => GotSliderVolumeMessage({ message }),
      }),
    ],
  )

const foldRatingOutMessage = M.type<slider.OutMessage>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    ChangedValue:
      ({ value }) =>
      (model) =>
        [evo(model, { sliderRatingValue: () => value }), []],
  }),
)

const foldVolumeOutMessage = M.type<slider.OutMessage>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    ChangedValue:
      ({ value }) =>
      (model) =>
        [evo(model, { sliderVolumeValue: () => value }), []],
  }),
)

const foldRating = Update.foldChild({
  update: slider.update,
  read: (model: State) => Option.some(model.sliderRating),
  write: (model, next) => evo(model, { sliderRating: () => next }),
  toParentMessage: (message) => GotSliderRatingMessage({ message }),
  foldOutMessage: foldRatingOutMessage,
})

const foldVolume = Update.foldChild({
  update: slider.update,
  read: (model: State) => Option.some(model.sliderVolume),
  write: (model, next) => evo(model, { sliderVolume: () => next }),
  toParentMessage: (message) => GotSliderVolumeMessage({ message }),
  foldOutMessage: foldVolumeOutMessage,
})

const fields = {
    sliderRating: slider.Model,
    sliderRatingValue: S.Number,
    sliderVolume: slider.Model,
    sliderVolumeValue: S.Number,
  }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const subscriptions = Subscription.lift({
  sliderRatingPointer: FoldkitSlider.subscriptions.dragPointer,
  sliderRatingEscape: FoldkitSlider.subscriptions.dragEscape,
})<State, typeof GotSliderRatingMessage.Type | typeof GotSliderVolumeMessage.Type>({
  toChildModel: (model) => model.sliderRating,
  toParentMessage: (message) => GotSliderRatingMessage({ message }),
})

export const slice = defineSlice({
  fields,
  init: {
    sliderRating: slider.init({ id: 'slider-rating-demo', min: 0, max: 10, step: 1 }),
    sliderRatingValue: 3,
    sliderVolume: slider.init({ id: 'slider-volume-demo', min: 0, max: 1, step: 0.05 }),
    sliderVolumeValue: 0.5,
  },
  messages: [GotSliderRatingMessage, GotSliderVolumeMessage],
  handlers: (model: State) => ({
    GotSliderRatingMessage: (payload: typeof GotSliderRatingMessage.Type): UpdateReturn =>
      foldRating(model, payload.message),
    GotSliderVolumeMessage: (payload: typeof GotSliderVolumeMessage.Type): UpdateReturn =>
      foldVolume(model, payload.message),
  }),
  samples: [],
  // Slider changes arrive purely through drag (child out-messages); the
  // public @foldkit/ui namespace exports no child-message constructors, so
  // there are no top-level samples to feed update().
  subscriptions,
})

