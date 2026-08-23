import { Update } from 'foldkit'
import { Match as M, Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { m } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { Tabs as FoldkitTabs } from '@foldkit/ui'

import * as tabs from '@foldcn/registry/styles/default/ui/tabs'
import { Card } from '@foldcn/registry/styles/default/ui/card'

import { DemoTabs, DemoTab } from '../bundles'
import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message } from '../assemble'

const GotTabsMessage = m('GotTabsMessage', { message: tabs.Message })

const TAB_DETAILS: Record<DemoTab, { title: string; description: string; content: string }> = {
  Overview: {
    title: 'Overview',
    description:
      'View your key metrics and recent project activity. Track progress across all your active projects.',
    content: 'You have 12 active projects and 3 pending tasks.',
  },
  Analytics: {
    title: 'Analytics',
    description:
      'Track performance and user engagement metrics. Monitor trends and identify growth opportunities.',
    content: 'Page views are up 25% compared to last month.',
  },
  Reports: {
    title: 'Reports',
    description:
      'Generate and download your detailed reports. Export data in multiple formats for analysis.',
    content: 'You have 5 reports ready and available to export.',
  },
  Settings: {
    title: 'Settings',
    description:
      'Manage your account preferences and options. Customize your experience to fit your needs.',
    content: 'Configure notifications, security, and themes.',
  },
}

export const tabsView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('w-full max-w-[400px]')],
    [
      h.submodel({
        slotId: model.tabs.id,
        model: model.tabs,
        view: DemoTabs.view,
        viewInputs: tabs.styledViewInputs<Message, DemoTab>(
          {
            tabs: ['Overview', 'Analytics', 'Reports', 'Settings'],
            selectedValue: model.activeTab,
            ariaLabel: 'Demo tabs',
            panel: (tab, _render, h) => {
              const details = TAB_DETAILS[tab]
              return Card<Message>(
                {},
                [
                  Card.header<Message>(
                    {},
                    [
                      Card.title<Message>({}, [details.title], h),
                      Card.description<Message>({}, [details.description], h),
                    ],
                    h,
                  ),
                  Card.content<Message>(
                    {},
                    [h.p([h.Class('text-sm text-muted-foreground')], [details.content])],
                    h,
                  ),
                ],
                h,
              )
            },
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
