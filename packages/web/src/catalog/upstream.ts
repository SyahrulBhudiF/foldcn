import { foldcnOnly } from './parity'

const rename: Record<string, string> = {
  menu: 'dropdown-menu',
  fieldset: 'field',
}

export const shadcnUrlFor = (name: string): string | undefined => {
  if (foldcnOnly.has(name)) return undefined
  const slug = rename[name] ?? name
  return `https://ui.shadcn.com/docs/components/${slug}`
}

export const hasUpstream = (name: string): boolean => shadcnUrlFor(name) !== undefined
