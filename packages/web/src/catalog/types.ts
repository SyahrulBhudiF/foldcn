export type Category = 'Base' | 'Lib' | 'Components' | 'Blocks'

/** A loose structural type for a sub-registry manifest group. */
export type RegistryGroupJson = Readonly<{
  items?: ReadonlyArray<{
    name?: string
    title?: string
    description?: string
    type?: string
    dependencies?: ReadonlyArray<string>
    devDependencies?: ReadonlyArray<string>
    registryDependencies?: ReadonlyArray<string>
    files?: ReadonlyArray<{ path?: string; type?: string }>
    cssVars?: unknown
    css?: unknown
  }>
}>

export type ItemFile = Readonly<{ path: string; type: string }>

export type Item = Readonly<{
  name: string
  title: string
  description: string
  type: string
  category: Category
  /** Install command copied by the user. */
  install: string
  maybeDependencies?: ReadonlyArray<string>
  maybeRegistryDependencies?: ReadonlyArray<string>
  files: ReadonlyArray<ItemFile>
  /** Primary source shown on the item page under "Source". */
  maybeSource: Readonly<{ path: string; code: string }> | undefined
  /** The base-style item carries theme tokens we render as swatches. */
  maybeTheme: unknown
}>

export type CategoryGroup = Readonly<{
  category: Category
  label: string
  description: string
  items: ReadonlyArray<Item>
}>