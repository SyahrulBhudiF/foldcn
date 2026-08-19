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
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none"

export const tabsTriggerClass =
  "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100 group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent"

export const tabsListVerticalClass =
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none"

export const tabsTriggerVerticalClass =
  "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100"

export const tabsContentClass =
  "flex-1 outline-none"

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
