import type { Html, HtmlBuilder } from 'foldkit/html'

import { cn } from '@/lib/utils'

type Child = Html | string

// Resizable is a two-pane split with a draggable handle. The handle carries a
// visually hidden range input so the split stays accessible and keyboard
// operable; `onValueChange` reports the first pane's size as a percentage
// (mirrors shadcn's `resizable` base surface).

export const resizableContainerClass = 'flex h-full w-full'

export const resizableContainerVerticalClass = 'flex h-full w-full flex-col'

export const resizablePanelClass = 'overflow-auto'

export const resizableHandleClass = 'relative flex items-center justify-center bg-border'

export const resizableHandleHorizontalClass = 'w-px'

export const resizableHandleVerticalClass = 'h-px'

export type ResizablePane = Readonly<{ content: Child; className?: string }>

export type ResizableConfig<M> = Readonly<{
  value: number
  onValueChange?: (value: number) => M
  direction?: 'horizontal' | 'vertical'
  firstPane: ResizablePane
  secondPane: ResizablePane
  className?: string
}>

/** A two-pane layout with a draggable split handle. */
export const resizable = <M>(config: ResizableConfig<M>, h: HtmlBuilder<M>): Html => {
  const isHorizontal = (config.direction ?? 'horizontal') === 'horizontal'
  const firstStyle: Record<string, string> = isHorizontal ? { width: `${config.value}%` } : { height: `${config.value}%` }
  const secondStyle: Record<string, string> = isHorizontal
    ? { width: `${100 - config.value}%` }
    : { height: `${100 - config.value}%` }
  const handle = h.div(
    [
      h.Class(
        cn(
          resizableHandleClass,
          isHorizontal ? resizableHandleHorizontalClass : resizableHandleVerticalClass,
        ),
      ),
      h.DataAttribute('slot', 'resizable-handle'),
    ],
    [
      h.input([
        h.Type('range'),
        h.Min('0'),
        h.Max('100'),
        h.Step('1'),
        h.Value(String(config.value)),
        ...(config.onValueChange === undefined
          ? []
          : [h.OnInput((raw) => config.onValueChange!(Number(raw)))]),
        h.AriaLabel('Resize panels'),
        h.Class(
          cn(
            'absolute inset-0 opacity-0',
            isHorizontal ? 'h-full w-full cursor-col-resize' : 'h-full w-full cursor-row-resize',
          ),
        ),
      ]),
    ],
  )
  return h.div(
    [
      h.Class(
        cn(isHorizontal ? resizableContainerClass : resizableContainerVerticalClass, config.className),
      ),
      h.DataAttribute('slot', 'resizable'),
    ],
    [
      h.div(
        [h.Style(firstStyle), h.Class(cn(resizablePanelClass, config.firstPane.className)), h.DataAttribute('slot', 'resizable-panel')],
        [config.firstPane.content],
      ),
      handle,
      h.div(
        [h.Style(secondStyle), h.Class(cn(resizablePanelClass, config.secondPane.className)), h.DataAttribute('slot', 'resizable-panel')],
        [config.secondPane.content],
      ),
    ],
  )
}
