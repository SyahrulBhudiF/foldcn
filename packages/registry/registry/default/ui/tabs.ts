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

// --- Variant system (mirrors shadcn-ui cva pattern) ---

export type TabsListVariant = "default" | "line"

const tabsListBaseClass =
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none"

const tabsListVariantClasses: Record<TabsListVariant, string> = {
  default: "bg-muted",
  line: "gap-1 bg-transparent",
}

export const tabsListClass = (variant: TabsListVariant = "default") =>
  cn(tabsListBaseClass, tabsListVariantClasses[variant])

export const tabsTriggerClass = cn(
  "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[selected]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[selected]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[selected]:bg-transparent",
  "data-[selected]:bg-background data-[selected]:text-foreground dark:data-[selected]:border-input dark:data-[selected]:bg-input/30 dark:data-[selected]:text-foreground",
  "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[selected]:after:opacity-100",
  "group-data-[variant=default]/tabs-list:data-[selected]:shadow-sm group-data-[variant=line]/tabs-list:data-[selected]:shadow-none",
)

export const tabsContentClass = "flex-1 outline-none"

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
  variant?: TabsListVariant
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
  const variant = viewInputs.variant ?? "default"
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
              h.Attribute("data-variant", variant),
              h.Class(cn(tabsListClass(variant), viewInputs.listClass)),
            ],
            tabs.map(tab =>
              h.button(
                [
                  ...tab.tab,
                  h.Class(cn(tabsTriggerClass, viewInputs.triggerClass)),
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
