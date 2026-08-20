import { Submodel } from 'foldkit'
import type { Html } from 'foldkit/html'

import type { Message } from './message'
import type { Model } from './model'

import { animationView } from './views/animation'
import { alertView } from './views/alert'
import { aspectRatioView } from './views/aspect-ratio'
import { avatarView } from './views/avatar'
import { badgeView } from './views/badge'
import { buttonView } from './views/button'
import { calendarView } from './views/calendar'
import { cardView } from './views/card'
import { checkboxView } from './views/checkbox'
import { comboboxView } from './views/combobox'
import { dataTableView } from './views/data-table'
import { datePickerView } from './views/date-picker'
import { dialogView } from './views/dialog'
import { directionView } from './views/direction'
import { disclosureView } from './views/disclosure'
import { dragAndDropView } from './views/drag-and-drop'
import { emptyView } from './views/empty'
import { fieldsetView } from './views/fieldset'
import { fileDropView } from './views/file-drop'
import { iconsView } from './views/icons'
import { inputView } from './views/input'
import { itemView } from './views/item'
import { kbdView } from './views/kbd'
import { labelView } from './views/label'
import { listboxView } from './views/listbox'
import { loginFormView } from './views/login-form'
import { markerView } from './views/marker'
import { menuView } from './views/menu'
import { navView } from './views/nav'
import { popoverView } from './views/popover'
import { progressView } from './views/progress'
import { radioGroupView } from './views/radio-group'
import { selectView } from './views/select'
import { separatorView } from './views/separator'
import { settingsPageView } from './views/settings-page'
import { skeletonView } from './views/skeleton'
import { sliderView } from './views/slider'
import { spinnerView } from './views/spinner'
import { alertDialogView } from './views/alert-dialog'
import { sheetView } from './views/sheet'
import { drawerView } from './views/drawer'
import { hoverCardView } from './views/hover-card'
import { accordionView } from './views/accordion'
import { collapsibleView } from './views/collapsible'
import { contextMenuView } from './views/context-menu'
import { menubarView } from './views/menubar'
import { sonnerView } from './views/sonner'
import { buttonGroupView } from './views/button-group'
import { inputGroupView } from './views/input-group'
import { toggleView } from './views/toggle'
import { toggleGroupView } from './views/toggle-group'
import { inputOtpView } from './views/input-otp'
import { breadcrumbView } from './views/breadcrumb'
import { navigationMenuView } from './views/navigation-menu'
import { sideBarView } from './views/sidebar'
import { tableView } from './views/table'
import { commandView } from './views/command'
import { resizableView } from './views/resizable'
import { switchView } from './views/switch'
import { tabsView } from './views/tabs'
import { textareaView } from './views/textarea'
import { toastView } from './views/toast'
import { tooltipView } from './views/tooltip'
import { virtualListView } from './views/virtual-list'

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
  badge: badgeView,
  skeleton: skeletonView,
  separator: separatorView,
  kbd: kbdView,
  avatar: avatarView,
  'aspect-ratio': aspectRatioView,
  alert: alertView,
  empty: emptyView,
  spinner: spinnerView,
  'alert-dialog': alertDialogView,
  sheet: sheetView,
  drawer: drawerView,
  'hover-card': hoverCardView,
  accordion: accordionView,
  collapsible: collapsibleView,
  'context-menu': contextMenuView,
  menubar: menubarView,
  sonner: sonnerView,
  'button-group': buttonGroupView,
  'input-group': inputGroupView,
  toggle: toggleView,
  'toggle-group': toggleGroupView,
  'input-otp': inputOtpView,
  breadcrumb: breadcrumbView,
  'navigation-menu': navigationMenuView,
  sidebar: sideBarView,
  table: tableView,
  command: commandView,
  resizable: resizableView,
  marker: markerView,
  item: itemView,
  direction: directionView,
  label: labelView,
  progress: progressView,
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

export const hasDemo = (name: string): name is DemoItemName => name in views

/** The demo submodel: renders whichever component the current route names.
 *  Embedded by the root under one slot, so one demo model/reducer backs all
 *  of them. */
export const view = Submodel.defineView<Model, Message, DemoViewInputs>(
  (model, viewInputs, h): Html => views[viewInputs.itemName](model, h),
)
