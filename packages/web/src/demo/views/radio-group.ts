import { Update } from 'foldkit'
import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { RadioGroup as FoldkitRadioGroup } from '@foldkit/ui'

import * as radioGroup from '@foldcn/registry/styles/default/ui/radio-group'

import { PlanRadioGroup, Plan } from '../bundles'
import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const GotRadioGroupMessage = m('GotRadioGroupMessage', { message: radioGroup.Message })

const PLAN_DESCRIPTIONS: Record<Plan, string> = {
  Startup: '12GB / 6 CPUs. Perfect for small projects',
  Business: '16GB / 8 CPUs. For growing teams',
  Enterprise: '32GB / 12 CPUs. Dedicated infrastructure',
}

export const radioGroupView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('w-full')],
    [
      h.submodel({
        slotId: model.radioGroup.id,
        model: model.radioGroup,
        view: PlanRadioGroup.view,
        viewInputs: radioGroup.styledViewInputs<Message, Plan>(
          {
            options: ['Startup', 'Business', 'Enterprise'],
            selectedValue: model.maybePlan,
            ariaLabel: 'Server plan',
            optionLabel: (value) => value,
            optionDescription: (value) => PLAN_DESCRIPTIONS[value],
          },
          h,
        ),
        toParentMessage: (message) => GotRadioGroupMessage({ message }),
      }),
    ],
  )

const foldRadioGroupOutMessage = M.type<FoldkitRadioGroup.OutMessage<Plan>>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    Selected:
      ({ value }) =>
      (model) => [evo(model, { maybePlan: () => Option.some(value) }), []],
  }),
)

const foldRadioGroup = Update.foldChild({
  update: PlanRadioGroup.update,
  read: (model: State) => Option.some(model.radioGroup),
  write: (model, next) => evo(model, { radioGroup: () => next }),
  toParentMessage: (message) => GotRadioGroupMessage({ message }),
  foldOutMessage: foldRadioGroupOutMessage,
})

const fields = { radioGroup: radioGroup.Model, maybePlan: S.Option(Plan) }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: {
    radioGroup: radioGroup.init({ id: 'radio-group-demo' }),
    maybePlan: Option.none(),
  },
  messages: [GotRadioGroupMessage],
  handlers: (model: State) => ({
    GotRadioGroupMessage: (payload: typeof GotRadioGroupMessage.Type): UpdateReturn =>
      foldRadioGroup(model, payload.message),
  }),
  samples: [],
  // Selection flows through the submodel's out-messages; the public
  // @foldkit/ui namespace exports no child-message constructors, so there
  // are no top-level samples to feed update().
})
