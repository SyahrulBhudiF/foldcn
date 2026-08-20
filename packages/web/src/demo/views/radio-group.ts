import { Option } from 'effect'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@foldcn/registry/src/lib/utils'
import * as radioGroup from '@foldcn/registry/src/ui/radio-group'
import { PlanRadioGroup } from '../bundles'

import { GotRadioGroupMessage, type Message } from '../message'
import type { Model, Plan } from '../model'

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
            option: (value, info, render, h) =>
              h.div(
                [h.Class('flex w-full items-center justify-between gap-4')],
                [
                  h.div(
                    [h.Class('flex flex-col')],
                    [
                      h.span([...info.label, h.Class('text-sm font-medium')], [value]),
                      h.span(
                        [...info.description, h.Class('text-sm text-muted-foreground')],
                        [PLAN_DESCRIPTIONS[value]],
                      ),
                    ],
                  ),
                  h.span(
                    [
                      h.Class(
                        'flex size-5 shrink-0 items-center justify-center rounded-full border border-primary',
                      ),
                    ],
                    [
                      h.span([
                        h.Class(
                          cn(
                            'size-2.5 rounded-full',
                            Option.exists(model.maybePlan, (plan) => plan === value)
                              ? 'bg-primary'
                              : 'bg-transparent',
                          ),
                        ),
                      ]),
                    ],
                  ),
                ],
              ),
          },
          h,
        ),
        toParentMessage: (message) => GotRadioGroupMessage({ message }),
      }),
    ],
  )
