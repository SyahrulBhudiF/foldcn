import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { button, buttonSizeKeys, buttonVariantKeys } from '@foldcn/registry/styles/default/ui/button'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const ClickedButtonDemo = m('ClickedButtonDemo')

export const buttonView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex flex-col items-start gap-6')],
    [
      h.div(
        [h.Class('flex flex-wrap items-center gap-3')],
        buttonVariantKeys.map((variant) =>
          button<Message>(
            { variant, onClick: ClickedButtonDemo(), className: 'capitalize' },
            variant,
            h,
          ),
        ),
      ),
      h.div(
        [h.Class('flex flex-wrap items-center gap-3')],
        buttonSizeKeys.map((size) => button<Message>({ size, onClick: ClickedButtonDemo() }, size, h)),
      ),
      h.p(
        [h.Class('text-sm text-muted-foreground')],
        [`Clicked ${model.buttonClickCount} time${model.buttonClickCount === 1 ? '' : 's'}.`],
      ),
    ],
  )

const fields = { buttonClickCount: S.Number }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { buttonClickCount: 0 },
  messages: [ClickedButtonDemo],
  handlers: (model: State) => ({
    ClickedButtonDemo: (): UpdateReturn => [evo(model, { buttonClickCount: (n) => n + 1 }), []],
  }),
  samples: [ClickedButtonDemo()],
})
