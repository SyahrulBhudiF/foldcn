import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { checkbox } from '@foldcn/registry/styles/default/ui/checkbox'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const ToggledCheckbox = m('ToggledCheckbox', { isChecked: S.Boolean })
const ToggledCheckboxWithDescription = m('ToggledCheckboxWithDescription', { isChecked: S.Boolean })
const ToggledCheckboxNotifications = m('ToggledCheckboxNotifications', { isChecked: S.Boolean })

export const checkboxView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-4')],
    [
      checkbox<Message>(
        {
          id: 'terms-checkbox',
          label: 'Accept terms and conditions',
          isChecked: model.isCheckboxChecked,
          onToggle: (isChecked) => ToggledCheckbox({ isChecked }),
        },
        h,
      ),
      checkbox<Message>(
        {
          id: 'terms-checkbox-2',
          label: 'Accept terms and conditions',
          maybeDescription: 'By clicking this checkbox, you agree to the terms.',
          isChecked: model.isCheckboxWithDescriptionChecked,
          onToggle: (isChecked) => ToggledCheckboxWithDescription({ isChecked }),
        },
        h,
      ),
      checkbox<Message>(
        {
          id: 'toggle-checkbox',
          label: 'Enable notifications',
          isChecked: false,
          isDisabled: true,
          onToggle: () => ToggledCheckbox({ isChecked: false }),
        },
        h,
      ),
      checkbox<Message>(
        {
          id: 'toggle-checkbox-2',
          label: 'Enable notifications',
          maybeDescription: 'You can enable or disable notifications at any time.',
          isChecked: model.isCheckboxNotificationsChecked,
          onToggle: (isChecked) => ToggledCheckboxNotifications({ isChecked }),
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
  messages: [ToggledCheckbox, ToggledCheckboxWithDescription, ToggledCheckboxNotifications],
  handlers: (model: State) => ({
    ToggledCheckbox: ({ isChecked }: typeof ToggledCheckbox.Type): UpdateReturn => [
      evo(model, { isCheckboxChecked: () => isChecked }),
      [],
    ],
    ToggledCheckboxWithDescription: ({
      isChecked,
    }: typeof ToggledCheckboxWithDescription.Type): UpdateReturn => [
      evo(model, { isCheckboxWithDescriptionChecked: () => isChecked }),
      [],
    ],
    ToggledCheckboxNotifications: ({
      isChecked,
    }: typeof ToggledCheckboxNotifications.Type): UpdateReturn => [
      evo(model, { isCheckboxNotificationsChecked: () => isChecked }),
      [],
    ],
  }),
  samples: [ToggledCheckbox({ isChecked: true })],
})
