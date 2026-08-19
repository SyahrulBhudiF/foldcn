import type { Document, HtmlBuilder } from 'foldkit/html'

import { itemTitle } from './catalog'
import { footerView, headerView } from './page/chrome'
import { homeView, notFoundView } from './page/home'
import { itemPage } from './page/item'
import type { AppRoute } from './route'
import type { Message } from './message'
import type { Model } from './model'

const titleOf = (route: AppRoute): string =>
  route._tag === 'Home'
    ? 'foldcn — Copy-paste components for Foldkit'
    : route._tag === 'Item'
      ? `${itemTitle(route.name)} · foldcn`
      : 'Not found · foldcn'

export const view = (model: Model, h: HtmlBuilder<Message>): Document => ({
  title: titleOf(model.route),
  body: h.div(
    [h.Class('flex min-h-svh flex-col bg-background text-foreground')],
    [
      headerView(model, h),
      (() => {
        switch (model.route._tag) {
          case 'Home':
            return homeView(model, h)
          case 'Item':
            return itemPage(model, model.route.name, h)
          case 'NotFound':
            return notFoundView(h)
        }
      })(),
      footerView(h),
    ],
  ),
})
