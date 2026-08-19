import type { Html, HtmlBuilder } from 'foldkit/html'
import { ArrowRight, Check, Computer, Copy, Moon, Sun } from 'lucide'

import { icon } from '@foldcn/registry/src/lib/icons'

import type { Message } from './message'

const render = (
  h: HtmlBuilder<Message>,
  node: Parameters<typeof icon>[0],
  className = 'size-4',
): Html => icon<Message>(node, className, h)

export const sunIcon = (h: HtmlBuilder<Message>, className = 'size-4'): Html =>
  render(h, Sun, className)
export const moonIcon = (h: HtmlBuilder<Message>, className = 'size-4'): Html =>
  render(h, Moon, className)
export const computerIcon = (h: HtmlBuilder<Message>, className = 'size-4'): Html =>
  render(h, Computer, className)
export const checkIcon = (h: HtmlBuilder<Message>, className = 'size-4'): Html =>
  render(h, Check, className)
export const copyIcon = (h: HtmlBuilder<Message>, className = 'size-4'): Html =>
  render(h, Copy, className)
export const arrowRightIcon = (h: HtmlBuilder<Message>, className = 'size-4'): Html =>
  render(h, ArrowRight, className)
