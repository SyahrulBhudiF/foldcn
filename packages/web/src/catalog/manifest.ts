import ui from '@foldcn/registry/registry/default/ui/registry.json'
import lib from '@foldcn/registry/registry/default/lib/registry.json'
import blocks from '@foldcn/registry/registry/default/blocks/registry.json'
import style from '@foldcn/registry/registry/default/style/registry.json'

import type { RegistryGroupJson } from './types'

export const uiGroup = ui as RegistryGroupJson
export const libGroup = lib as RegistryGroupJson
export const blocksGroup = blocks as RegistryGroupJson
export const styleGroup = style as RegistryGroupJson