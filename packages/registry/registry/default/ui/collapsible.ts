// In foldcn a single-section collapsible is exactly the Disclosure primitive.
// Re-export its surface so `collapsible` is a first-class registry item that
// mirrors shadcn's `collapsible`, while sharing the `disclosure` implementation.

export {
  disclosure,
  disclosureButtonClass,
  disclosurePanelClass,
  disclosureAnimatedPanelClass,
  disclosureChevronClass,
  disclosureWrapperClass,
  disclosureButtonId,
} from './disclosure'

export type { DisclosureConfig } from './disclosure'
