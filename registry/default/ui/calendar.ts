import { Match as M, Option } from "effect"
import { Calendar as FoldkitCalendar } from "@foldkit/ui"
import type { ChildAttribute, Html, HtmlBuilder } from "foldkit/html"

import { chevronDownIcon, chevronLeftIcon, chevronRightIcon } from "@/lib/icons"
import { cn } from "@/lib/utils"

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
  "inline-flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm select-none min-w-[304px] min-h-[324px]"

export const calendarHeaderClass = "flex items-center justify-between gap-2"

export const calendarHeadingButtonClass =
  "inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold tabular-nums transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"

export const calendarHeadingTextClass = "text-sm font-semibold tabular-nums"

export const calendarNavButtonClass =
  "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"

export const calendarGridClass = "flex flex-col gap-1 outline-none"

export const calendarRowClass = "grid grid-cols-7 gap-1"

export const calendarColumnHeaderClass =
  "py-1 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground"

export const calendarCellClass = "group flex items-center justify-center"

export const calendarDayButtonClass =
  "flex size-9 items-center justify-center rounded-full text-sm tabular-nums transition-colors cursor-pointer hover:bg-accent hover:text-accent-foreground group-data-[today]:ring-1 group-data-[today]:ring-ring group-data-[selected]:bg-primary group-data-[selected]:text-primary-foreground group-data-[selected]:hover:bg-primary group-data-[focused]:outline-2 group-data-[focused]:outline-offset-2 group-data-[focused]:outline-ring group-data-[outside-month]:text-muted-foreground group-data-[disabled]:pointer-events-none group-data-[disabled]:opacity-40"

export const calendarMonthYearGridClass =
  "grid flex-1 grid-cols-3 grid-rows-4 gap-1 outline-none"

export const calendarMonthYearButtonClass =
  "flex h-full w-full items-center justify-center rounded-md text-sm tabular-nums transition-colors cursor-pointer hover:bg-accent hover:text-accent-foreground group-data-[today]:ring-1 group-data-[today]:ring-ring group-data-[selected]:bg-primary group-data-[selected]:text-primary-foreground group-data-[selected]:hover:bg-primary group-data-[focused]:outline-2 group-data-[focused]:outline-offset-2 group-data-[focused]:outline-ring group-data-[disabled]:pointer-events-none group-data-[disabled]:opacity-40"

const navButton = <M>(
  attributes: ReadonlyArray<ChildAttribute>,
  icon: Html,
  h: HtmlBuilder<M>,
): Html =>
  h.button([...attributes, h.Class(calendarNavButtonClass)], [icon])

const headingButton = <M>(
  heading: DaysModeAttributes["heading"],
  attributes: ReadonlyArray<ChildAttribute>,
  h: HtmlBuilder<M>,
): Html =>
  h.button(
    [h.Id(heading.id), ...attributes, h.Class(calendarHeadingButtonClass)],
    [heading.text, chevronDownIcon(h, "size-3")],
  )

const weekRow = <M>(
  week: Week,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [...week.attributes, h.Class(calendarRowClass)],
    week.cells.map(cell =>
      h.div(
        [...cell.cellAttributes, h.Class(calendarCellClass)],
        [
          h.button(
            [...cell.buttonAttributes, h.Class(calendarDayButtonClass)],
            [cell.label],
          ),
        ],
      ),
    ),
  )

const daysView = <M>(
  days: DaysModeAttributes,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [...days.root, h.Class(calendarContainerClass)],
    [
      h.div(
        [h.Class(calendarHeaderClass)],
        [
          navButton(days.previousMonthButton, chevronLeftIcon(h, "size-5"), h),
          headingButton(days.heading, days.headingButton, h),
          navButton(days.nextMonthButton, chevronRightIcon(h, "size-5"), h),
        ],
      ),
      h.div(
        [...days.grid, h.Class(calendarGridClass)],
        [
          h.div(
            [...days.headerRow, h.Class(calendarRowClass)],
            days.columnHeaders.map(header =>
              h.div(
                [...header.attributes, h.Class(calendarColumnHeaderClass)],
                [header.name],
              ),
            ),
          ),
          ...days.weeks.map(week => weekRow(week, h)),
        ],
      ),
    ],
  )

const monthsView = <M>(
  months: MonthsModeAttributes,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [...months.root, h.Class(calendarContainerClass)],
    [
      h.div(
        [h.Class(`${calendarHeaderClass} justify-center`)],
        [headingButton(months.heading, months.headingButton, h)],
      ),
      h.div(
        [...months.grid, h.Class(calendarMonthYearGridClass)],
        months.cells.map(cell =>
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
): Html =>
  h.div(
    [...years.root, h.Class(calendarContainerClass)],
    [
      h.div(
        [h.Class(calendarHeaderClass)],
        [
          navButton(years.previousPageButton, chevronLeftIcon(h, "size-5"), h),
          h.h2(
            [h.Id(years.heading.id), h.Class(calendarHeadingTextClass)],
            [years.heading.text],
          ),
          navButton(years.nextPageButton, chevronRightIcon(h, "size-5"), h),
        ],
      ),
      h.div(
        [...years.grid, h.Class(calendarMonthYearGridClass)],
        years.cells.map(cell =>
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

export type StyledViewInputs = Readonly<{
  maybeSelectedDate: Option.Option<import("foldkit/calendar").CalendarDate>
  containerClass?: string
}>

/** Styled calendar `toView` callback for the Days/Months/Years modes. Shared
 *  with the date picker's popover panel. */
export const calendarToView = <M>(
  h: HtmlBuilder<M>,
): ((attributes: CalendarAttributes) => Html) =>
  M.type<CalendarAttributes>().pipe(
    M.tagsExhaustive({
      Days: days => daysView(days, h),
      Months: months => monthsView(months, h),
      Years: years => yearsView(years, h),
    }),
  )

/** Build styled `Calendar.ViewInputs`. Pass your view's `h`. */
export const styledViewInputs = <M>(
  viewInputs: StyledViewInputs,
  h: HtmlBuilder<M>,
): ViewInputs => ({
  maybeSelectedDate: viewInputs.maybeSelectedDate,
  toView: calendarToView(h),
})
