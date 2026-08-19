import { Schema as S, pipe } from 'effect'
import { Route } from 'foldkit'
import { literal, r, root, schemaSegment, slash } from 'foldkit/route'

// ROUTES
//   "/"                    → Home (category grid)
//   "/components/:name"    → a single registry item
//   anything else          → NotFound

export const HomeRoute = r('Home')
export const ItemRoute = r('Item', { name: S.String })
export const NotFoundRoute = r('NotFound', { path: S.String })

export const AppRoute = S.Union([HomeRoute, ItemRoute, NotFoundRoute])
export type AppRoute = typeof AppRoute.Type

const homeRouter = pipe(root, Route.mapTo(HomeRoute))
const itemRouter = pipe(
  literal('components'),
  slash(schemaSegment('name', S.String)),
  Route.mapTo(ItemRoute),
)

export const routeParser = Route.oneOf(itemRouter, homeRouter)

export const parseRoute = Route.parseUrlWithFallback(routeParser, NotFoundRoute)
