import { Switch as FoldkitSwitch } from "@foldkit/ui"
import type { Html, HtmlBuilder } from "foldkit/html"

import { cn } from "@/lib/utils"

export const switchClass =
  "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-primary"

export const switchThumbClass =
  "pointer-events-none block size-4 rounded-full bg-background shadow-lg ring-0 transition-transform"

const switchThumbOn = "translate-x-4"
const switchThumbOff = "translate-x-0"

export const switchLabelClass =
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"

export const switchDescriptionClass = "text-sm text-muted-foreground"

export const switchWrapperClass = "flex items-center gap-3"

export const switchTextWrapperClass = "flex flex-col gap-1"

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
      toView: attributes =>
        h.div(
          [h.Class(cn(switchWrapperClass, config.wrapperClass))],
          [
            h.button(
              [...attributes.button, h.Class(cn(switchClass, config.className))],
              [
                h.span(
                  [
                    h.Class(
                      cn(
                        switchThumbClass,
                        config.isChecked ? switchThumbOn : switchThumbOff,
                        config.thumbClass,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            h.div(
              [h.Class(switchTextWrapperClass)],
              [
                h.label(
                  [
                    ...attributes.label,
                    h.Class(cn(switchLabelClass, config.labelClass)),
                  ],
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
