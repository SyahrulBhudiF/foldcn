import type { Html, HtmlBuilder } from 'foldkit/html'

import { button } from '../../generated/registry/ui/button'
import { icon } from '../../generated/registry/lib/icons'
import { ArrowRight, ArrowLeftCircle } from 'lucide'

import { Schema as S } from 'effect'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

export const buttonView = (_model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full flex-col gap-8')],
    [
      h.div(
        [h.Class('flex w-full flex-col gap-2')],
        [
          h.div([h.Class('px-1 text-xs font-medium text-muted-foreground')], ['Variants & Sizes']),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>({ size: 'xs' }, 'Default', h),
              button<Message>({ size: 'xs', variant: 'secondary' }, 'Secondary', h),
              button<Message>({ size: 'xs', variant: 'outline' }, 'Outline', h),
              button<Message>({ size: 'xs', variant: 'ghost' }, 'Ghost', h),
              button<Message>({ size: 'xs', variant: 'destructive' }, 'Destructive', h),
              button<Message>({ size: 'xs', variant: 'link' }, 'Link', h),
            ],
          ),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>({ size: 'sm' }, 'Default', h),
              button<Message>({ size: 'sm', variant: 'secondary' }, 'Secondary', h),
              button<Message>({ size: 'sm', variant: 'outline' }, 'Outline', h),
              button<Message>({ size: 'sm', variant: 'ghost' }, 'Ghost', h),
              button<Message>({ size: 'sm', variant: 'destructive' }, 'Destructive', h),
              button<Message>({ size: 'sm', variant: 'link' }, 'Link', h),
            ],
          ),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>({}, 'Default', h),
              button<Message>({ variant: 'secondary' }, 'Secondary', h),
              button<Message>({ variant: 'outline' }, 'Outline', h),
              button<Message>({ variant: 'ghost' }, 'Ghost', h),
              button<Message>({ variant: 'destructive' }, 'Destructive', h),
              button<Message>({ variant: 'link' }, 'Link', h),
            ],
          ),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>({ size: 'lg' }, 'Default', h),
              button<Message>({ size: 'lg', variant: 'secondary' }, 'Secondary', h),
              button<Message>({ size: 'lg', variant: 'outline' }, 'Outline', h),
              button<Message>({ size: 'lg', variant: 'ghost' }, 'Ghost', h),
              button<Message>({ size: 'lg', variant: 'destructive' }, 'Destructive', h),
              button<Message>({ size: 'lg', variant: 'link' }, 'Link', h),
            ],
          ),
        ],
      ),
      h.div(
        [h.Class('flex w-full flex-col gap-2')],
        [
          h.div([h.Class('px-1 text-xs font-medium text-muted-foreground')], ['Icon Right']),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>(
                { size: 'xs' },
                h.span([], ['Default ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
              button<Message>(
                { size: 'xs', variant: 'secondary' },
                h.span([], ['Secondary ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
              button<Message>(
                { size: 'xs', variant: 'outline' },
                h.span([], ['Outline ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
              button<Message>(
                { size: 'xs', variant: 'ghost' },
                h.span([], ['Ghost ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
              button<Message>(
                { size: 'xs', variant: 'destructive' },
                h.span([], ['Destructive ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
              button<Message>(
                { size: 'xs', variant: 'link' },
                h.span([], ['Link ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
            ],
          ),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>(
                { size: 'sm' },
                h.span([], ['Default ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
              button<Message>(
                { size: 'sm', variant: 'secondary' },
                h.span([], ['Secondary ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
              button<Message>(
                { size: 'sm', variant: 'outline' },
                h.span([], ['Outline ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
              button<Message>(
                { size: 'sm', variant: 'ghost' },
                h.span([], ['Ghost ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
              button<Message>(
                { size: 'sm', variant: 'destructive' },
                h.span([], ['Destructive ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
              button<Message>(
                { size: 'sm', variant: 'link' },
                h.span([], ['Link ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
            ],
          ),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>({}, h.span([], ['Default ', icon(h, ArrowRight, 'size-3')]), h),
              button<Message>(
                { variant: 'secondary' },
                h.span([], ['Secondary ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
              button<Message>(
                { variant: 'outline' },
                h.span([], ['Outline ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
              button<Message>(
                { variant: 'ghost' },
                h.span([], ['Ghost ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
              button<Message>(
                { variant: 'destructive' },
                h.span([], ['Destructive ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
              button<Message>(
                { variant: 'link' },
                h.span([], ['Link ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
            ],
          ),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>(
                { size: 'lg' },
                h.span([], ['Default ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
              button<Message>(
                { size: 'lg', variant: 'secondary' },
                h.span([], ['Secondary ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
              button<Message>(
                { size: 'lg', variant: 'outline' },
                h.span([], ['Outline ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
              button<Message>(
                { size: 'lg', variant: 'ghost' },
                h.span([], ['Ghost ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
              button<Message>(
                { size: 'lg', variant: 'destructive' },
                h.span([], ['Destructive ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
              button<Message>(
                { size: 'lg', variant: 'link' },
                h.span([], ['Link ', icon(h, ArrowRight, 'size-3')]),
                h,
              ),
            ],
          ),
        ],
      ),
      h.div(
        [h.Class('flex w-full flex-col gap-2')],
        [
          h.div([h.Class('px-1 text-xs font-medium text-muted-foreground')], ['Icon Left']),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>(
                { size: 'xs' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Default']),
                h,
              ),
              button<Message>(
                { size: 'xs', variant: 'secondary' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Secondary']),
                h,
              ),
              button<Message>(
                { size: 'xs', variant: 'outline' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Outline']),
                h,
              ),
              button<Message>(
                { size: 'xs', variant: 'ghost' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Ghost']),
                h,
              ),
              button<Message>(
                { size: 'xs', variant: 'destructive' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Destructive']),
                h,
              ),
              button<Message>(
                { size: 'xs', variant: 'link' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Link']),
                h,
              ),
            ],
          ),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>(
                { size: 'sm' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Default']),
                h,
              ),
              button<Message>(
                { size: 'sm', variant: 'secondary' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Secondary']),
                h,
              ),
              button<Message>(
                { size: 'sm', variant: 'outline' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Outline']),
                h,
              ),
              button<Message>(
                { size: 'sm', variant: 'ghost' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Ghost']),
                h,
              ),
              button<Message>(
                { size: 'sm', variant: 'destructive' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Destructive']),
                h,
              ),
              button<Message>(
                { size: 'sm', variant: 'link' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Link']),
                h,
              ),
            ],
          ),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>({}, h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Default']), h),
              button<Message>(
                { variant: 'secondary' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Secondary']),
                h,
              ),
              button<Message>(
                { variant: 'outline' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Outline']),
                h,
              ),
              button<Message>(
                { variant: 'ghost' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Ghost']),
                h,
              ),
              button<Message>(
                { variant: 'destructive' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Destructive']),
                h,
              ),
              button<Message>(
                { variant: 'link' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Link']),
                h,
              ),
            ],
          ),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>(
                { size: 'lg' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Default']),
                h,
              ),
              button<Message>(
                { size: 'lg', variant: 'secondary' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Secondary']),
                h,
              ),
              button<Message>(
                { size: 'lg', variant: 'outline' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Outline']),
                h,
              ),
              button<Message>(
                { size: 'lg', variant: 'ghost' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Ghost']),
                h,
              ),
              button<Message>(
                { size: 'lg', variant: 'destructive' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Destructive']),
                h,
              ),
              button<Message>(
                { size: 'lg', variant: 'link' },
                h.span([], [icon(h, ArrowLeftCircle, 'size-3'), ' Link']),
                h,
              ),
            ],
          ),
        ],
      ),
      h.div(
        [h.Class('flex w-full flex-col gap-2')],
        [
          h.div([h.Class('px-1 text-xs font-medium text-muted-foreground')], ['Icon Only']),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>(
                { size: 'icon-xs', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-3'),
                h,
              ),
              button<Message>(
                { size: 'icon-xs', variant: 'secondary', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-3'),
                h,
              ),
              button<Message>(
                { size: 'icon-xs', variant: 'outline', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-3'),
                h,
              ),
              button<Message>(
                { size: 'icon-xs', variant: 'ghost', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-3'),
                h,
              ),
              button<Message>(
                { size: 'icon-xs', variant: 'destructive', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-3'),
                h,
              ),
              button<Message>(
                { size: 'icon-xs', variant: 'link', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-3'),
                h,
              ),
            ],
          ),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>(
                { size: 'icon-sm', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-3.5'),
                h,
              ),
              button<Message>(
                { size: 'icon-sm', variant: 'secondary', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-3.5'),
                h,
              ),
              button<Message>(
                { size: 'icon-sm', variant: 'outline', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-3.5'),
                h,
              ),
              button<Message>(
                { size: 'icon-sm', variant: 'ghost', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-3.5'),
                h,
              ),
              button<Message>(
                { size: 'icon-sm', variant: 'destructive', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-3.5'),
                h,
              ),
              button<Message>(
                { size: 'icon-sm', variant: 'link', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-3.5'),
                h,
              ),
            ],
          ),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>(
                { size: 'icon', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-4'),
                h,
              ),
              button<Message>(
                { size: 'icon', variant: 'secondary', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-4'),
                h,
              ),
              button<Message>(
                { size: 'icon', variant: 'outline', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-4'),
                h,
              ),
              button<Message>(
                { size: 'icon', variant: 'ghost', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-4'),
                h,
              ),
              button<Message>(
                { size: 'icon', variant: 'destructive', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-4'),
                h,
              ),
              button<Message>(
                { size: 'icon', variant: 'link', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-4'),
                h,
              ),
            ],
          ),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>(
                { size: 'icon-lg', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-4'),
                h,
              ),
              button<Message>(
                { size: 'icon-lg', variant: 'secondary', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-4'),
                h,
              ),
              button<Message>(
                { size: 'icon-lg', variant: 'outline', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-4'),
                h,
              ),
              button<Message>(
                { size: 'icon-lg', variant: 'ghost', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-4'),
                h,
              ),
              button<Message>(
                { size: 'icon-lg', variant: 'destructive', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-4'),
                h,
              ),
              button<Message>(
                { size: 'icon-lg', variant: 'link', attributes: [h.AriaLabel('Arrow')] },
                icon(h, ArrowRight, 'size-4'),
                h,
              ),
            ],
          ),
        ],
      ),
      h.div(
        [h.Class('flex w-full flex-col gap-2')],
        [
          h.div([h.Class('px-1 text-xs font-medium text-muted-foreground')], ['Examples']),
          h.div(
            [h.Class('flex flex-wrap items-center gap-4')],
            [
              h.div(
                [h.Class('flex items-center gap-2')],
                [
                  button<Message>({ variant: 'outline' }, 'Cancel', h),
                  button<Message>({}, h.span([], ['Submit ', icon(h, ArrowRight, 'size-3')]), h),
                ],
              ),
              h.div(
                [h.Class('flex items-center gap-2')],
                [
                  button<Message>({ variant: 'destructive' }, 'Delete', h),
                  button<Message>(
                    { size: 'icon', attributes: [h.AriaLabel('Action')] },
                    icon(h, ArrowRight, 'size-4'),
                    h,
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
      h.div(
        [h.Class('flex w-full flex-col gap-2')],
        [
          h.div([h.Class('px-1 text-xs font-medium text-muted-foreground')], ['Invalid States']),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>(
                { size: 'xs', attributes: [h.Attribute('aria-invalid', 'true')] },
                'Default',
                h,
              ),
              button<Message>(
                {
                  size: 'xs',
                  variant: 'secondary',
                  attributes: [h.Attribute('aria-invalid', 'true')],
                },
                'Secondary',
                h,
              ),
              button<Message>(
                {
                  size: 'xs',
                  variant: 'outline',
                  attributes: [h.Attribute('aria-invalid', 'true')],
                },
                'Outline',
                h,
              ),
              button<Message>(
                { size: 'xs', variant: 'ghost', attributes: [h.Attribute('aria-invalid', 'true')] },
                'Ghost',
                h,
              ),
              button<Message>(
                {
                  size: 'xs',
                  variant: 'destructive',
                  attributes: [h.Attribute('aria-invalid', 'true')],
                },
                'Destructive',
                h,
              ),
              button<Message>(
                { size: 'xs', variant: 'link', attributes: [h.Attribute('aria-invalid', 'true')] },
                'Link',
                h,
              ),
            ],
          ),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>(
                { size: 'sm', attributes: [h.Attribute('aria-invalid', 'true')] },
                'Default',
                h,
              ),
              button<Message>(
                {
                  size: 'sm',
                  variant: 'secondary',
                  attributes: [h.Attribute('aria-invalid', 'true')],
                },
                'Secondary',
                h,
              ),
              button<Message>(
                {
                  size: 'sm',
                  variant: 'outline',
                  attributes: [h.Attribute('aria-invalid', 'true')],
                },
                'Outline',
                h,
              ),
              button<Message>(
                { size: 'sm', variant: 'ghost', attributes: [h.Attribute('aria-invalid', 'true')] },
                'Ghost',
                h,
              ),
              button<Message>(
                {
                  size: 'sm',
                  variant: 'destructive',
                  attributes: [h.Attribute('aria-invalid', 'true')],
                },
                'Destructive',
                h,
              ),
              button<Message>(
                { size: 'sm', variant: 'link', attributes: [h.Attribute('aria-invalid', 'true')] },
                'Link',
                h,
              ),
            ],
          ),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>({ attributes: [h.Attribute('aria-invalid', 'true')] }, 'Default', h),
              button<Message>(
                { variant: 'secondary', attributes: [h.Attribute('aria-invalid', 'true')] },
                'Secondary',
                h,
              ),
              button<Message>(
                { variant: 'outline', attributes: [h.Attribute('aria-invalid', 'true')] },
                'Outline',
                h,
              ),
              button<Message>(
                { variant: 'ghost', attributes: [h.Attribute('aria-invalid', 'true')] },
                'Ghost',
                h,
              ),
              button<Message>(
                { variant: 'destructive', attributes: [h.Attribute('aria-invalid', 'true')] },
                'Destructive',
                h,
              ),
              button<Message>(
                { variant: 'link', attributes: [h.Attribute('aria-invalid', 'true')] },
                'Link',
                h,
              ),
            ],
          ),
          h.div(
            [h.Class('flex flex-wrap items-center gap-2')],
            [
              button<Message>(
                { size: 'lg', attributes: [h.Attribute('aria-invalid', 'true')] },
                'Default',
                h,
              ),
              button<Message>(
                {
                  size: 'lg',
                  variant: 'secondary',
                  attributes: [h.Attribute('aria-invalid', 'true')],
                },
                'Secondary',
                h,
              ),
              button<Message>(
                {
                  size: 'lg',
                  variant: 'outline',
                  attributes: [h.Attribute('aria-invalid', 'true')],
                },
                'Outline',
                h,
              ),
              button<Message>(
                { size: 'lg', variant: 'ghost', attributes: [h.Attribute('aria-invalid', 'true')] },
                'Ghost',
                h,
              ),
              button<Message>(
                {
                  size: 'lg',
                  variant: 'destructive',
                  attributes: [h.Attribute('aria-invalid', 'true')],
                },
                'Destructive',
                h,
              ),
              button<Message>(
                { size: 'lg', variant: 'link', attributes: [h.Attribute('aria-invalid', 'true')] },
                'Link',
                h,
              ),
            ],
          ),
        ],
      ),
    ],
  )

const fields = {}
const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: {},
  messages: [],
  handlers: (_model: State) => ({}),
})
