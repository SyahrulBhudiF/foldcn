import { Match as M, Option } from 'effect'
import { Calendar as FoldkitCalendar } from '@foldkit/ui'
import type { CalendarDate } from 'foldkit/calendar'
import type { ChildAttribute, Html, HtmlBuilder } from 'foldkit/html'

import { icon } from '@/lib/icons'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide'
import { cn } from '@/lib/utils'

// Re-export the @foldkit/ui Calendar submodel surface.

export const init = FoldkitCalendar.init
export const update = FoldkitCalendar.update
export const view = FoldkitCalendar.view
export const Model = FoldkitCalendar.Model
export type Model = typeof Model.Type
export const Message = FoldkitCalendar.Message
export type Message = typeof Message.Type
export const OutMessage = FoldkitCalendar.OutMessage
export type OutMessage = typeof OutMessage.Type

export type InitConfig = FoldkitCalendar.InitConfig
export type ViewInputs = FoldkitCalendar.ViewInputs
export type CalendarAttributes = FoldkitCalendar.CalendarAttributes
export type DaysModeAttributes = FoldkitCalendar.DaysModeAttributes
export type MonthsModeAttributes = FoldkitCalendar.MonthsModeAttributes
export type YearsModeAttributes = FoldkitCalendar.YearsModeAttributes
export type Week = FoldkitCalendar.Week

export const calendarContainerClass =
  'cn-calendar group/calendar inline-flex flex-col gap-3 rounded-xl border border-border bg-background p-4 text-foreground shadow-sm select-none min-w-[304px] min-h-[324px] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent'

export const calendarHeaderClass = 'flex items-center justify-between gap-2'

export const calendarHeadingButtonClass =
  'inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold tabular-nums transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer'

export const calendarHeadingTextClass = 'text-sm font-semibold tabular-nums'

export const calendarNavButtonClass =
  'inline-flex size-8 select-none items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer [&>svg]:rtl:rotate-180'

export const calendarGridClass = 'flex flex-col gap-1 outline-none'

export const calendarRowClass = 'grid grid-cols-7 gap-1'

export const calendarColumnHeaderClass =
  'py-1 text-center text-[0.8rem] font-normal text-muted-foreground select-none'

export const calendarCellClass = 'group flex items-center justify-center'

export const calendarDayButtonClass =
  'flex size-9 select-none items-center justify-center rounded-full text-sm tabular-nums transition-colors cursor-pointer hover:bg-accent hover:text-accent-foreground group-data-[today]:ring-1 group-data-[today]:ring-ring group-data-[selected]:bg-primary group-data-[selected]:text-primary-foreground group-data-[selected]:hover:bg-primary group-data-[focused]:outline-2 group-data-[focused]:outline-offset-2 group-data-[focused]:outline-ring group-data-[outside-month]:text-muted-foreground group-data-[disabled]:pointer-events-none group-data-[disabled]:opacity-50'

export const calendarMonthYearGridClass = 'grid flex-1 grid-cols-3 grid-rows-4 gap-1 outline-none'

export const calendarMonthYearButtonClass =
  'flex h-full w-full items-center justify-center rounded-md text-sm tabular-nums transition-colors cursor-pointer hover:bg-accent hover:text-accent-foreground group-data-[today]:ring-1 group-data-[today]:ring-ring group-data-[selected]:bg-primary group-data-[selected]:text-primary-foreground group-data-[selected]:hover:bg-primary group-data-[focused]:outline-2 group-data-[focused]:outline-offset-2 group-data-[focused]:outline-ring group-data-[disabled]:pointer-events-none group-data-[disabled]:opacity-40'

const navButton = <M>(
  attributes: ReadonlyArray<ChildAttribute>,
  icon: Html,
  h: HtmlBuilder<M>,
): Html => h.button([...attributes, h.Class(calendarNavButtonClass)], [icon])

const headingButton = <M>(
  heading: DaysModeAttributes['heading'],
  attributes: ReadonlyArray<ChildAttribute>,
  h: HtmlBuilder<M>,
): Html =>
  h.button(
    [h.Id(heading.id), ...attributes, h.Class(calendarHeadingButtonClass)],
    [heading.text, icon(h, ChevronDown, 'size-3')],
  )

const weekRow = <M>(
  week: Week,
  showOutsideDays: boolean,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [...week.attributes, h.Class(calendarRowClass)],
    week.cells.map((cell) =>
      h.div(
        [...cell.cellAttributes, h.Class(calendarCellClass)],
        [
          h.button(
            [
              ...cell.buttonAttributes,
              h.Class(
                showOutsideDays || cell.isInViewMonth
                  ? calendarDayButtonClass
                  : cn(calendarDayButtonClass, 'invisible pointer-events-none'),
              ),
            ],
            [cell.label],
          ),
        ],
      ),
    ),
  )

const daysView = <M>(
  days: DaysModeAttributes,
  h: HtmlBuilder<M>,
  options: CalendarViewOptions | undefined,
): Html =>
  h.div(
    [
      h.DataAttribute('slot', 'calendar'),
      ...days.root,
      h.Class(cn(calendarContainerClass, options?.containerClass)),
    ],
    [
      h.div(
        [h.Class(calendarHeaderClass)],
        [
          navButton(days.previousMonthButton, icon(h, ChevronLeft, 'size-5'), h),
          headingButton(days.heading, days.headingButton, h),
          navButton(days.nextMonthButton, icon(h, ChevronRight, 'size-5'), h),
        ],
      ),
      h.div(
        [...days.grid, h.Class(calendarGridClass)],
        [
          h.div(
            [...days.headerRow, h.Class(calendarRowClass)],
            days.columnHeaders.map((header) =>
              h.div([...header.attributes, h.Class(calendarColumnHeaderClass)], [header.name]),
            ),
          ),
          ...days.weeks.map((week) => weekRow(week, options?.showOutsideDays ?? true, h)),
        ],
      ),
    ],
  )

const monthsView = <M>(
  months: MonthsModeAttributes,
  h: HtmlBuilder<M>,
  options: CalendarViewOptions | undefined,
): Html =>
  h.div(
    [
      h.DataAttribute('slot', 'calendar'),
      ...months.root,
      h.Class(cn(calendarContainerClass, options?.containerClass)),
    ],
    [
      h.div(
        [h.Class(`${calendarHeaderClass} justify-center`)],
        [headingButton(months.heading, months.headingButton, h)],
      ),
      h.div(
        [...months.grid, h.Class(calendarMonthYearGridClass)],
        months.cells.map((cell) =>
          h.div(
            [...cell.cellAttributes, h.Class(calendarCellClass)],
            [
              h.button(
                [...cell.buttonAttributes, h.Class(calendarMonthYearButtonClass)],
                [cell.shortLabel],
              ),
            ],
          ),
        ),
      ),
    ],
  )

const yearsView = <M>(
  years: YearsModeAttributes,
  h: HtmlBuilder<M>,
  options: CalendarViewOptions | undefined,
): Html =>
  h.div(
    [
      h.DataAttribute('slot', 'calendar'),
      ...years.root,
      h.Class(cn(calendarContainerClass, options?.containerClass)),
    ],
    [
      h.div(
        [h.Class(calendarHeaderClass)],
        [
          navButton(years.previousPageButton, icon(h, ChevronLeft, 'size-5'), h),
          h.h2([h.Id(years.heading.id), h.Class(calendarHeadingTextClass)], [years.heading.text]),
          navButton(years.nextPageButton, icon(h, ChevronRight, 'size-5'), h),
        ],
      ),
      h.div(
        [...years.grid, h.Class(calendarMonthYearGridClass)],
        years.cells.map((cell) =>
          h.div(
            [...cell.cellAttributes, h.Class(calendarCellClass)],
            [
              h.button(
                [...cell.buttonAttributes, h.Class(calendarMonthYearButtonClass)],
                [cell.label],
              ),
            ],
          ),
        ),
      ),
    ],
  )

export type CalendarViewOptions = Readonly<{
  containerClass?: string
  showOutsideDays?: boolean
}>

export type StyledViewInputs = Readonly<{
  maybeSelectedDate: Option.Option<CalendarDate>
  containerClass?: string
  showOutsideDays?: boolean
}>

/** Styled calendar `toView` callback for the Days/Months/Years modes. Shared
 *  with the date picker's popover panel. */
export const calendarToView = <M>(
  h: HtmlBuilder<M>,
  options?: CalendarViewOptions,
): ((attributes: CalendarAttributes) => Html) =>
  M.type<CalendarAttributes>().pipe(
    M.tagsExhaustive({
      Days: (days) => daysView(days, h, options),
      Months: (months) => monthsView(months, h, options),
      Years: (years) => yearsView(years, h, options),
    }),
  )

/** Build styled `Calendar.ViewInputs`. Pass your view's `h`. */
export const styledViewInputs = <M>(
  viewInputs: StyledViewInputs,
  h: HtmlBuilder<M>,
): ViewInputs => ({
  maybeSelectedDate: viewInputs.maybeSelectedDate,
  toView: calendarToView(h, {
    containerClass: viewInputs.containerClass,
    showOutsideDays: viewInputs.showOutsideDays ?? true,
  }),
})
