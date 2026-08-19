import { Select as FoldkitSelect } from "@foldkit/ui"
import type { Html, HtmlBuilder } from "foldkit/html"

type Child = Html | string

import { chevronDownIcon } from "@/lib/icons"
import { cn } from "@/lib/utils"

export const selectClass =
  "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"

export const selectTriggerClass =
  "flex h-10 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"

export const selectLabelClass =
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"

export const selectDescriptionClass = "text-sm text-muted-foreground"

export const selectWrapperClass = "flex flex-col gap-1.5 w-full"

export type SelectConfig<M> = Readonly<{
  id: string
  label: string
  maybeDescription?: string
  onChange?: (value: string) => M
  value?: string
  isDisabled?: boolean
  isInvalid?: boolean
  isAutofocus?: boolean
  name?: string
  className?: string
  labelClass?: string
  descriptionClass?: string
  wrapperClass?: string
  options: ReadonlyArray<Child>
}>

/** Styled native select with label, chevron and optional description, built
 *  on the @foldkit/ui Select helper. Pass `<option>` markup via `options`. */
export const select = <M>(config: SelectConfig<M>, h: HtmlBuilder<M>): Html =>
  FoldkitSelect.view<M>(
    {
      id: config.id,
      onChange: config.onChange,
      value: config.value,
      isDisabled: config.isDisabled,
      isInvalid: config.isInvalid,
      isAutofocus: config.isAutofocus,
      name: config.name,
      toView: attributes =>
        h.div(
          [h.Class(cn(selectWrapperClass, config.wrapperClass))],
          [
            h.label(
              [...attributes.label, h.Class(cn(selectLabelClass, config.labelClass))],
              [config.label],
            ),
            h.div([h.Class("relative w-full")], [
              h.select(
                [...attributes.select, h.Class(cn(selectClass, config.className))],
                config.options,
              ),
              h.span(
                [
                  h.Class(
                    "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground",
                  ),
                ],
                [chevronDownIcon(h, "size-4")],
              ),
            ]),
            config.maybeDescription === undefined
              ? h.empty
              : h.span(
                  [
                    ...attributes.description,
                    h.Class(cn(selectDescriptionClass, config.descriptionClass)),
                  ],
                  [config.maybeDescription],
                ),
          ],
        ),
    },
    h,
  )
