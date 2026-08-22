import { Update } from 'foldkit'
import { Calendar as FoldkitCalendar } from 'foldkit'
import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import * as calendar from '@foldcn/registry/styles/default/ui/calendar'

import { DEMO_TODAY } from '../bundles'
import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const GotCalendarMessage = m('GotCalendarMessage', { message: calendar.Message })

export const calendarView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.submodel({
    slotId: model.calendar.id,
    model: model.calendar,
    view: calendar.view,
    viewInputs: calendar.styledViewInputs({ maybeSelectedDate: model.maybeSelectedDate }, h),
    toParentMessage: (message) => GotCalendarMessage({ message }),
  })

const foldCalendarOutMessage = M.type<calendar.OutMessage>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    SelectedDate:
      ({ date }) =>
      (model) => [evo(model, { maybeSelectedDate: () => Option.some(date) }), []],
    ChangedViewMonth: () => (model) => [model, []],
  }),
)

const foldCalendar = Update.foldChild({
  update: calendar.update,
  read: (model: State) => Option.some(model.calendar),
  write: (model, next) => evo(model, { calendar: () => next }),
  toParentMessage: (message) => GotCalendarMessage({ message }),
  foldOutMessage: foldCalendarOutMessage,
})

const fields = {
    calendar: calendar.Model,
    maybeSelectedDate: S.Option(FoldkitCalendar.CalendarDate),
  }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: {
    calendar: calendar.init({
      id: 'calendar-demo',
      today: DEMO_TODAY,
      minDate: FoldkitCalendar.subtractYears(DEMO_TODAY, 1),
      maxDate: FoldkitCalendar.addYears(DEMO_TODAY, 1),
    }),
    maybeSelectedDate: Option.none(),
  },
  messages: [GotCalendarMessage],
  handlers: (model: State) => ({
    GotCalendarMessage: (payload: typeof GotCalendarMessage.Type): UpdateReturn =>
      foldCalendar(model, payload.message),
  }),
  samples: [],
  // Date selection flows through the submodel's out-messages; the public
  // @foldkit/ui namespace exports no child-message constructors, so there
  // are no top-level samples to feed update().
})
