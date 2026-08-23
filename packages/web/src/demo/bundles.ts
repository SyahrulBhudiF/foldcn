import { Calendar as FoldkitCalendar } from 'foldkit'

import * as Combobox from '@foldcn/registry/styles/default/ui/combobox'
import * as Listbox from '@foldcn/registry/styles/default/ui/listbox'
import * as Menu from '@foldcn/registry/styles/default/ui/menu'
import * as RadioGroup from '@foldcn/registry/styles/default/ui/radio-group'
import * as Select from '@foldcn/registry/styles/default/ui/select'
import * as Tabs from '@foldcn/registry/styles/default/ui/tabs'
import { Schema as S } from 'effect'

//
// Literals consumed by the typed bundles below live here so the bundles and
// the demo slices that use them share one definition. Demo-only schemas
// (DataRow, DemoCard, …) live in their demo files instead.

export const City = S.Literals([
  'Johannesburg',
  'Kyiv',
  'Oxford',
  'Plymouth',
  'Quito',
  'Wellington',
  'Zurich',
])
export type City = typeof City.Type

export const Plan = S.Literals(['Startup', 'Business', 'Enterprise'])
export type Plan = typeof Plan.Type

export const DemoTab = S.Literals(['Overview', 'Analytics', 'Reports', 'Settings'])
export type DemoTab = typeof DemoTab.Type

export const DemoNav = S.Literals(['Overview', 'Components', 'Settings', 'Docs'])
export type DemoNav = typeof DemoNav.Type

export const ListboxItem = S.Literals([
  'Michael Bluth',
  'Lindsay Funke',
  'Gob Bluth',
  'George Michael',
  'Maeby Funke',
  'Buster Bluth',
  'Tobias Funke',
])
export type ListboxItem = typeof ListboxItem.Type

/** A fixed "today" so the SSG-prerendered calendar matches the hydrated page.
 *  Using the wall clock here would let the server and client disagree. */
export const DEMO_TODAY = FoldkitCalendar.make(2025, 1, 15)

//
// List-style submodels are created once per item type and shared across
// demos (DemoMenu serves menu, context-menu and menubar; LanguageSelect
// serves select and fieldset). Kept at module scope — these factories must
// not be re-created per render.

export const DemoMenu = Menu.create<string>()
export const ItemListbox = Listbox.create<ListboxItem>()
export const CityCombobox = Combobox.create<City>()
export const DemoTabs = Tabs.create<DemoTab>()
export const PlanRadioGroup = RadioGroup.create<Plan>()
export const LanguageSelect = Select.create<{ value: string; label: string }, string>()
