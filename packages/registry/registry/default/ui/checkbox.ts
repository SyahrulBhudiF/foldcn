import { Checkbox as FoldkitCheckbox } from '@foldkit/ui'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { icon } from '@/lib/icons'
import { Check, Minus } from 'lucide'
import { cn } from '@/lib/utils'

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
export const checkbox = <M>(config: CheckboxConfig<M>, h: HtmlBuilder<M>): Html =>
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
      toView: (attributes) =>
        h.div(
          [h.Class(cn('flex flex-col gap-1', config.wrapperClass))],
          [
            h.div(
              [h.Class('flex items-center gap-2')],
              [
                h.button(
                  [
                    ...attributes.checkbox,
                    h.DataAttribute('slot', 'checkbox'),
                    h.Class(
                      cn(
                        'peer grid size-4 shrink-0 place-content-center rounded-[4px] border border-input shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[disabled]:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[checked]:border-primary data-[checked]:bg-primary data-[checked]:text-primary-foreground data-[indeterminate]:border-primary data-[indeterminate]:bg-primary data-[indeterminate]:text-primary-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[checked]:bg-primary dark:data-[indeterminate]:bg-primary',
                        config.className,
                      ),
                    ),
                  ],
                  config.isChecked || config.isIndeterminate === true
                    ? [
                        h.span(
                          [
                            h.DataAttribute('slot', 'checkbox-indicator'),
                            h.Class('grid place-content-center text-current transition-none'),
                          ],
                          [
                            icon(
                              h,
                              config.isIndeterminate === true ? Minus : Check,
                              'size-3.5',
                            ),
                          ],
                        ),
                      ]
                    : [],
                ),
                ...(attributes.hiddenInput.length > 0 ? [h.input([...attributes.hiddenInput])] : []),
                h.label(
                  [
                    ...attributes.label,
                    h.Class(
                      cn(
                        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 peer-aria-disabled:cursor-not-allowed peer-aria-disabled:opacity-70 peer-data-[disabled]:opacity-70',
                        config.labelClass,
                      ),
                    ),
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
                    h.Class(cn('text-sm text-muted-foreground', config.descriptionClass)),
                  ],
                  [config.maybeDescription],
                ),
          ],
        ),
    },
    h,
  )
