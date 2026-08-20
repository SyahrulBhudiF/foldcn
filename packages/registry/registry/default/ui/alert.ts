import type { Html, HtmlBuilder } from 'foldkit/html'

type Child = Html | string

import { cn } from '@/lib/utils'

export const alertVariantKeys = ['default', 'destructive'] as const
export type AlertVariant = (typeof alertVariantKeys)[number]

export const alertVariants: Record<AlertVariant, string> = {
  default: 'bg-card text-card-foreground',
  destructive:
    'bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current',
}

export const alertClass =
  'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current'

export const alertTitleClass = 'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight'

export const alertDescriptionClass =
  'col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed'

type StyleConfig = Readonly<{ className?: string; variant?: AlertVariant }>

const alertContainer = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [
      h.Class(cn(alertClass, alertVariants[config.variant ?? 'default'], config.className)),
      h.Role('alert'),
      h.DataAttribute('slot', 'alert'),
      h.DataAttribute('variant', config.variant ?? 'default'),
    ],
    children,
  )

const alertTitle = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [h.Class(cn(alertTitleClass, config.className)), h.DataAttribute('slot', 'alert-title')],
    children,
  )

const alertDescription = <M>(
  config: StyleConfig,
  children: ReadonlyArray<Child>,
  h: HtmlBuilder<M>,
): Html =>
  h.div(
    [h.Class(cn(alertDescriptionClass, config.className)), h.DataAttribute('slot', 'alert-description')],
    children,
  )

/** Styled alert — `Alert.title` and `Alert.description` sub-builders. Mirrors
 *  the shadcn v4 `alert.tsx`. */
export const Alert = Object.assign(alertContainer, {
  title: alertTitle,
  description: alertDescription,
})
