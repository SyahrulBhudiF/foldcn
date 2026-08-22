import type { Html, HtmlBuilder } from 'foldkit/html'

import * as HoverCard from '@foldcn/registry/styles/default/ui/hover-card'

import { GotHoverCardMessage, type Message } from '../message'
import type { Model } from '../model'

export const hoverCardView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.submodel({
    slotId: model.hoverCard.popover.id,
    model: model.hoverCard,
    view: HoverCard.view,
    viewInputs: HoverCard.styledViewInputs(
      {
        trigger: '@foldcn on GitHub',
        content: [
          HoverCard.header(
            {},
            [
              HoverCard.title({}, ['@foldcn'], h),
              HoverCard.description({}, ['A shadcn-style registry built on @foldkit/ui.'], h),
            ],
            h,
          ),
          h.p([h.Class('text-sm text-muted-foreground')], [
            'Opens on hover after a short delay, stays open while you move into the card, and closes after a grace period once you leave.',
          ]),
        ],
      },
      h,
    ),
    toParentMessage: (message) => GotHoverCardMessage({ message }),
  })
