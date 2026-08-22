import { Disclosure as FoldkitDisclosure } from '@foldkit/ui'
import type { Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { icon } from '@/lib/icons'
import { ChevronDown, ChevronUp } from 'lucide'
import { cn } from '@/lib/utils'

// A single collapsible section — mirrors shadcn's `collapsible`
// (apps/v4/registry/bases/base/ui/collapsible.tsx): a trigger that toggles
// one panel open/closed. Stateless and controlled — the parent owns the open
// state and dispatches `onToggle`. For a stack of sections with exclusive or
// multi-open semantics, see `accordion`.

export const buttonId = FoldkitDisclosure.buttonId

export const collapsibleWrapperClass = 'w-full'

export const collapsibleTriggerClass =
  'group/collapsible-trigger flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-left text-sm font-medium text-foreground transition-[background-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-disabled:pointer-events-none aria-disabled:opacity-50 select-none data-[open]:rounded-b-none motion-reduce:transition-none'

export const collapsibleContentClass =
  'overflow-hidden rounded-b-lg border border-t-0 border-border bg-card px-4 py-3 text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4'

export const collapsibleAnimatedContentClass =
  'overflow-hidden rounded-b-lg border-x border-b border-t-0 border-border bg-card px-4 py-3 text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4'

export const collapsibleChevronClass = 'size-4 shrink-0 text-muted-foreground pointer-events-none'

export type CollapsibleConfig<M> = Readonly<{
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

/** Styled collapsible section built on the @foldkit/ui Disclosure helper.
 *  When `isAnimated` is true the panel is animated with the helper's
 *  `animatePanel` transition. */
export const collapsible = <M>(config: CollapsibleConfig<M>, h: HtmlBuilder<M>): Html =>
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
            h.Class(cn(collapsibleWrapperClass, config.wrapperClass)),
            h.DataAttribute('slot', 'collapsible'),
          ],
          [
            h.button(
              [
                ...button,
                h.Class(cn(collapsibleTriggerClass, config.triggerClass)),
                h.DataAttribute('slot', 'collapsible-trigger'),
              ],
              [
                h.div(
                  [h.Class('flex w-full items-center justify-between gap-2')],
                  [
                    h.span([], [config.title]),
                    h.span(
                      [h.Class('flex shrink-0 items-center gap-1')],
                      [
                        /* ChevronDown shown when collapsed; hidden while the trigger is expanded. */
                        h.span(
                          [
                            h.Class(
                              cn(
                                collapsibleChevronClass,
                                'group-aria-expanded/collapsible-trigger:hidden',
                              ),
                            ),
                          ],
                          [icon(h, ChevronDown)],
                        ),
                        /* ChevronUp shown when expanded; hidden while the trigger is collapsed. */
                        h.span(
                          [
                            h.Class(
                              cn(
                                collapsibleChevronClass,
                                'hidden group-aria-expanded/collapsible-trigger:inline',
                              ),
                            ),
                          ],
                          [icon(h, ChevronUp)],
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
            config.isAnimated === true
              ? animatePanel(
                  h.div(
                    [
                      ...panel,
                      h.Class(cn(collapsibleAnimatedContentClass, config.contentClass)),
                      h.DataAttribute('slot', 'collapsible-content'),
                    ],
                    [config.content],
                  ),
                )
              : config.isOpen
                ? h.div(
                    [
                      ...panel,
                      h.Class(cn(collapsibleContentClass, config.contentClass)),
                      h.DataAttribute('slot', 'collapsible-content'),
                    ],
                    [config.content],
                  )
                : h.empty,
          ],
        ),
    },
    h,
  )
