import { Subscription } from 'foldkit'

import type { Model, Message } from './assemble'
import { subscriptions as dragAndDropSubscriptions } from './views/drag-and-drop'
import { subscriptions as sidebarSubscriptions } from './views/sidebar'
import { subscriptions as sliderSubscriptions } from './views/slider'
import { subscriptions as virtualListSubscriptions } from './views/virtual-list'

export const subscriptions = Subscription.aggregate<Model, Message>()(
  dragAndDropSubscriptions,
  sidebarSubscriptions,
  sliderSubscriptions,
  virtualListSubscriptions,
)
