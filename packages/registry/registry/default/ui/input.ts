import { Input as FoldkitInput } from '@foldkit/ui'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'

export const inputClass =
  'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40'

export const inputLabelClass =
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'

export const inputDescriptionClass = 'text-sm text-muted-foreground'

export const inputWrapperClass = 'flex flex-col gap-1.5 w-full'

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
      toView: (attributes) =>
        h.div(
          [h.Class(cn(inputWrapperClass, config.wrapperClass))],
          [
            h.label(
              [...attributes.label, h.Class(cn(inputLabelClass, config.labelClass))],
              [config.label],
            ),
            h.input([...attributes.input, h.Class(cn(inputClass, config.className))]),
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
