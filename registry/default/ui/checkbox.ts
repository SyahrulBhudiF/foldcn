import { Checkbox as FoldkitCheckbox } from "@foldkit/ui"
import type { Html, HtmlBuilder } from "foldkit/html"

import { checkIcon, minusIcon } from "@/lib/icons"
import { cn } from "@/lib/utils"

export const checkboxClass =
  "flex size-4 shrink-0 items-center justify-center rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-primary data-[checked]:text-primary-foreground data-[indeterminate]:bg-primary data-[indeterminate]:text-primary-foreground"

export const checkboxLabelClass =
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"

export const checkboxDescriptionClass = "text-sm text-muted-foreground"

export const checkboxWrapperClass = "flex flex-col gap-1"

export const checkboxRowClass = "flex items-center gap-2"

export type CheckboxConfig<M> = Readonly<{
  id: string
  isChecked: boolean
  onToggle: (isChecked: boolean) => M
  label: string
  maybeDescription?: string
  isDisabled?: boolean
  isReadOnly?: boolean
  isIndeterminate?: boolean
  name?: string
  value?: string
  className?: string
  labelClass?: string
  descriptionClass?: string
  wrapperClass?: string
}>

/** Styled checkbox with label and optional description, built on the
 *  @foldkit/ui Checkbox helper. */
export const checkbox = <M>(
  config: CheckboxConfig<M>,
  h: HtmlBuilder<M>,
): Html =>
  FoldkitCheckbox.view<M>(
    {
      id: config.id,
      isChecked: config.isChecked,
      onToggle: config.onToggle,
      isDisabled: config.isDisabled,
      isReadOnly: config.isReadOnly,
      isIndeterminate: config.isIndeterminate,
      name: config.name,
      value: config.value,
      toView: attributes =>
        h.div(
          [h.Class(cn(checkboxWrapperClass, config.wrapperClass))],
          [
            h.div(
              [h.Class(checkboxRowClass)],
              [
                h.button(
                  [...attributes.checkbox, h.Class(checkboxClass)],
                  config.isIndeterminate === true
                    ? [minusIcon(h, "size-3")]
                    : config.isChecked
                      ? [checkIcon(h, "size-3")]
                      : [],
                ),
                h.label(
                  [
                    ...attributes.label,
                    h.Class(cn(checkboxLabelClass, config.labelClass)),
                  ],
                  [config.label],
                ),
              ],
            ),
            config.maybeDescription === undefined
              ? h.empty
              : h.p(
                  [
                    ...attributes.description,
                    h.Class(cn(checkboxDescriptionClass, config.descriptionClass)),
                  ],
                  [config.maybeDescription],
                ),
          ],
        ),
    },
    h,
  )
