import { Schema as S } from 'effect'
import { slice as itemSlice } from './views/item'
import { slice as kbdSlice } from './views/kbd'
import { slice as labelSlice } from './views/label'
import { slice as listboxSlice } from './views/listbox'
import { slice as loginFormSlice } from './views/login-form'
import { slice as markerSlice } from './views/marker'
import { slice as menuSlice } from './views/menu'
import { slice as menubarSlice } from './views/menubar'
import { slice as navSlice } from './views/nav'
import { slice as navigationMenuSlice } from './views/navigation-menu'
import { slice as popoverSlice } from './views/popover'
import { slice as progressSlice } from './views/progress'
import { slice as radioGroupSlice } from './views/radio-group'
import { slice as resizableSlice } from './views/resizable'
import { slice as selectSlice } from './views/select'
import { slice as separatorSlice } from './views/separator'
import { slice as settingsPageSlice } from './views/settings-page'
import { slice as sheetSlice } from './views/sheet'
import { slice as sidebarSlice } from './views/sidebar'
import { slice as skeletonSlice } from './views/skeleton'
import { slice as sliderSlice } from './views/slider'
import { slice as spinnerSlice } from './views/spinner'
import { slice as switchSlice } from './views/switch'
import { slice as tableSlice } from './views/table'
import { slice as tabsSlice } from './views/tabs'
import { slice as textareaSlice } from './views/textarea'
import { slice as toastSlice } from './views/toast'
import { slice as toggleGroupSlice } from './views/toggle-group'
import { slice as toggleSlice } from './views/toggle'
import { slice as tooltipSlice } from './views/tooltip'
import { slice as virtualListSlice } from './views/virtual-list'

const ModelSchema = S.Struct({
  ...itemSlice.fields,
  ...kbdSlice.fields,
  ...labelSlice.fields,
  ...listboxSlice.fields,
  ...loginFormSlice.fields,
  ...markerSlice.fields,
  ...menuSlice.fields,
  ...menubarSlice.fields,
  ...navSlice.fields,
  ...navigationMenuSlice.fields,
  ...popoverSlice.fields,
  ...progressSlice.fields,
  ...radioGroupSlice.fields,
  ...resizableSlice.fields,
  ...selectSlice.fields,
  ...separatorSlice.fields,
  ...settingsPageSlice.fields,
  ...sheetSlice.fields,
  ...sidebarSlice.fields,
  ...skeletonSlice.fields,
  ...sliderSlice.fields,
  ...spinnerSlice.fields,
  ...switchSlice.fields,
  ...tableSlice.fields,
  ...tabsSlice.fields,
  ...textareaSlice.fields,
  ...toastSlice.fields,
  ...toggleGroupSlice.fields,
  ...toggleSlice.fields,
  ...tooltipSlice.fields,
  ...virtualListSlice.fields,
})
export type Mdl = typeof ModelSchema.Type
