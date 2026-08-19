import { Effect, Option, Queue, Schema as S, Stream } from 'effect'
import { Subscription } from 'foldkit'

import { subscriptions as demoSubscriptions } from './demo/subscriptions'
import { ChangedSystemTheme, GotDemoMessage, type Message } from './message'
import type { Model } from './model'

const systemThemeSubscriptions = Subscription.make<Model, Message>()((entry) => ({
  systemTheme: entry(
    { isSystemPreference: S.Boolean },
    {
      modelToDependencies: (model) => ({
        isSystemPreference: Option.exists(
          model.maybeThemePreference,
          (preference) => preference === 'System',
        ),
      }),
      dependenciesToStream: ({ isSystemPreference }) =>
        Stream.when(
          Stream.callback<typeof ChangedSystemTheme.Type>((queue) =>
            Effect.acquireRelease(
              Effect.sync(() => {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
                const handler = (event: MediaQueryListEvent) => {
                  Queue.offerUnsafe(
                    queue,
                    ChangedSystemTheme({
                      theme: event.matches ? 'Dark' : 'Light',
                    }),
                  )
                }
                mediaQuery.addEventListener('change', handler)
                return { mediaQuery, handler }
              }),
              ({ mediaQuery, handler }) =>
                Effect.sync(() => mediaQuery.removeEventListener('change', handler)),
            ).pipe(Effect.flatMap(() => Effect.never)),
          ),
          Effect.sync(() => isSystemPreference),
        ),
    },
  ),
}))

const demoLiftedSubscriptions = Subscription.lift(demoSubscriptions)<Model, Message>({
  toChildModel: (model) => model.demo,
  toParentMessage: (message) => GotDemoMessage({ message }),
})

export const subscriptions = Subscription.aggregate<Model, Message>()(
  systemThemeSubscriptions,
  demoLiftedSubscriptions,
)
