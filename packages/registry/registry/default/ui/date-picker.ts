import { Option } from 'effect'
import { DatePicker as FoldkitDatePicker } from '@foldkit/ui'
import type { AnchorConfig } from '@foldkit/ui/anchor'
import type { CalendarDate } from 'foldkit/calendar'
import type { HtmlBuilder } from 'foldkit/html'

import { chevronDownIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { calendarToView } from '@/ui/calendar'

// Re-export the @foldkit/ui DatePicker submodel surface.

export const init = FoldkitDatePicker.init
export const update = FoldkitDatePicker.update
export const view = FoldkitDatePicker.view
export const Model = FoldkitDatePicker.Model
export type Model = typeof Model.Type
export const Message = FoldkitDatePicker.Message
export type Message = typeof Message.Type
export const OutMessage = FoldkitDatePicker.OutMessage
export type OutMessage = typeof OutMessage.Type
export const triggerId = FoldkitDatePicker.triggerId

export type InitConfig = FoldkitDatePicker.InitConfig
export type ViewInputs = FoldkitDatePicker.ViewInputs

export const datePickerTriggerClass =
  'flex h-10 min-w-48 items-center justify-between gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

export const datePickerPanelClass =
  'z-50 rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none'

export const datePickerBackdropClass = 'fixed inset-0 z-0'

export const datePickerWrapperClass = 'relative inline-block'

export const datePickerPlaceholderClass = 'text-muted-foreground'

export const DATE_PICKER_ANCHOR: AnchorConfig = {
  placement: 'bottom-start',
  gap: 4,
  padding: 8,
}

const formatTriggerLabel = (date: Readonly<{ year: number; month: number; day: number }>): string =>
  `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`

export type StyledViewInputs = Readonly<{
  maybeSelectedDate: Option.Option<CalendarDate>
  anchor?: AnchorConfig
  isDisabled?: boolean
  name?: string
  className?: string
  triggerClass?: string
  panelClass?: string
  backdropClass?: string
  wrapperClass?: string
}>

/** Build styled `DatePicker.ViewInputs`. Pass your view's `h`. The trigger
 *  face shows the ISO date or a placeholder; the popover panel renders the
 *  styled calendar grid from the calendar item. */
export const styledViewInputs = <M>(
  viewInputs: StyledViewInputs,
  h: HtmlBuilder<M>,
): ViewInputs => ({
  anchor: viewInputs.anchor ?? DATE_PICKER_ANCHOR,
  maybeSelectedDate: viewInputs.maybeSelectedDate,
  isDisabled: viewInputs.isDisabled,
  name: viewInputs.name,
  className: cn(datePickerWrapperClass, viewInputs.wrapperClass),
  triggerClassName: cn(datePickerTriggerClass, viewInputs.triggerClass),
  panelClassName: cn(datePickerPanelClass, viewInputs.panelClass),
  backdropClassName: cn(datePickerBackdropClass, viewInputs.backdropClass),
  triggerContent: (maybeDate) =>
    h.div(
      [h.Class('flex w-full items-center justify-between gap-4')],
      [
        Option.match(maybeDate, {
          onNone: () => h.span([h.Class(datePickerPlaceholderClass)], ['Pick a date']),
          onSome: (date) => h.span([], [formatTriggerLabel(date)]),
        }),
        chevronDownIcon(h),
      ],
    ),
  toCalendarView: calendarToView(h),
})
