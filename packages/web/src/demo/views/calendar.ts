import type { Html, HtmlBuilder } from 'foldkit/html'

import * as calendar from '@foldcn/registry/src/ui/calendar'
import * as datePicker from '@foldcn/registry/src/ui/date-picker'

import { GotCalendarMessage, GotDatePickerMessage, type Message } from '../message'
import type { Model } from '../model'

export const calendarView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.submodel({
    slotId: model.calendar.id,
    model: model.calendar,
    view: calendar.view,
    viewInputs: calendar.styledViewInputs({ maybeSelectedDate: model.maybeSelectedDate }, h),
    toParentMessage: (message) => GotCalendarMessage({ message }),
  })

export const datePickerView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.submodel({
    slotId: model.datePicker.id,
    model: model.datePicker,
    view: datePicker.view,
    viewInputs: datePicker.styledViewInputs({ maybeSelectedDate: model.maybePickedDate }, h),
    toParentMessage: (message) => GotDatePickerMessage({ message }),
  })
