import { Tabs as FoldkitTabs } from "@foldkit/ui"
import type { Html, HtmlBuilder } from "foldkit/html"

import { cn } from "@/lib/utils"

// Re-export the @foldkit/ui Tabs surface. Create a bundle once per tab value
// type:
//
//   export const DemoTabs = Tabs.create<"Foldkit" | "React">()

export const create = FoldkitTabs.create
export const init = FoldkitTabs.init
export const Model = FoldkitTabs.Model
export type Model = typeof Model.Type
export const Message = FoldkitTabs.Message
export type Message = typeof Message.Type
export const OutMessage = FoldkitTabs.OutMessage
export type OutMessage = typeof OutMessage.Type

export type Bundle<Value extends string = string> = FoldkitTabs.Bundle<Value>
export type InitConfig = FoldkitTabs.InitConfig
export type ViewInputs<Value extends string = string> = FoldkitTabs.ViewInputs<Value>
export type RenderInfo<Value extends string = string> = FoldkitTabs.RenderInfo<Value>

export const tabsListClass =
  "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"

export const tabsTriggerClass =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-sm"

export const tabsListVerticalClass =
  "inline-flex h-auto w-fit flex-col items-stretch justify-center rounded-md bg-muted p-1 text-muted-foreground"

export const tabsTriggerVerticalClass =
  "inline-flex items-center justify-start gap-2 whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-sm"

export const tabsContentClass =
  "mt-2 rounded-md border border-border bg-card p-6 text-card-foreground shadow-sm"

export type StyledViewInputs<M, Value extends string = string> = Readonly<{
  tabs: ReadonlyArray<Value>
  selectedValue: Value
  ariaLabel: string
  /** Renders each tab panel. Receives the tab value and the render-time
   *  attributes (tablist, tabs, activeIndex) so content can react to the
   *  active tab. */
  panel: (tab: Value, render: RenderInfo<Value>, h: HtmlBuilder<M>) => Html
  isTabDisabled?: (value: Value, index: number) => boolean
  orientation?: "Horizontal" | "Vertical"
  listClass?: string
  triggerClass?: string
  contentClass?: string
}>

/** Build styled `Tabs.ViewInputs`. Pass your view's `h` so panel content can
 *  dispatch your app's own messages. */
export const styledViewInputs = <M, Value extends string = string>(
  viewInputs: StyledViewInputs<M, Value>,
  h: HtmlBuilder<M>,
): ViewInputs<Value> => {
  const isVertical = viewInputs.orientation === "Vertical"
  return {
    tabs: viewInputs.tabs,
    selectedValue: viewInputs.selectedValue,
    ariaLabel: viewInputs.ariaLabel,
    isTabDisabled: viewInputs.isTabDisabled,
    orientation: viewInputs.orientation,
    toView: ({ tablist, tabs, activeIndex }) =>
      h.div(
        [h.Class(isVertical ? "flex w-full gap-2" : "")],
        [
          h.div(
            [
              ...tablist,
              h.Class(
                cn(
                  isVertical ? tabsListVerticalClass : tabsListClass,
                  viewInputs.listClass,
                ),
              ),
            ],
            tabs.map(tab =>
              h.button(
                [
                  ...tab.tab,
                  h.Class(
                    cn(
                      isVertical ? tabsTriggerVerticalClass : tabsTriggerClass,
                      viewInputs.triggerClass,
                    ),
                  ),
                ],
                [h.span([], [tab.value])],
              ),
            ),
          ),
          ...tabs
            .filter(tab => tab.index === activeIndex)
            .map(tab =>
              h.div(
                [...tab.panel, h.Class(cn(tabsContentClass, viewInputs.contentClass))],
                [viewInputs.panel(tab.value, { tablist, tabs, activeIndex }, h)],
              ),
            ),
        ],
      ),
  }
}
