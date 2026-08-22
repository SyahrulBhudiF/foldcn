import { Update } from 'foldkit'
import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { Tabs as FoldkitTabs } from '@foldkit/ui'

import * as tabs from '@foldcn/registry/styles/default/ui/tabs'

import { DemoTabs, DemoTab } from '../bundles'
import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const GotTabsMessage = m('GotTabsMessage', { message: tabs.Message })

const TAB_CONTENT: Record<DemoTab, string> = {
  Overview: 'Explore what this component does and how it is wired together.',
  Settings: 'Tweak the options exposed by the submodel.',
  Billing: 'See how it reports selection changes back to your update.',
}

export const tabsView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('w-full')],
    [
      h.submodel({
        slotId: model.tabs.id,
        model: model.tabs,
        view: DemoTabs.view,
        viewInputs: tabs.styledViewInputs<Message, DemoTab>(
          {
            tabs: ['Overview', 'Settings', 'Billing'],
            selectedValue: model.activeTab,
            ariaLabel: 'Demo tabs',
            panel: (tab, render, h) =>
              h.p([h.Class('text-sm text-muted-foreground')], [TAB_CONTENT[tab]]),
          },
          h,
        ),
        toParentMessage: (message) => GotTabsMessage({ message }),
      }),
    ],
  )

const foldTabsOutMessage = M.type<FoldkitTabs.OutMessage<DemoTab>>().pipe(
  M.withReturnType<Update.Step<State, unknown>>(),
  M.tagsExhaustive({
    Selected:
      ({ value }) =>
      (model) => [evo(model, { activeTab: () => value }), []],
  }),
)

const foldTabs = Update.foldChild({
  update: DemoTabs.update,
  read: (model: State) => Option.some(model.tabs),
  write: (model, next) => evo(model, { tabs: () => next }),
  toParentMessage: (message) => GotTabsMessage({ message }),
  foldOutMessage: foldTabsOutMessage,
})

const fields = { tabs: tabs.Model, activeTab: DemoTab }

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

export const slice = defineSlice({
  fields,
  init: { tabs: tabs.init({ id: 'tabs-demo' }), activeTab: 'Overview' },
  messages: [GotTabsMessage],
  handlers: (model: State) => ({
    GotTabsMessage: (payload: typeof GotTabsMessage.Type): UpdateReturn =>
      foldTabs(model, payload.message),
  }),
  samples: [],
  // Selection flows through the submodel's out-messages; the public
  // @foldkit/ui namespace exports no child-message constructors, so there
  // are no top-level samples to feed update().
})
