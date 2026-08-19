import { Input as FoldkitInput } from "@foldkit/ui"
import type { Html, HtmlBuilder } from "foldkit/html"

import { cn } from "@/lib/utils"

export const inputClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

export const inputLabelClass =
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"

export const inputDescriptionClass = "text-sm text-muted-foreground"

export const inputWrapperClass = "flex flex-col gap-1.5 w-full"

export type InputConfig<M> = Readonly<{
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
  type?: string
  placeholder?: string
  className?: string
  labelClass?: string
  descriptionClass?: string
  wrapperClass?: string
}>

/** Styled text input with label and optional description, built on the
 *  @foldkit/ui Input helper. */
export const input = <M>(config: InputConfig<M>, h: HtmlBuilder<M>): Html =>
  FoldkitInput.view<M>(
    {
      id: config.id,
      onInput: config.onInput,
      value: config.value,
      isDisabled: config.isDisabled,
      isReadOnly: config.isReadOnly,
      isInvalid: config.isInvalid,
      isAutofocus: config.isAutofocus,
      name: config.name,
      type: config.type,
      placeholder: config.placeholder,
      toView: attributes =>
        h.div(
          [h.Class(cn(inputWrapperClass, config.wrapperClass))],
          [
            h.label(
              [...attributes.label, h.Class(cn(inputLabelClass, config.labelClass))],
              [config.label],
            ),
            h.input([
              ...attributes.input,
              h.Class(cn(inputClass, config.className)),
            ]),
            config.maybeDescription === undefined
              ? h.empty
              : h.span(
                  [
                    ...attributes.description,
                    h.Class(cn(inputDescriptionClass, config.descriptionClass)),
                  ],
                  [config.maybeDescription],
                ),
          ],
        ),
    },
    h,
  )
