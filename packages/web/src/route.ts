import { Schema as S, pipe } from 'effect'
import { Route } from 'foldkit'
import { literal, r, root, schemaSegment, slash } from 'foldkit/route'

// ROUTES
//   "/"            → Home (category grid)
//   "/docs"         → the components index (the docs landing)
//   "/docs/:name"   → a single registry item
//   anything else  → NotFound

export const HomeRoute = r('Home')
export const ComponentsRoute = r('Components')
export const ItemRoute = r('Item', { name: S.String })
export const NotFoundRoute = r('NotFound', { path: S.String })

export const AppRoute = S.Union([HomeRoute, ComponentsRoute, ItemRoute, NotFoundRoute])
export type AppRoute = typeof AppRoute.Type

const homeRouter = pipe(root, Route.mapTo(HomeRoute))
const docsRouter = pipe(literal('docs'), Route.mapTo(ComponentsRoute))
const itemRouter = pipe(
  literal('docs'),
  slash(schemaSegment('name', S.String)),
  Route.mapTo(ItemRoute),
)

// Item before index so `/docs/:name` is not swallowed by the bare
// `/docs` route; both are disjoint, but order keeps intent explicit.
export const routeParser = Route.oneOf(itemRouter, docsRouter, homeRouter)

export const parseRoute = Route.parseUrlWithFallback(routeParser, NotFoundRoute)
