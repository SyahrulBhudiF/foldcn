import { Runtime } from 'foldkit'

import { Message } from './message'
import { Model } from './model'
import { init } from './init'
import { subscriptions } from './subscriptions'
import { update } from './update'
import { view } from './view'

const application = Runtime.makeApplication({
  Model,
  init,
  update,
  view,
  subscriptions,
  container: document.getElementById('root'),
  routing: {
    onUrlRequest: (request) => Message.ClickedLink({ request }),
    onUrlChange: (url) => Message.ChangedUrl({ url }),
  },
  devTools: {
    show: 'Always',
    mode: { development: 'TimeTravel', production: 'Inspect' },
    Message,
  },
})

Runtime.hydrate(application, { buildId: import.meta.env.FOLDKIT_BUILD_ID })
