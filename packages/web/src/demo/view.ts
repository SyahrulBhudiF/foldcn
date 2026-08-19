import { Submodel } from 'foldkit'
import type { Html, HtmlBuilder } from 'foldkit/html'

import type { Message } from './message'
import type { Model } from './model'
import { animationView, toastView } from './views/notify'
import { buttonView, cardView, disclosureView, navView } from './views/helpers'
import { checkboxView, fieldsetView, iconsView, inputView, selectView, switchView, textareaView } from './views/forms'
import { comboboxView, dialogView, listboxView, menuView, popoverView, tooltipView } from './views/floating'
import { radioGroupView, tabsView } from './views/selection'
import { sliderView } from './views/range'
import { calendarView, datePickerView } from './views/calendar'
import { dragAndDropView, fileDropView } from './views/upload'
import { virtualListView } from './views/lists'
import { dataTableView, loginFormView, settingsPageView } from './views/blocks'

export type DemoViewInputs = Readonly<{ itemName: string }>

/** The demo submodel: renders whichever component the current route names.
 *  Embedded by the root under one slot, so one demo model/reducer backs all
 *  of them. */
export const view = Submodel.defineView<Model, Message, DemoViewInputs>(
  (model, viewInputs, h): Html => {
    switch (viewInputs.itemName) {
      case 'button': return buttonView(model, h)
      case 'card': return cardView(model, h)
      case 'nav': return navView(model, h)
      case 'disclosure': return disclosureView(model, h)
      case 'input': return inputView(model, h)
      case 'textarea': return textareaView(model, h)
      case 'select': return selectView(model, h)
      case 'checkbox': return checkboxView(model, h)
      case 'switch': return switchView(model, h)
      case 'fieldset': return fieldsetView(model, h)
      case 'icons': return iconsView(model, h)

      case 'dialog': return dialogView(model, h)
      case 'popover': return popoverView(model, h)
      case 'tooltip': return tooltipView(model, h)
      case 'menu': return menuView(model, h)
      case 'listbox': return listboxView(model, h)
      case 'combobox': return comboboxView(model, h)
      case 'tabs': return tabsView(model, h)
      case 'radio-group': return radioGroupView(model, h)
      case 'slider': return sliderView(model, h)
      case 'calendar': return calendarView(model, h)
      case 'date-picker': return datePickerView(model, h)
      case 'toast': return toastView(model, h)
      case 'animation': return animationView(model, h)
      case 'file-drop': return fileDropView(model, h)
      case 'virtual-list': return virtualListView(model, h)
      case 'drag-and-drop': return dragAndDropView(model, h)

      case 'login-form': return loginFormView(model, h)
      case 'settings-page': return settingsPageView(model, h)
      case 'data-table': return dataTableView(model, h)

      default:
        // Items without a rendered surface (utils, the base style) land here.
        return h.empty
    }
  },
)