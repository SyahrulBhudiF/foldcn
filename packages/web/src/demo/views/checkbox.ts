import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { checkbox } from '@foldcn/registry/styles/default/ui/checkbox'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const Message = defineMessageUnion({
  ToggledCheckbox: { isChecked: S.Boolean },
  ToggledCheckboxWithDescription: { isChecked: S.Boolean },
  ToggledCheckboxNotifications: { isChecked: S.Boolean },
})

export const checkboxView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-4')],
    [
      checkbox<AppMessage>(
        {
          id: 'terms-checkbox',
          label: 'Accept terms and conditions',
          isChecked: model.isCheckboxChecked,
          onToggle: (isChecked) => Message.ToggledCheckbox({ isChecked }),
        },
        h,
      ),
      checkbox<AppMessage>(
        {
          id: 'terms-checkbox-2',
          label: 'Accept terms and conditions',
          description: 'By clicking this checkbox, you agree to the terms.',
          isChecked: model.isCheckboxWithDescriptionChecked,
          onToggle: (isChecked) => Message.ToggledCheckboxWithDescription({ isChecked }),
        },
        h,
      ),
      checkbox<AppMessage>(
        {
          id: 'toggle-checkbox',
          label: 'Enable notifications',
          isChecked: false,
          isDisabled: true,
          onToggle: () => Message.ToggledCheckbox({ isChecked: false }),
        },
        h,
      ),
      checkbox<AppMessage>(
        {
          id: 'toggle-checkbox-2',
          label: 'Enable notifications',
          description: 'You can enable or disable notifications at any time.',
          isChecked: model.isCheckboxNotificationsChecked,
          onToggle: (isChecked) => Message.ToggledCheckboxNotifications({ isChecked }),
        },
        h,
      ),
    ],
  )

const fields = {
  isCheckboxChecked: S.Boolean,
  isCheckboxWithDescriptionChecked: S.Boolean,
  isCheckboxNotificationsChecked: S.Boolean,
}

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: {
    isCheckboxChecked: false,
    isCheckboxWithDescriptionChecked: true,
    isCheckboxNotificationsChecked: false,
  },
  messages: [
    Message.ToggledCheckbox,
    Message.ToggledCheckboxWithDescription,
    Message.ToggledCheckboxNotifications,
  ],
  handlers: (model: State) => ({
    ToggledCheckbox: ({ isChecked }: typeof Message.ToggledCheckbox.Type): UpdateReturn => [
      evo(model, { isCheckboxChecked: () => isChecked }),
      [],
    ],
    ToggledCheckboxWithDescription: ({
      isChecked,
    }: typeof Message.ToggledCheckboxWithDescription.Type): UpdateReturn => [
      evo(model, { isCheckboxWithDescriptionChecked: () => isChecked }),
      [],
    ],
    ToggledCheckboxNotifications: ({
      isChecked,
    }: typeof Message.ToggledCheckboxNotifications.Type): UpdateReturn => [
      evo(model, { isCheckboxNotificationsChecked: () => isChecked }),
      [],
    ],
  }),
  samples: [Message.ToggledCheckbox({ isChecked: true })],
})
