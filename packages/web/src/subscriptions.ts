import { Effect, Option, Queue, Schema as S, Stream } from 'effect'
import { Subscription } from 'foldkit'

import { subscriptions as demoSubscriptions } from './demo/subscriptions'
import { Message } from './message'
import type { Message as AppMessage } from './message'
import type { Model } from './model'

const systemThemeSubscriptions = Subscription.make<Model, AppMessage>()((entry) => ({
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
          Stream.callback<typeof Message.ChangedSystemTheme.Type>((queue) =>
            Effect.acquireRelease(
              Effect.sync(() => {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
                const handler = (event: MediaQueryListEvent) => {
                  Queue.offerUnsafe(
                    queue,
                    Message.ChangedSystemTheme({
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

const demoLiftedSubscriptions = Subscription.lift(demoSubscriptions)<Model, AppMessage>({
  toChildModel: (model) => model.demo,
  toParentMessage: (message) => Message.GotDemoMessage({ message }),
})

export const subscriptions = Subscription.aggregate<Model, AppMessage>()(
  systemThemeSubscriptions,
  demoLiftedSubscriptions,
)
