import { Schema as S } from "effect"
import { Toast as FoldkitToast } from "@foldkit/ui"
import type { Html, HtmlBuilder } from "foldkit/html"

type Child = Html | string

import { xIcon } from "@/lib/icons"
import { cn } from "@/lib/utils"

// Re-export the @foldkit/ui Toast surface.

export const Variant = FoldkitToast.Variant
export type Variant = typeof Variant.Type
export const Position = FoldkitToast.Position
export type Position = typeof Position.Type
export type EntryHandlers = FoldkitToast.EntryHandlers
export type InitConfig = FoldkitToast.InitConfig
export type ShowInput<A> = FoldkitToast.ShowInput<A>

/** Variant colors for the toast entry surface. */
export const toastVariantClass = (variant: Variant): string =>
  variant === "Info"
    ? "border-border bg-background text-foreground"
    : variant === "Success"
      ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
      : variant === "Warning"
        ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100"
        : "border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100"

export const toastEntryClass = "w-80"

export const toastTitleClass = "text-sm font-semibold"

export const toastDescriptionClass = "mt-0.5 text-sm text-muted-foreground"

export const toastDismissButtonClass =
  "absolute right-2 top-2 rounded-md p-1 text-current opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"

/** Bind a toast stack to your payload schema, exactly like
 *  `@foldkit/ui`'s `Toast.make`, plus a styled `entryView` renderer.
 *
 *  ```ts
 *  export const Toast = ToastModule.make(S.Struct({
 *    title: S.String,
 *    maybeDescription: S.Option(S.String),
 *  }))
 *  ```
 */
export const make = <A, I>(payloadSchema: S.Codec<A, I>) => {
  const Bound = FoldkitToast.make(payloadSchema)
  type Entry = typeof Bound.Entry.Type

  const entryView = <M2>(config: Readonly<{
    entry: Entry
    handlers: EntryHandlers
    h: HtmlBuilder<M2>
    /** Render the payload content (title, description, ...). */
    toContent: (entry: Entry) => ReadonlyArray<Child>
    className?: string
    titleClass?: string
    descriptionClass?: string
  }>): Html => {
    const { entry, handlers, h } = config
    return h.div(
      [
        h.Class(
          cn(
            "relative rounded-md border p-4 pr-8 shadow-md transition duration-200 ease-out data-[closed]:opacity-0 data-[closed]:translate-y-2",
            toastVariantClass(entry.variant),
            config.className,
          ),
        ),
      ],
      [
        h.div([], config.toContent(entry)),
        h.button(
          [...handlers.dismiss, h.Class(cn(toastDismissButtonClass))],
          [xIcon(h, "size-4")],
        ),
      ],
    )
  }

  return { ...Bound, entryView }
}

export type BoundToast<A, I> = ReturnType<typeof make<A, I>>
