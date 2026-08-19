import { VirtualList as FoldkitVirtualList } from '@foldkit/ui'
import type { Html } from 'foldkit/html'

import { cn } from '@/lib/utils'

// Re-export the @foldkit/ui VirtualList submodel surface.

export const init = FoldkitVirtualList.init
export const update = FoldkitVirtualList.update
export const view = FoldkitVirtualList.view
export const Model = FoldkitVirtualList.Model
export type Model = typeof Model.Type
export const Message = FoldkitVirtualList.Message
export type Message = typeof Message.Type

export type InitConfig = FoldkitVirtualList.InitConfig
export type ViewInputs<Item> = FoldkitVirtualList.ViewInputs<Item>

export const virtualListContainerClass =
  'h-96 w-full overflow-auto overscroll-none rounded-lg border border-border bg-card shadow-sm'

export const virtualListRowClass =
  'grid grid-cols-[2rem_1fr_5rem] items-center gap-3 border-b border-border px-4 py-3'

export type StyledViewInputs<Item> = Readonly<{
  items: ReadonlyArray<Item>
  itemToKey: (item: Item, index: number) => string
  itemToView: (item: Item, index: number) => Html
  itemToRowHeightPx?: (item: Item, index: number) => number
  overscan?: number
  containerClass?: string
}>

/** Build styled `VirtualList.ViewInputs` with foldcn's container classes. */
export const styledViewInputs = <Item>(viewInputs: StyledViewInputs<Item>): ViewInputs<Item> => ({
  items: viewInputs.items,
  itemToKey: viewInputs.itemToKey,
  itemToView: viewInputs.itemToView,
  itemToRowHeightPx: viewInputs.itemToRowHeightPx,
  overscan: viewInputs.overscan,
  containerClassName: cn(virtualListContainerClass, viewInputs.containerClass),
})
