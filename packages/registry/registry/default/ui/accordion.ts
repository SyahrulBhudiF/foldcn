import { Disclosure as FoldkitDisclosure } from '@foldkit/ui'
import type { Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { icon } from '@/lib/icons'
import { ChevronDown } from 'lucide'
import { cn } from '@/lib/utils'

// Re-export the @foldkit/ui Disclosure surface. An accordion is a vertical
// stack of Disclosure items with a shared exclusive-open convention (the parent
// keeps one open index). The primitive is stateless and controlled — the
// parent owns each item's open state and dispatches `onToggle`.

export const buttonId = FoldkitDisclosure.buttonId

export const accordionItemClass = 'border-b last:border-b-0'

export const accordionTriggerClass =
  'group/accordion-trigger flex w-full items-center justify-between gap-2 py-4 text-left text-sm font-medium transition-all hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&[aria-expanded=true]>svg]:rotate-180'

export const accordionContentClass = 'overflow-hidden pb-4 text-sm text-muted-foreground'

export const accordionAnimatedContentClass = 'overflow-hidden pb-4 text-sm text-muted-foreground'

export const accordionChevronClass = 'size-4 shrink-0 text-muted-foreground transition-transform'

export const accordionWrapperClass = 'w-full'

export type AccordionType = 'single' | 'multiple'

/** Computes the next open-state array for an accordion group. */
export const nextAccordionOpen = (
  current: ReadonlyArray<boolean>,
  index: number,
  isOpen: boolean,
  type: AccordionType = 'multiple',
): ReadonlyArray<boolean> =>
  type === 'single' && isOpen
    ? current.map((_, itemIndex) => itemIndex === index)
    : current.map((value, itemIndex) => (itemIndex === index ? isOpen : value))

export type AccordionItemConfig<M> = Readonly<{
  id: string
  isOpen: boolean
  onToggle: (isOpen: boolean) => M
  title: Child
  content: Child
  isDisabled?: boolean
  ariaLabel?: string
  ariaLabelledBy?: string
  isAnimated?: boolean
  triggerClass?: string
  contentClass?: string
  wrapperClass?: string
}>

export type AccordionConfig<M> = Readonly<{
  type?: AccordionType
  value: ReadonlyArray<boolean>
  items: ReadonlyArray<Omit<AccordionItemConfig<M>, 'isOpen' | 'onToggle'>>
  onValueChange: (value: ReadonlyArray<boolean>) => M
  className?: string
}>

/** Renders a controlled accordion group with single or multiple open items. */
export const accordion = <M>(config: AccordionConfig<M>, h: HtmlBuilder<M>): Html => {
  const type = config.type ?? 'multiple'

  return h.div(
    [h.Class(cn(accordionWrapperClass, config.className)), h.DataAttribute('slot', 'accordion')],
    config.items.map((item, index) =>
      accordionItem<M>(
        {
          ...item,
          isOpen: config.value[index] ?? false,
          onToggle: (isOpen) =>
            config.onValueChange(nextAccordionOpen(config.value, index, isOpen, type)),
        },
        h,
      ),
    ),
  )
}

/** Styled accordion item built on the @foldkit/ui Disclosure helper. Mirrors
 *  the shadcn `accordion` trigger/content pair: a full-width trigger with a
 *  chevron that rotates when expanded, and a collapsible content region. */
export const accordionItem = <M>(config: AccordionItemConfig<M>, h: HtmlBuilder<M>): Html =>
  FoldkitDisclosure.view<M>(
    {
      id: config.id,
      isOpen: config.isOpen,
      onToggle: config.onToggle,
      isDisabled: config.isDisabled,
      ariaLabel: config.ariaLabel,
      ariaLabelledBy: config.ariaLabelledBy,
      toView: ({ button, panel, animatePanel }) =>
        h.div(
          [
            h.Class(cn(accordionItemClass, accordionWrapperClass, config.wrapperClass)),
            h.DataAttribute('slot', 'accordion-item'),
          ],
          [
            h.button(
              [
                ...button,
                h.Class(cn(accordionTriggerClass, config.triggerClass)),
                h.DataAttribute('slot', 'accordion-trigger'),
              ],
              [
                h.span([], [config.title]),
                h.span([h.Class(accordionChevronClass)], [icon(h, ChevronDown)]),
              ],
            ),
            config.isAnimated === true
              ? animatePanel(
                  h.div(
                    [
                      ...panel,
                      h.Class(cn(accordionAnimatedContentClass, config.contentClass)),
                      h.DataAttribute('slot', 'accordion-content'),
                    ],
                    [config.content],
                  ),
                )
              : config.isOpen
                ? h.div(
                    [
                      ...panel,
                      h.Class(cn(accordionContentClass, config.contentClass)),
                      h.DataAttribute('slot', 'accordion-content'),
                    ],
                    [config.content],
                  )
                : h.empty,
          ],
        ),
    },
    h,
  )
