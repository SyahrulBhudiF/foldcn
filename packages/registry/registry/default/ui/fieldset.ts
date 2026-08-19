import { Fieldset as FoldkitFieldset } from "@foldkit/ui"
import type { Html, HtmlBuilder } from "foldkit/html"

type Child = Html | string

import { cn } from "@/lib/utils"

export const fieldsetClass =
  "grid gap-6 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm"

export const fieldsetLegendClass = "text-base font-semibold"

export const fieldsetDescriptionClass = "text-sm text-muted-foreground"

export const fieldsetContentClass = "grid gap-4"

export type FieldsetConfig<M> = Readonly<{
  id: string
  legend: string
  maybeDescription?: string
  isDisabled?: boolean
  className?: string
  legendClass?: string
  descriptionClass?: string
  contentClass?: string
  children: ReadonlyArray<Child>
}>

/** Styled fieldset with legend, optional description and child controls,
 *  built on the @foldkit/ui Fieldset helper. */
export const fieldset = <M>(
  config: FieldsetConfig<M>,
  h: HtmlBuilder<M>,
): Html =>
  FoldkitFieldset.view<M>(
    {
      id: config.id,
      isDisabled: config.isDisabled,
      toView: attributes =>
        h.fieldset(
          [...attributes.fieldset, h.Class(cn(fieldsetClass, config.className))],
          [
            h.legend(
              [
                ...attributes.legend,
                h.Class(cn(fieldsetLegendClass, config.legendClass)),
              ],
              [config.legend],
            ),
            config.maybeDescription === undefined
              ? h.empty
              : h.p(
                  [
                    ...attributes.description,
                    h.Class(cn(fieldsetDescriptionClass, config.descriptionClass)),
                  ],
                  [config.maybeDescription],
                ),
            h.div([h.Class(cn(fieldsetContentClass, config.contentClass))], config.children),
          ],
        ),
    },
    h,
  )
