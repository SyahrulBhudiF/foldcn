import { Submodel } from 'foldkit'
import type { Html } from 'foldkit/html'

import type { Message } from './message'
import type { Model } from './model'
import { animationView, toastView } from './views/notify'
import { buttonView, cardView, disclosureView, navView } from './views/helpers'
import {
  checkboxView,
  fieldsetView,
  iconsView,
  inputView,
  selectView,
  switchView,
  textareaView,
} from './views/forms'
import {
  comboboxView,
  dialogView,
  listboxView,
  menuView,
  popoverView,
  tooltipView,
} from './views/floating'
import { radioGroupView, tabsView } from './views/selection'
import { sliderView } from './views/range'
import { calendarView, datePickerView } from './views/calendar'
import { dragAndDropView, fileDropView } from './views/upload'
import { virtualListView } from './views/lists'
import { dataTableView, loginFormView, settingsPageView } from './views/blocks'

const views = {
  button: buttonView,
  card: cardView,
  nav: navView,
  disclosure: disclosureView,
  input: inputView,
  textarea: textareaView,
  select: selectView,
  checkbox: checkboxView,
  switch: switchView,
  fieldset: fieldsetView,
  icons: iconsView,
  dialog: dialogView,
  popover: popoverView,
  tooltip: tooltipView,
  menu: menuView,
  listbox: listboxView,
  combobox: comboboxView,
  tabs: tabsView,
  'radio-group': radioGroupView,
  slider: sliderView,
  calendar: calendarView,
  'date-picker': datePickerView,
  toast: toastView,
  animation: animationView,
  'file-drop': fileDropView,
  'virtual-list': virtualListView,
  'drag-and-drop': dragAndDropView,
  'login-form': loginFormView,
  'settings-page': settingsPageView,
  'data-table': dataTableView,
} as const;

/** The demo submodel: renders whichever component the current route names.
 *  Embedded by the root under one slot, so one demo model/reducer backs all
 *  of them. */
export type DemoItemName = keyof typeof views

export const isDemoItemName = (name: string): name is DemoItemName => name in views

export type DemoViewInputs = Readonly<{ itemName: DemoItemName }>

/** The demo submodel: renders whichever component the current route names.
 *  Embedded by the root under one slot, so one demo model/reducer backs all
 *  of them. */
export const view = Submodel.defineView<Model, Message, DemoViewInputs>(
  (model, viewInputs, h): Html => views[viewInputs.itemName](model, h),
)
