import { Textarea as FoldkitTextarea } from "@foldkit/ui"
import type { Html, HtmlBuilder } from "foldkit/html"

import { cn } from "@/lib/utils"

export const textareaClass =
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

export const textareaLabelClass =
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"

export const textareaDescriptionClass = "text-sm text-muted-foreground"

export const textareaWrapperClass = "flex flex-col gap-1.5 w-full"

export type TextareaConfig<M> = Readonly<{
  id: string
  label: string
  maybeDescription?: string
  onInput?: (value: string) => M
  value?: string
  isDisabled?: boolean
  isReadOnly?: boolean
  isInvalid?: boolean
  isAutofocus?: boolean
  name?: string
  rows?: number
  placeholder?: string
  className?: string
  labelClass?: string
  descriptionClass?: string
  wrapperClass?: string
}>

/** Styled textarea with label and optional description, built on the
 *  @foldkit/ui Textarea helper. */
export const textarea = <M>(
  config: TextareaConfig<M>,
  h: HtmlBuilder<M>,
): Html =>
  FoldkitTextarea.view<M>(
    {
      id: config.id,
      onInput: config.onInput,
      value: config.value,
      isDisabled: config.isDisabled,
      isReadOnly: config.isReadOnly,
      isInvalid: config.isInvalid,
      isAutofocus: config.isAutofocus,
      name: config.name,
      rows: config.rows,
      placeholder: config.placeholder,
      toView: attributes =>
        h.div(
          [h.Class(cn(textareaWrapperClass, config.wrapperClass))],
          [
            h.label(
              [
                ...attributes.label,
                h.Class(cn(textareaLabelClass, config.labelClass)),
              ],
              [config.label],
            ),
            h.textarea([
              ...attributes.textarea,
              h.Class(cn(textareaClass, config.className)),
            ]),
            config.maybeDescription === undefined
              ? h.empty
              : h.span(
                  [
                    ...attributes.description,
                    h.Class(cn(textareaDescriptionClass, config.descriptionClass)),
                  ],
                  [config.maybeDescription],
                ),
          ],
        ),
    },
    h,
  )
