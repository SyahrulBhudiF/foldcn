import { Schema as S } from 'effect'
import { slice as accordionSlice } from './views/accordion'
import { slice as alertDialogSlice } from './views/alert-dialog'
import { slice as alertSlice } from './views/alert'
import { slice as animationSlice } from './views/animation'
import { slice as aspectRatioSlice } from './views/aspect-ratio'
import { slice as avatarSlice } from './views/avatar'
import { slice as badgeSlice } from './views/badge'
import { slice as breadcrumbSlice } from './views/breadcrumb'
import { slice as buttonGroupSlice } from './views/button-group'
import { slice as buttonSlice } from './views/button'
import { slice as calendarSlice } from './views/calendar'
import { slice as cardSlice } from './views/card'
import { slice as checkboxSlice } from './views/checkbox'
import { slice as collapsibleSlice } from './views/collapsible'
import { slice as comboboxSlice } from './views/combobox'
import { slice as commandSlice } from './views/command'
import { slice as contextMenuSlice } from './views/context-menu'
import { slice as dataTableSlice } from './views/data-table'
import { slice as datePickerSlice } from './views/date-picker'
import { slice as dialogSlice } from './views/dialog'
import { slice as directionSlice } from './views/direction'
import { slice as disclosureSlice } from './views/disclosure'
import { slice as dragAndDropSlice } from './views/drag-and-drop'
import { slice as drawerSlice } from './views/drawer'
import { slice as emptySlice } from './views/empty'
import { slice as fieldsetSlice } from './views/fieldset'
import { slice as fileDropSlice } from './views/file-drop'
import { slice as hoverCardSlice } from './views/hover-card'
import { slice as iconsSlice } from './views/icons'
import { slice as inputGroupSlice } from './views/input-group'
import { slice as inputOtpSlice } from './views/input-otp'
import { slice as inputSlice } from './views/input'

const ModelSchema = S.Struct({
  ...accordionSlice.fields,
  ...alertDialogSlice.fields,
  ...alertSlice.fields,
  ...animationSlice.fields,
  ...aspectRatioSlice.fields,
  ...avatarSlice.fields,
  ...badgeSlice.fields,
  ...breadcrumbSlice.fields,
  ...buttonGroupSlice.fields,
  ...buttonSlice.fields,
  ...calendarSlice.fields,
  ...cardSlice.fields,
  ...checkboxSlice.fields,
  ...collapsibleSlice.fields,
  ...comboboxSlice.fields,
  ...commandSlice.fields,
  ...contextMenuSlice.fields,
  ...dataTableSlice.fields,
  ...datePickerSlice.fields,
  ...dialogSlice.fields,
  ...directionSlice.fields,
  ...disclosureSlice.fields,
  ...dragAndDropSlice.fields,
  ...drawerSlice.fields,
  ...emptySlice.fields,
  ...fieldsetSlice.fields,
  ...fileDropSlice.fields,
  ...hoverCardSlice.fields,
  ...iconsSlice.fields,
  ...inputGroupSlice.fields,
  ...inputOtpSlice.fields,
  ...inputSlice.fields,
})
export type Mdl = typeof ModelSchema.Type
void (0 as unknown as Mdl)
