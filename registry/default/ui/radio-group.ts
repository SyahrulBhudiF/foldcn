import { RadioGroup as FoldkitRadioGroup } from "@foldkit/ui"
import type { Html, HtmlBuilder } from "foldkit/html"

import { cn } from "@/lib/utils"

// Re-export the @foldkit/ui RadioGroup surface. Create a bundle once per
// option type:
//
//   export const PlanRadioGroup = RadioGroup.create<"Startup" | "Business">()

export const create = FoldkitRadioGroup.create
export const init = FoldkitRadioGroup.init
export const Model = FoldkitRadioGroup.Model
export type Model = typeof Model.Type
export const Message = FoldkitRadioGroup.Message
export type Message = typeof Message.Type
export const OutMessage = FoldkitRadioGroup.OutMessage
export type OutMessage = typeof OutMessage.Type

export type Bundle<Value extends string = string> = FoldkitRadioGroup.Bundle<Value>
export type InitConfig = FoldkitRadioGroup.InitConfig
export type ViewInputs<Value extends string = string> =
  FoldkitRadioGroup.ViewInputs<Value>
export type RenderInfo<Value extends string = string> =
  FoldkitRadioGroup.RenderInfo<Value>

export const radioGroupClass =
  "grid gap-2"

export const radioGroupVerticalClass = "flex flex-col gap-3 w-full"

export const radioGroupHorizontalClass = "flex flex-col gap-3 sm:flex-row w-full"

export const radioOptionClass =
  "relative flex cursor-pointer select-none items-center justify-between rounded-md border border-border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground data-[checked]:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

export const radioOptionLabelClass = "text-sm font-medium"

export const radioOptionDescriptionClass = "text-sm text-muted-foreground"

export const radioIndicatorClass =
  "flex size-5 shrink-0 items-center justify-center rounded-full border border-primary"

export const radioDotClass =
  "size-2.5 rounded-full bg-primary data-[checked]:bg-primary data-[unchecked]:bg-transparent"

export type StyledViewInputs<M, Value extends string = string> = Readonly<{
  options: ReadonlyArray<Value>
  selectedValue: import("effect/Option").Option<Value>
  ariaLabel: string
  /** Renders each option row. Receives the option value, its per-option
   *  render info (`isSelected`, attribute bundles) and the full render. */
  option: (
    value: Value,
    info: FoldkitRadioGroup.OptionInfo<Value>,
    render: RenderInfo<Value>,
    h: HtmlBuilder<M>,
  ) => Html
  orientation?: "Horizontal" | "Vertical"
  isOptionDisabled?: (value: Value, index: number) => boolean
  isDisabled?: boolean
  isReadOnly?: boolean
  name?: string
  groupClass?: string
  optionClass?: string
}>

/** Build styled `RadioGroup.ViewInputs`. Pass your view's `h`. */
export const styledViewInputs = <M, Value extends string = string>(
  viewInputs: StyledViewInputs<M, Value>,
  h: HtmlBuilder<M>,
): ViewInputs<Value> => {
  const isHorizontal = viewInputs.orientation === "Horizontal"
  return {
    options: viewInputs.options,
    selectedValue: viewInputs.selectedValue,
    ariaLabel: viewInputs.ariaLabel,
    orientation: viewInputs.orientation,
    isOptionDisabled: viewInputs.isOptionDisabled,
    isDisabled: viewInputs.isDisabled,
    isReadOnly: viewInputs.isReadOnly,
    name: viewInputs.name,
    toView: render => {
      const { group, options } = render
      return h.div(
        [
          ...group,
          h.Class(
            cn(
              isHorizontal ? radioGroupHorizontalClass : radioGroupVerticalClass,
              viewInputs.groupClass,
            ),
          ),
        ],
        options.map(option =>
          h.div(
            [...option.option, h.Class(cn(radioOptionClass, viewInputs.optionClass))],
            [viewInputs.option(option.value, option, render, h)],
          ),
        ),
      )
    },
  }
}
