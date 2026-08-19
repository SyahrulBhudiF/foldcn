import { Option } from 'effect'
import type { Html, HtmlBuilder } from 'foldkit/html'

import * as combobox from '@foldcn/registry/src/ui/combobox'
import * as Dialog from '@foldcn/registry/src/ui/dialog'
import * as listbox from '@foldcn/registry/src/ui/listbox'
import * as menu from '@foldcn/registry/src/ui/menu'
import * as Popover from '@foldcn/registry/src/ui/popover'
import * as Tooltip from '@foldcn/registry/src/ui/tooltip'
import { button } from '@foldcn/registry/src/ui/button'

import { CityCombobox, DemoMenu, ItemListbox } from '../bundles'
import {
  ClickedOpenDialog,
  GotComboboxMessage,
  GotDialogMessage,
  GotListboxMessage,
  GotMenuMessage,
  GotPopoverMessage,
  GotTooltipMessage,
  type Message,
} from '../message'
import type { City, ListboxItem, Model } from '../model'

const CITIES: ReadonlyArray<City> = [
  'Johannesburg',
  'Kyiv',
  'Oxford',
  'Plymouth',
  'Quito',
  'Wellington',
  'Zurich',
]

const LISTBOX_ITEMS: ReadonlyArray<ListboxItem> = [
  'Michael Bluth',
  'Lindsay Funke',
  'Gob Bluth',
  'George Michael',
  'Tobias Funke',
]

export const dialogView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex flex-col items-start gap-4')],
    [
      button<Message>({ onClick: ClickedOpenDialog() }, 'Open dialog', h),
      h.submodel({
        slotId: model.dialog.id,
        model: model.dialog,
        view: Dialog.view,
        viewInputs: Dialog.styledViewInputs(
          {
            content: ({ closeButton, title, description }, h) => [
              h.h2([...title, h.Class('text-lg font-semibold')], ['Edit profile']),
              h.p(
                [...description, h.Class('text-sm text-muted-foreground')],
                ['Make changes to your profile here. Click save when you are done.'],
              ),
              h.div(
                [h.Class('mt-4 bg-muted p-3 text-sm text-muted-foreground')],
                ['This modal traps focus and closes on Esc or backdrop click.'],
              ),
              h.div(
                [h.Class('mt-6 flex justify-end gap-2')],
                [
                  h.button(
                    [...closeButton, h.Class('rounded-md border border-input px-4 py-2 text-sm')],
                    ['Cancel'],
                  ),
                  h.button(
                    [
                      ...closeButton,
                      h.Class('rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground'),
                    ],
                    ['Save'],
                  ),
                ],
              ),
            ],
          },
          h,
        ),
        toParentMessage: (message) => GotDialogMessage({ message }),
      }),
    ],
  )

export const popoverView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.submodel({
    slotId: model.popover.id,
    model: model.popover,
    view: Popover.view,
    viewInputs: Popover.styledViewInputs(
      {
        anchor: { placement: 'bottom-start', gap: 4, padding: 8 },
        trigger: 'Open popover',
        content: [
          h.p([h.Class('text-sm font-medium')], ['Dimensions']),
          h.p(
            [h.Class('mt-1 text-sm text-muted-foreground')],
            [
              'Set the dimensions for the layer. Positioned with an anchor, dismissed on outside press.',
            ],
          ),
        ],
      },
      h,
    ),
    toParentMessage: (message) => GotPopoverMessage({ message }),
  })

export const tooltipView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.submodel({
    slotId: model.tooltip.id,
    model: model.tooltip,
    view: Tooltip.view,
    viewInputs: Tooltip.styledViewInputs(
      {
        anchor: { placement: 'top', gap: 8, padding: 8 },
        trigger: 'Hover me',
        content: 'Tooltip content',
      },
      h,
    ),
    toParentMessage: (message) => GotTooltipMessage({ message }),
  })

export const menuView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.submodel({
    slotId: model.menu.id,
    model: model.menu,
    view: DemoMenu.view,
    viewInputs: menu.viewInputs<string>({
      items: ['Edit', 'Duplicate', 'Archive', 'Delete'],
      buttonContent: h.span([], ['Open menu']),
      itemToConfig: (item, { isActive }) => ({
        className: isActive ? 'font-medium' : '',
        content: h.span([], [item]),
      }),
    }),
    toParentMessage: (message) => GotMenuMessage({ message }),
  })

export const listboxView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex flex-col gap-1.5')],
    [
      h.label([h.Class('text-sm font-medium')], ['Family member']),
      h.submodel({
        slotId: model.listbox.id,
        model: model.listbox,
        view: ItemListbox.view,
        viewInputs: listbox.viewInputs<ListboxItem, ListboxItem>({
          items: LISTBOX_ITEMS,
          maybeSelectedValue: model.maybeListboxValue,
          buttonContent: h.span(
            [],
            [Option.getOrElse(model.maybeListboxValue, () => 'Select a Bluth')],
          ),
          itemToConfig: (item, { isSelected, isActive }) => ({
            className: isActive ? 'font-medium' : '',
            content: h.span(
              [h.Class('flex w-full items-center justify-between gap-2')],
              [h.span([], [item]), ...(isSelected ? [h.span([], ['✓'])] : [])],
            ),
          }),
        }),
        toParentMessage: (message) => GotListboxMessage({ message }),
      }),
    ],
  )

export const comboboxView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('w-full max-w-xs')],
    [
      h.submodel({
        slotId: model.combobox.id,
        model: model.combobox,
        view: CityCombobox.view,
        viewInputs: combobox.viewInputs<City>({
          items: CITIES,
          restingInputValue: Option.getOrElse(model.maybeComboboxValue, () => ''),
          maybeSelectedValue: model.maybeComboboxValue,
          itemToValue: (city) => city,
          itemToDisplayText: (city) => city,
          inputPlaceholder: 'Select a city...',
          itemToConfig: (city, { isSelected, isActive }) => ({
            className: isActive ? 'font-medium' : '',
            content: h.span(
              [h.Class('flex w-full items-center justify-between gap-2')],
              [h.span([], [city]), ...(isSelected ? [h.span([], ['✓'])] : [])],
            ),
          }),
        }),
        toParentMessage: (message) => GotComboboxMessage({ message }),
      }),
    ],
  )
