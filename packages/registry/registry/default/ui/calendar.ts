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

// Derived from the shadcn v4 BASE registry:
// apps/v4/registry/bases/base/ui/calendar.tsx. Class strings are identical
// to upstream; visual tokens live in the style item's `cn-*` layer
// (--cell-size / --cell-radius come from the cn-calendar token).
//
// foldcn gaps vs upstream: Days/Months/Years drill navigation instead of
// dropdown captions, single-date selection only (no ranges/week numbers),
// and state hooks ride on the cell's group data attrs (data-today/
// data-selected/data-focused/data-outside-month/data-disabled) rather than
// react-day-picker modifiers.

/** Upstream root + months strings combined (foldcn renders one container). */
export const calendarContainerClass =
  'cn-calendar group/calendar relative flex w-fit flex-col gap-4 bg-background select-none in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent'

/** Upstream nav + month_caption anatomy (foldcn keeps the header in flow). */
export const calendarHeaderClass =
  'flex h-(--cell-size) w-full items-center justify-between gap-1 px-(--cell-size)'

export const calendarHeadingButtonClass =
  'cn-calendar-caption-label flex cursor-pointer items-center gap-1 rounded-(--cell-radius) text-sm font-medium select-none [&>svg]:size-3.5 [&>svg]:text-muted-foreground'

export const calendarHeadingTextClass = 'cn-calendar-caption text-sm font-medium select-none'

/** Upstream nav button: Button ghost icon at cell size. */
export const calendarNavButtonClass =
  'cn-button cn-button-variant-ghost cn-button-size-icon size-(--cell-size) cursor-pointer p-0 select-none aria-disabled:opacity-50 [&>svg]:rtl:rotate-180'

export const calendarGridClass = 'flex w-full flex-col outline-none'

/** Upstream week string. */
export const calendarRowClass = 'mt-2 flex w-full'

/** Upstream weekday string. */
export const calendarColumnHeaderClass =
  'flex-1 rounded-(--cell-radius) py-1 text-center text-[0.8rem] font-normal text-muted-foreground select-none'

/** Upstream day-cell string. */
export const calendarCellClass =
  'group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none'

/** Upstream DayButton string (ghost icon button base) plus foldcn's
 *  group-scoped state hooks. */
export const calendarDayButtonClass =
  'cn-button cn-button-variant-ghost cn-button-size-icon cn-calendar-day-button relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 group-data-[selected]:rounded-(--cell-radius) group-data-[selected]:bg-primary group-data-[selected]:text-primary-foreground group-data-[today]:bg-muted group-data-[today]:text-foreground group-data-[outside-month]:text-muted-foreground group-data-[disabled]:pointer-events-none group-data-[disabled]:opacity-50 dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70'

export const calendarMonthYearGridClass = 'grid flex-1 grid-cols-3 grid-rows-4 gap-1 outline-none'

export const calendarMonthYearButtonClass =
  'flex h-full w-full cursor-pointer items-center justify-center rounded-(--cell-radius) text-sm tabular-nums transition-colors hover:bg-accent hover:text-accent-foreground group-data-[today]:bg-muted group-data-[today]:text-foreground group-data-[selected]:bg-primary group-data-[selected]:text-primary-foreground group-data-[selected]:hover:bg-primary group-data-[focused]:border-ring group-data-[focused]:ring-[3px] group-data-[focused]:ring-ring/50 group-data-[disabled]:pointer-events-none group-data-[disabled]:opacity-40'

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
