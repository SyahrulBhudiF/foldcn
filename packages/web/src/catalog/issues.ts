import { shadcnUrlFor } from './upstream'

const BASE = 'https://github.com/elianiva/foldcn/issues/new'

export const incompatibilityIssueUrl = (
  itemName: string,
  gaps: ReadonlyArray<string>,
  parityStatus: string,
): string => {
  const title = `[parity] ${itemName}: shadcn incompatibility`
  const shadcnUrl = shadcnUrlFor(itemName)
  const gapsSection = gaps.length > 0 ? gaps.map((g) => `- ${g}`).join('\n') : '- (none listed)'
  const body = [
    `### Component`,
    itemName,
    ``,
    `### Parity status`,
    parityStatus,
    ``,
    `### Known gaps`,
    gapsSection,
    ``,
    `### Links`,
    `- Foldcn: https://foldcn.elianiva.com/docs/${itemName}`,
    ...(shadcnUrl ? [`- shadcn/ui: ${shadcnUrl}`] : []),
    ``,
    `### Describe the incompatibility`,
    `Please describe what differs from shadcn/ui and how to reproduce it.`,
    `Include steps, expected vs actual behavior, and any relevant links or screenshots.`,
  ].join('\n')

  const params = new URLSearchParams({ title, body })
  return `${BASE}?${params.toString()}`
}

const requestBody = (category?: string): string =>
  [
    category ? `### Category` : null,
    category ? category : null,
    category ? `` : null,
    `### What component would you like?`,
    ``,
    `<!-- e.g. Data Table, Carousel -->`,
    ``,
    `### Why is it needed?`,
    ``,
    `<!-- Describe your use case and why existing components do not cover it -->`,
    ``,
    `### shadcn/ui reference (if any)`,
    ``,
    `<!-- e.g. https://ui.shadcn.com/docs/components/... -->`,
  ]
    .filter((line): line is string => line !== null)
    .join('\n')

export const requestComponentUrl = (): string => requestComponentUrlForCategory()

export const requestComponentUrlForCategory = (category?: string): string => {
  const title = category ? `[request] ${category}: <component name>` : '[request] <component name>'
  const body = requestBody(category)
  const params = new URLSearchParams({ title, body, labels: 'enhancement' })
  return `${BASE}?${params.toString()}`
}
