// Statically imported raw sources of every registry item. Vite inlines each
// `?raw` import, so the item pages can render the exact code users copy.

import animationSource from '@foldcn/registry/src/ui/animation.ts?raw'
import buttonSource from '@foldcn/registry/src/ui/button.ts?raw'
import calendarSource from '@foldcn/registry/src/ui/calendar.ts?raw'
import cardSource from '@foldcn/registry/src/ui/card.ts?raw'
import checkboxSource from '@foldcn/registry/src/ui/checkbox.ts?raw'
import comboboxSource from '@foldcn/registry/src/ui/combobox.ts?raw'
import datePickerSource from '@foldcn/registry/src/ui/date-picker.ts?raw'
import dialogSource from '@foldcn/registry/src/ui/dialog.ts?raw'
import disclosureSource from '@foldcn/registry/src/ui/disclosure.ts?raw'
import dragAndDropSource from '@foldcn/registry/src/ui/drag-and-drop.ts?raw'
import fieldsetSource from '@foldcn/registry/src/ui/fieldset.ts?raw'
import fileDropSource from '@foldcn/registry/src/ui/file-drop.ts?raw'
import iconsSource from '@foldcn/registry/src/lib/icons.ts?raw'
import inputSource from '@foldcn/registry/src/ui/input.ts?raw'
import listboxSource from '@foldcn/registry/src/ui/listbox.ts?raw'
import menuSource from '@foldcn/registry/src/ui/menu.ts?raw'
import navSource from '@foldcn/registry/src/ui/nav.ts?raw'
import popoverSource from '@foldcn/registry/src/ui/popover.ts?raw'
import radioGroupSource from '@foldcn/registry/src/ui/radio-group.ts?raw'
import selectSource from '@foldcn/registry/src/ui/select.ts?raw'
import sliderSource from '@foldcn/registry/src/ui/slider.ts?raw'
import switchSource from '@foldcn/registry/src/ui/switch.ts?raw'
import tabsSource from '@foldcn/registry/src/ui/tabs.ts?raw'
import textareaSource from '@foldcn/registry/src/ui/textarea.ts?raw'
import toastSource from '@foldcn/registry/src/ui/toast.ts?raw'
import tooltipSource from '@foldcn/registry/src/ui/tooltip.ts?raw'
import utilsSource from '@foldcn/registry/src/lib/utils.ts?raw'
import virtualListSource from '@foldcn/registry/src/ui/virtual-list.ts?raw'

import dataTableSource from '@foldcn/registry/src/blocks/data-table/data-table.ts?raw'
import loginFormSource from '@foldcn/registry/src/blocks/login-form/login-form.ts?raw'
import settingsPageSource from '@foldcn/registry/src/blocks/settings-page/settings-page.ts?raw'

export type SourceEntry = Readonly<{ path: string; code: string }>

export const sourceByItem: Readonly<Record<string, SourceEntry>> = {
  animation: { path: 'registry/default/ui/animation.ts', code: animationSource },
  button: { path: 'registry/default/ui/button.ts', code: buttonSource },
  calendar: { path: 'registry/default/ui/calendar.ts', code: calendarSource },
  card: { path: 'registry/default/ui/card.ts', code: cardSource },
  checkbox: { path: 'registry/default/ui/checkbox.ts', code: checkboxSource },
  combobox: { path: 'registry/default/ui/combobox.ts', code: comboboxSource },
  'date-picker': {
    path: 'registry/default/ui/date-picker.ts',
    code: datePickerSource,
  },
  dialog: { path: 'registry/default/ui/dialog.ts', code: dialogSource },
  disclosure: { path: 'registry/default/ui/disclosure.ts', code: disclosureSource },
  'drag-and-drop': {
    path: 'registry/default/ui/drag-and-drop.ts',
    code: dragAndDropSource,
  },
  fieldset: { path: 'registry/default/ui/fieldset.ts', code: fieldsetSource },
  'file-drop': { path: 'registry/default/ui/file-drop.ts', code: fileDropSource },
  icons: { path: 'registry/default/lib/icons.ts', code: iconsSource },
  input: { path: 'registry/default/ui/input.ts', code: inputSource },
  listbox: { path: 'registry/default/ui/listbox.ts', code: listboxSource },
  menu: { path: 'registry/default/ui/menu.ts', code: menuSource },
  nav: { path: 'registry/default/ui/nav.ts', code: navSource },
  popover: { path: 'registry/default/ui/popover.ts', code: popoverSource },
  'radio-group': {
    path: 'registry/default/ui/radio-group.ts',
    code: radioGroupSource,
  },
  select: { path: 'registry/default/ui/select.ts', code: selectSource },
  slider: { path: 'registry/default/ui/slider.ts', code: sliderSource },
  switch: { path: 'registry/default/ui/switch.ts', code: switchSource },
  tabs: { path: 'registry/default/ui/tabs.ts', code: tabsSource },
  textarea: { path: 'registry/default/ui/textarea.ts', code: textareaSource },
  toast: { path: 'registry/default/ui/toast.ts', code: toastSource },
  tooltip: { path: 'registry/default/ui/tooltip.ts', code: tooltipSource },
  utils: { path: 'registry/default/lib/utils.ts', code: utilsSource },
  'virtual-list': {
    path: 'registry/default/ui/virtual-list.ts',
    code: virtualListSource,
  },
  'data-table': {
    path: 'registry/default/blocks/data-table/data-table.ts',
    code: dataTableSource,
  },
  'login-form': {
    path: 'registry/default/blocks/login-form/login-form.ts',
    code: loginFormSource,
  },
  'settings-page': {
    path: 'registry/default/blocks/settings-page/settings-page.ts',
    code: settingsPageSource,
  },
}