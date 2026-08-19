import { Switch as FoldkitSwitch } from '@foldkit/ui'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'

export const switchClass =
  'peer group/switch inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-input shadow-xs transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-primary dark:bg-input/80'

export const switchThumbClass =
  'pointer-events-none block size-4 rounded-full bg-background ring-0 transition-transform group-data-[checked]/switch:translate-x-4 group-data-[unchecked]/switch:translate-x-0 dark:group-data-[checked]/switch:bg-primary-foreground dark:group-data-[unchecked]/switch:bg-foreground'

export const switchLabelClass =
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'

export const switchDescriptionClass = 'text-sm text-muted-foreground'

export const switchWrapperClass = 'flex items-center gap-3'

export const switchTextWrapperClass = 'flex flex-col gap-1'

export type SwitchConfig<M> = Readonly<{
  id: string
  isChecked: boolean
  onToggle: (isChecked: boolean) => M
  label: string
  maybeDescription?: string
  isDisabled?: boolean
  isReadOnly?: boolean
  name?: string
  value?: string
  className?: string
  thumbClass?: string
  labelClass?: string
  descriptionClass?: string
  wrapperClass?: string
}>

/** Styled switch with label and optional description, built on the
 *  @foldkit/ui Switch helper. */
export const switch_ = <M>(config: SwitchConfig<M>, h: HtmlBuilder<M>): Html =>
  FoldkitSwitch.view<M>(
    {
      id: config.id,
      isChecked: config.isChecked,
      onToggle: config.onToggle,
      isDisabled: config.isDisabled,
      isReadOnly: config.isReadOnly,
      name: config.name,
      value: config.value,
      toView: (attributes) =>
        h.div(
          [h.Class(cn(switchWrapperClass, config.wrapperClass))],
          [
            h.button(
              [...attributes.button, h.Class(cn(switchClass, config.className))],
              [
                h.span([
                  h.Class(
                    cn(
                      switchThumbClass,
                      config.thumbClass,
                    ),
                  ),
                ]),
              ],
            ),
            h.div(
              [h.Class(switchTextWrapperClass)],
              [
                h.label(
                  [...attributes.label, h.Class(cn(switchLabelClass, config.labelClass))],
                  [config.label],
                ),
                config.maybeDescription === undefined
                  ? h.empty
                  : h.p(
                      [
                        ...attributes.description,
                        h.Class(cn(switchDescriptionClass, config.descriptionClass)),
                      ],
                      [config.maybeDescription],
                    ),
              ],
            ),
          ],
        ),
    },
    h,
  )
