import { Effect } from 'effect'
import { Server } from 'foldkit/experimental'

import { items } from './catalog'
import { init } from './init'
import { view } from './view'

export const prerenderPaths: ReadonlyArray<string> = [
  '/',
  ...items.map((item) => `/components/${item.name}`),
]

export const renderPage = (request: Request): Promise<Server.EntryResult> =>
  Effect.runPromise(
    Effect.gen(function* () {
      const renderedApplication = yield* Server.renderToString(
        { routing: {}, init, view },
        { url: request.url, buildId: import.meta.env.FOLDKIT_BUILD_ID },
      )

      return Server.Rendered(renderedApplication)
    }),
  )
