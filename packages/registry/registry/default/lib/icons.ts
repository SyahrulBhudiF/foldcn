import type { Attribute, ChildAttribute, Html, HtmlBuilder } from 'foldkit/html'
import { Check, ChevronDown, ChevronLeft, ChevronRight, Minus, X } from 'lucide'
import type { IconNode, SVGProps } from 'lucide'

/**
 * Render a lucide icon as Foldkit virtual DOM.
 *
 * Lucide ships each icon as a node tree: `[["path", { d: "..." }], ...]`.
 * This renders that tree with the `h` builder, so icons are first-class
 * Foldkit VNodes with no string parsing involved.
 *
 * ```ts
 * // Default size (size-4)
 * icon(ChevronDown, h)
 *
 * // Custom size
 * icon(ChevronDown, 'size-3', h)
 * ```
 */

const svgElement =
  <M>(tag: string, h: HtmlBuilder<M>) =>
  (attributes: ReadonlyArray<Attribute<M> | ChildAttribute>): Html => {
    switch (tag) {
      case 'path':
        return h.path(attributes)
      case 'circle':
        return h.circle(attributes)
      case 'rect':
        return h.rect(attributes)
      case 'line':
        return h.line(attributes)
      case 'polyline':
        return h.polyline(attributes)
      case 'polygon':
        return h.polygon(attributes)
      default:
        return h.path(attributes)
    }
  }

const svgAttributes = <M>(
  className: string,
  h: HtmlBuilder<M>,
): ReadonlyArray<Attribute<M> | ChildAttribute> => [
  h.AriaHidden(true),
  h.Class(className),
  h.Xmlns('http://www.w3.org/2000/svg'),
  h.Fill('none'),
  h.ViewBox('0 0 24 24'),
  h.StrokeWidth('2'),
  h.Stroke('currentColor'),
  h.StrokeLinecap('round'),
  h.StrokeLinejoin('round'),
]

const nodeToAttributes = <M>(
  attrs: SVGProps,
  h: HtmlBuilder<M>,
): ReadonlyArray<Attribute<M> | ChildAttribute> =>
  Object.entries(attrs).map(([name, value]) => h.Attribute(name, String(value)))

const defaultIconClass = 'size-4 shrink-0'

export const icon = <M>(
  node: IconNode,
  hOrClass: HtmlBuilder<M> | string,
  maybeH?: HtmlBuilder<M>,
): Html => {
  const render = (h: HtmlBuilder<M>, className: string): Html =>
    h.svg(
      svgAttributes(className, h),
      node.map(([tag, attrs]) => svgElement(tag, h)(nodeToAttributes(attrs, h))),
    )

  if (typeof hOrClass === 'string') {
    if (maybeH === undefined) throw new Error('HtmlBuilder is required when passing an icon class')
    return render(maybeH, hOrClass)
  }
  return render(hOrClass, defaultIconClass)
}

export const checkIcon = <M>(h: HtmlBuilder<M>, className?: string): Html =>
  icon(Check, className ?? defaultIconClass, h)

export const chevronDownIcon = <M>(h: HtmlBuilder<M>, className?: string): Html =>
  icon(ChevronDown, className ?? defaultIconClass, h)

export const chevronLeftIcon = <M>(h: HtmlBuilder<M>, className?: string): Html =>
  icon(ChevronLeft, className ?? defaultIconClass, h)

export const chevronRightIcon = <M>(h: HtmlBuilder<M>, className?: string): Html =>
  icon(ChevronRight, className ?? defaultIconClass, h)

export const xIcon = <M>(h: HtmlBuilder<M>, className?: string): Html =>
  icon(X, className ?? defaultIconClass, h)

export const minusIcon = <M>(h: HtmlBuilder<M>, className?: string): Html =>
  icon(Minus, className ?? defaultIconClass, h)
