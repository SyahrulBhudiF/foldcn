import type { Html, HtmlBuilder } from 'foldkit/html'

import { checkbox } from '@foldcn/registry/src/ui/checkbox'
import { fieldset } from '@foldcn/registry/src/ui/fieldset'
import { icon } from '@foldcn/registry/src/lib/icons'
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minus,
  X,
} from 'lucide'
import { input } from '@foldcn/registry/src/ui/input'
import * as select from '@foldcn/registry/src/ui/select'
import { switch_ } from '@foldcn/registry/src/ui/switch'
import { LanguageSelect } from '../bundles'
import { textarea } from '@foldcn/registry/src/ui/textarea'

import {
  GotSelectMessage,
  ToggledCheckbox,
  ToggledSwitchEmail,
  ToggledSwitchTfa,
  UpdatedInputValue,
  UpdatedTextareaValue,
  type Message,
} from '../message'
import type { Model } from '../model'

export const inputView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-4')],
    [
      input<Message>(
        {
          id: 'input-email',
          label: 'Email',
          type: 'email',
          value: model.inputValue,
          onInput: (value) => UpdatedInputValue({ value }),
          placeholder: 'you@example.com',
          maybeDescription: 'We never share your email.',
        },
        h,
      ),
      input<Message>(
        {
          id: 'input-disabled',
          label: 'Disabled',
          value: 'Read only',
          isDisabled: true,
        },
        h,
      ),
    ],
  )

export const textareaView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('w-full max-w-sm')],
    [
      textarea<Message>(
        {
          id: 'textarea-bio',
          label: 'Bio',
          value: model.textareaValue,
          onInput: (value) => UpdatedTextareaValue({ value }),
          rows: 4,
          placeholder: 'Tell us about yourself...',
          maybeDescription: 'Appears on your public profile.',
        },
        h,
      ),
    ],
  )

const LANGUAGE_OPTIONS = [
  ['en', 'English'],
  ['id', 'Bahasa Indonesia'],
  ['ja', '日本語'],
] as const

export const selectView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class(select.selectWrapperClass)],
    [
      select.selectLabel('Language', h),
      h.submodel({
        slotId: model.select.id,
        model: model.select,
        view: LanguageSelect.view,
        viewInputs: select.styledViewInputs<Message, { value: string; label: string }, string>({
          options: LANGUAGE_OPTIONS.map(([value, label]) => ({ value, label })),
          maybeSelectedValue: model.maybeSelectValue,
          itemToValue: (item) => item.value,
          itemToLabel: (item) => item.label,
          label: 'Language',
          description: 'Choose your interface language.',
          isInvalid: false,
        }, h),
        toParentMessage: (message) => GotSelectMessage({ message }),
      }),
      select.selectDescription('Choose your interface language.', h)
    ],
  )

export const checkboxView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-5')],
    [
      checkbox<Message>(
        {
          id: 'checkbox-terms',
          label: 'Accept terms and conditions',
          maybeDescription: 'Required before you can continue.',
          isChecked: model.isCheckboxChecked,
          onToggle: (isChecked) => ToggledCheckbox({ isChecked }),
        },
        h,
      ),
      checkbox<Message>(
        {
          id: 'checkbox-indeterminate',
          label: 'Notify me of updates',
          isChecked: false,
          isIndeterminate: true,
          onToggle: () => ToggledCheckbox({ isChecked: false }),
        },
        h,
      ),
    ],
  )

export const switchView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-5')],
    [
      switch_<Message>(
        {
          id: 'switch-email',
          label: 'Email notifications',
          maybeDescription: 'Receive emails about your account activity.',
          isChecked: model.isSwitchEmailChecked,
          onToggle: (isChecked) => ToggledSwitchEmail({ isChecked }),
        },
        h,
      ),
      switch_<Message>(
        {
          id: 'switch-2fa',
          label: 'Two-factor authentication',
          maybeDescription: 'Add an extra layer of security to your account.',
          isChecked: model.isSwitchTfaChecked,
          onToggle: (isChecked) => ToggledSwitchTfa({ isChecked }),
        },
        h,
      ),
    ],
  )

export const fieldsetView = (model: Model, h: HtmlBuilder<Message>): Html =>
  fieldset<Message>(
    {
      id: 'fieldset-contact',
      legend: 'Contact details',
      maybeDescription: 'Used for shipping and billing.',
      children: [
        input<Message>(
          {
            id: 'fieldset-name',
            label: 'Name',
            value: model.inputValue,
            onInput: (value) => UpdatedInputValue({ value }),
            placeholder: 'Ada Lovelace',
          },
          h,
        ),
        h.div(
          [h.Class(select.selectWrapperClass)],
          [
            select.selectLabel('Country', h),
            h.submodel({
              slotId: model.select.id,
              model: model.select,
              view: LanguageSelect.view,
              viewInputs: select.styledViewInputs<Message, { value: string; label: string }, string>({
                options: LANGUAGE_OPTIONS.map(([value, label]) => ({ value, label })),
                maybeSelectedValue: model.maybeSelectValue,
                itemToValue: (item) => item.value,
                itemToLabel: (item) => item.label,
                label: 'Country',
              }, h),
              toParentMessage: (message) => GotSelectMessage({ message }),
            }),
          ],
        ),
      ],
    },
    h,
  )

// A small grid of the icons the registry exports, rendered with the shared
// `icon` helper.
const ICON_ROWS: ReadonlyArray<ReadonlyArray<[string, (h: HtmlBuilder<Message>) => Html]>> = [
  [
    ['check', (h) => icon(h, Check)],
    ['chevron-down', (h) => icon(h, ChevronDown)],
    ['chevron-left', (h) => icon(h, ChevronLeft)],
    ['chevron-right', (h) => icon(h, ChevronRight)],
    ['minus', (h) => icon(h, Minus)],
    ['x', (h) => icon(h, X)],
  ],
]

export const iconsView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('w-full max-w-lg')],
    [
      h.p(
        [h.Class('mb-4 text-sm text-muted-foreground')],
        [
          'Lucide icons rendered as Foldkit virtual DOM via the h builder. Import `icon(h, node, className?)` from `@foldcn/registry/src/lib/icons`.',
        ],
      ),
      ...ICON_ROWS.map((row) =>
        h.div(
          [h.Class('mb-2 grid grid-cols-6 gap-2')],
          row.map(([label, render]) =>
            h.div(
              [
                h.Class(
                  'flex flex-col items-center gap-1 rounded-lg border border-border bg-card p-3 text-muted-foreground',
                ),
              ],
              [render(h), h.span([h.Class('text-[11px]')], [label])],
            ),
          ),
        ),
      ),
    ],
  )
