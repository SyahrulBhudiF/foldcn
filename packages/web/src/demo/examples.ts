import type { DemoItemName } from './view'

import alertViewSource from './views/alert.ts?raw'
import animationViewSource from './views/animation.ts?raw'
import aspectRatioViewSource from './views/aspect-ratio.ts?raw'
import avatarViewSource from './views/avatar.ts?raw'
import badgeViewSource from './views/badge.ts?raw'
import buttonViewSource from './views/button.ts?raw'
import calendarViewSource from './views/calendar.ts?raw'
import cardViewSource from './views/card.ts?raw'
import checkboxViewSource from './views/checkbox.ts?raw'
import comboboxViewSource from './views/combobox.ts?raw'
import dataTableViewSource from './views/data-table.ts?raw'
import datePickerViewSource from './views/date-picker.ts?raw'
import dialogViewSource from './views/dialog.ts?raw'
import directionViewSource from './views/direction.ts?raw'
import disclosureViewSource from './views/disclosure.ts?raw'
import dragAndDropViewSource from './views/drag-and-drop.ts?raw'
import emptyViewSource from './views/empty.ts?raw'
import fieldsetViewSource from './views/fieldset.ts?raw'
import fileDropViewSource from './views/file-drop.ts?raw'
import iconsViewSource from './views/icons.ts?raw'
import inputViewSource from './views/input.ts?raw'
import itemViewSource from './views/item.ts?raw'
import kbdViewSource from './views/kbd.ts?raw'
import labelViewSource from './views/label.ts?raw'
import listboxViewSource from './views/listbox.ts?raw'
import loginFormViewSource from './views/login-form.ts?raw'
import markerViewSource from './views/marker.ts?raw'
import menuViewSource from './views/menu.ts?raw'
import navViewSource from './views/nav.ts?raw'
import popoverViewSource from './views/popover.ts?raw'
import progressViewSource from './views/progress.ts?raw'
import radioGroupViewSource from './views/radio-group.ts?raw'
import selectViewSource from './views/select.ts?raw'
import separatorViewSource from './views/separator.ts?raw'
import settingsPageViewSource from './views/settings-page.ts?raw'
import skeletonViewSource from './views/skeleton.ts?raw'
import sliderViewSource from './views/slider.ts?raw'
import spinnerViewSource from './views/spinner.ts?raw'
import alertDialogViewSource from './views/alert-dialog.ts?raw'
import sheetViewSource from './views/sheet.ts?raw'
import drawerViewSource from './views/drawer.ts?raw'
import hoverCardViewSource from './views/hover-card.ts?raw'
import accordionViewSource from './views/accordion.ts?raw'
import collapsibleViewSource from './views/collapsible.ts?raw'
import contextMenuViewSource from './views/context-menu.ts?raw'
import menubarViewSource from './views/menubar.ts?raw'
import sonnerViewSource from './views/sonner.ts?raw'
import buttonGroupViewSource from './views/button-group.ts?raw'
import inputGroupViewSource from './views/input-group.ts?raw'
import toggleViewSource from './views/toggle.ts?raw'
import toggleGroupViewSource from './views/toggle-group.ts?raw'
import inputOtpViewSource from './views/input-otp.ts?raw'
import breadcrumbViewSource from './views/breadcrumb.ts?raw'
import navigationMenuViewSource from './views/navigation-menu.ts?raw'
import sidebarViewSource from './views/sidebar.ts?raw'
import tableViewSource from './views/table.ts?raw'
import commandViewSource from './views/command.ts?raw'
import resizableViewSource from './views/resizable.ts?raw'
import switchViewSource from './views/switch.ts?raw'
import tabsViewSource from './views/tabs.ts?raw'
import textareaViewSource from './views/textarea.ts?raw'
import toastViewSource from './views/toast.ts?raw'
import tooltipViewSource from './views/tooltip.ts?raw'
import virtualListViewSource from './views/virtual-list.ts?raw'

export type DemoExample = Readonly<{ path: string; code: string }>

/**
 * The "usage" code shown under each preview is the actual view source, imported
 * `?raw`. That keeps it a single source of truth — the demo and the snippet can
 * never drift — at the cost of showing the real submodel wiring rather than a
 * trimmed example.
 */
export const demoExampleByName: Readonly<Record<DemoItemName, DemoExample>> = {
  alert: { path: 'src/demo/views/alert.ts', code: alertViewSource },
  animation: { path: 'src/demo/views/animation.ts', code: animationViewSource },
  'aspect-ratio': {
    path: 'src/demo/views/aspect-ratio.ts',
    code: aspectRatioViewSource,
  },
  avatar: { path: 'src/demo/views/avatar.ts', code: avatarViewSource },
  badge: { path: 'src/demo/views/badge.ts', code: badgeViewSource },
  button: { path: 'src/demo/views/button.ts', code: buttonViewSource },
  calendar: { path: 'src/demo/views/calendar.ts', code: calendarViewSource },
  card: { path: 'src/demo/views/card.ts', code: cardViewSource },
  checkbox: { path: 'src/demo/views/checkbox.ts', code: checkboxViewSource },
  combobox: { path: 'src/demo/views/combobox.ts', code: comboboxViewSource },
  'data-table': {
    path: 'src/demo/views/data-table.ts',
    code: dataTableViewSource,
  },
  'date-picker': {
    path: 'src/demo/views/date-picker.ts',
    code: datePickerViewSource,
  },
  dialog: { path: 'src/demo/views/dialog.ts', code: dialogViewSource },
  direction: { path: 'src/demo/views/direction.ts', code: directionViewSource },
  disclosure: { path: 'src/demo/views/disclosure.ts', code: disclosureViewSource },
  'drag-and-drop': {
    path: 'src/demo/views/drag-and-drop.ts',
    code: dragAndDropViewSource,
  },
  empty: { path: 'src/demo/views/empty.ts', code: emptyViewSource },
  fieldset: { path: 'src/demo/views/fieldset.ts', code: fieldsetViewSource },
  'file-drop': {
    path: 'src/demo/views/file-drop.ts',
    code: fileDropViewSource,
  },
  icons: { path: 'src/demo/views/icons.ts', code: iconsViewSource },
  input: { path: 'src/demo/views/input.ts', code: inputViewSource },
  item: { path: 'src/demo/views/item.ts', code: itemViewSource },
  kbd: { path: 'src/demo/views/kbd.ts', code: kbdViewSource },
  label: { path: 'src/demo/views/label.ts', code: labelViewSource },
  listbox: { path: 'src/demo/views/listbox.ts', code: listboxViewSource },
  'login-form': {
    path: 'src/demo/views/login-form.ts',
    code: loginFormViewSource,
  },
  marker: { path: 'src/demo/views/marker.ts', code: markerViewSource },
  menu: { path: 'src/demo/views/menu.ts', code: menuViewSource },
  nav: { path: 'src/demo/views/nav.ts', code: navViewSource },
  popover: { path: 'src/demo/views/popover.ts', code: popoverViewSource },
  progress: { path: 'src/demo/views/progress.ts', code: progressViewSource },
  'radio-group': {
    path: 'src/demo/views/radio-group.ts',
    code: radioGroupViewSource,
  },
  select: { path: 'src/demo/views/select.ts', code: selectViewSource },
  separator: { path: 'src/demo/views/separator.ts', code: separatorViewSource },
  'settings-page': {
    path: 'src/demo/views/settings-page.ts',
    code: settingsPageViewSource,
  },
  skeleton: { path: 'src/demo/views/skeleton.ts', code: skeletonViewSource },
  slider: { path: 'src/demo/views/slider.ts', code: sliderViewSource },
  spinner: { path: 'src/demo/views/spinner.ts', code: spinnerViewSource },
  'alert-dialog': { path: 'src/demo/views/alert-dialog.ts', code: alertDialogViewSource },
  sheet: { path: 'src/demo/views/sheet.ts', code: sheetViewSource },
  drawer: { path: 'src/demo/views/drawer.ts', code: drawerViewSource },
  'hover-card': { path: 'src/demo/views/hover-card.ts', code: hoverCardViewSource },
  accordion: { path: 'src/demo/views/accordion.ts', code: accordionViewSource },
  collapsible: { path: 'src/demo/views/collapsible.ts', code: collapsibleViewSource },
  'context-menu': { path: 'src/demo/views/context-menu.ts', code: contextMenuViewSource },
  menubar: { path: 'src/demo/views/menubar.ts', code: menubarViewSource },
  sonner: { path: 'src/demo/views/sonner.ts', code: sonnerViewSource },
  'button-group': { path: 'src/demo/views/button-group.ts', code: buttonGroupViewSource },
  'input-group': { path: 'src/demo/views/input-group.ts', code: inputGroupViewSource },
  toggle: { path: 'src/demo/views/toggle.ts', code: toggleViewSource },
  'toggle-group': { path: 'src/demo/views/toggle-group.ts', code: toggleGroupViewSource },
  'input-otp': { path: 'src/demo/views/input-otp.ts', code: inputOtpViewSource },
  breadcrumb: { path: 'src/demo/views/breadcrumb.ts', code: breadcrumbViewSource },
  'navigation-menu': { path: 'src/demo/views/navigation-menu.ts', code: navigationMenuViewSource },
  sidebar: { path: 'src/demo/views/sidebar.ts', code: sidebarViewSource },
  table: { path: 'src/demo/views/table.ts', code: tableViewSource },
  command: { path: 'src/demo/views/command.ts', code: commandViewSource },
  resizable: { path: 'src/demo/views/resizable.ts', code: resizableViewSource },
  switch: { path: 'src/demo/views/switch.ts', code: switchViewSource },
  tabs: { path: 'src/demo/views/tabs.ts', code: tabsViewSource },
  textarea: { path: 'src/demo/views/textarea.ts', code: textareaViewSource },
  toast: { path: 'src/demo/views/toast.ts', code: toastViewSource },
  tooltip: { path: 'src/demo/views/tooltip.ts', code: tooltipViewSource },
  'virtual-list': {
    path: 'src/demo/views/virtual-list.ts',
    code: virtualListViewSource,
  },
}
