import type { Html, HtmlBuilder } from 'foldkit/html'

import * as Menubar from '../../generated/registry/ui/menubar'
import { DemoMenu } from '../bundles'

import { defineSlice } from '../slice'
import type { Model, Message } from '../assemble'

import { Message as MenuMessage } from './menu'

export const menubarView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex w-full flex-col gap-8')],
    [
      h.div(
        [h.Class('flex w-full flex-col gap-2')],
        [
          h.div([h.Class('px-1 text-xs font-medium text-muted-foreground')], ['Basic']),
          Menubar.menubar(
            [
              h.submodel({
                slotId: model.menu.id,
                model: model.menu,
                view: DemoMenu.view,
                viewInputs: Menubar.viewInputs<string>({
                  items: ['New Tab', 'New Window', 'New Incognito Window', 'Share', 'Print…'],
                  buttonContent: h.span([], ['File']),
                  itemToConfig: (item, { isActive }) => ({
                    className: isActive ? 'font-medium' : '',
                    content: h.span([], [item]),
                  }),
                }),
                toParentMessage: (message) => MenuMessage.GotMenuMessage({ message }),
              }),
              h.button([h.Class(Menubar.menubarTriggerClass)], ['Edit']),
              h.button([h.Class(Menubar.menubarTriggerClass)], ['View']),
              h.button([h.Class(Menubar.menubarTriggerClass)], ['Profiles']),
            ],
            h,
          ),
          h.p([h.Class('px-1 text-xs text-muted-foreground')], ['Interactive File menu — other triggers (Edit/View/Profiles) are visual affordances. No cross-menu arrow traversal in foldcn.']),
        ],
      ),
      h.div(
        [h.Class('flex w-full flex-col gap-2')],
        [
          h.div([h.Class('px-1 text-xs font-medium text-muted-foreground')], ['With Submenu']),
          h.div([h.Class('rounded-lg border p-3 text-sm')], ['File → Share → Email / Messages / Notes; Edit → Find → Find / Find Next / Find Previous (submenus).']),
        ],
      ),
      h.div(
        [h.Class('flex w-full flex-col gap-2')],
        [
          h.div([h.Class('px-1 text-xs font-medium text-muted-foreground')], ['Sides']),
          h.div([h.Class('flex flex-wrap gap-2 text-xs')], [h.span([h.Class('rounded border px-2 py-1')], ['inline-start']), h.span([h.Class('rounded border px-2 py-1')], ['top']), h.span([h.Class('rounded border px-2 py-1')], ['bottom']), h.span([h.Class('rounded border px-2 py-1')], ['right'])]),
          h.p([h.Class('px-1 text-xs text-muted-foreground')], ['MenubarContent side per menu — static preview.']),
        ],
      ),
      h.div(
        [h.Class('flex w-full flex-col gap-2')],
        [
          h.div([h.Class('px-1 text-xs font-medium text-muted-foreground')], ['With Checkboxes']),
          h.div([h.Class('rounded-lg border p-3 text-sm flex flex-col gap-1')], [h.div([], ['Always Show Bookmarks Bar — unchecked']), h.div([], ['Always Show Full URLs — checked']), h.div([h.Class('border-t my-1')], []), h.div([], ['Format → Strikethrough (checked) / Code / Superscript'])]),
        ],
      ),
      h.div(
        [h.Class('flex w-full flex-col gap-2')],
        [
          h.div([h.Class('px-1 text-xs font-medium text-muted-foreground')], ['With Radio']),
          h.div([h.Class('rounded-lg border p-3 text-sm')], ['Profiles: Andy / Benoit (selected) / Luis · Theme: Light / Dark / System — radio groups with Edit / Add Profile inset items.']),
        ],
      ),
      h.div(
        [h.Class('flex w-full flex-col gap-2')],
        [
          h.div([h.Class('px-1 text-xs font-medium text-muted-foreground')], ['With Icons & Shortcuts']),
          h.div([h.Class('rounded-lg border p-3 text-sm')], ['File → New File ⌘N · Open Folder · Save ⌘S; More → Settings / Help / Delete (destructive) with icons.']),
        ],
      ),
      h.div(
        [h.Class('flex w-full flex-col gap-2')],
        [
          h.div([h.Class('px-1 text-xs font-medium text-muted-foreground')], ['Format & Insert']),
          h.div([h.Class('rounded-lg border p-3 text-sm flex flex-col gap-1')], [h.div([], ['Format → Bold ⌘B · Italic ⌘I · Underline ⌘U + Strikethrough/Code checkboxes']), h.div([], ['Insert → Media submenu (Image/Video/Audio) + Link ⌘K + Table'])]),
        ],
      ),
      h.div(
        [h.Class('flex w-full flex-col gap-2')],
        [
          h.div([h.Class('px-1 text-xs font-medium text-muted-foreground')], ['Destructive']),
          h.div([h.Class('rounded-lg border p-3 text-sm')], ['File → Delete File ⌘⌫ (destructive) · Account → Profile / Settings / Sign out (destructive) / Delete (destructive).']),
        ],
      ),
      h.div(
        [h.Class('flex w-full flex-col gap-2')],
        [
          h.div([h.Class('px-1 text-xs font-medium text-muted-foreground')], ['In Dialog']),
          h.div([h.Class('rounded-lg border p-3 text-sm text-muted-foreground')], ['Dialog with a menubar inside — File: Copy/Cut/Paste + More Options submenu; Edit: Undo/Redo.']),
        ],
      ),
      h.div(
        [h.Class('flex w-full flex-col gap-2')],
        [
          h.div([h.Class('px-1 text-xs font-medium text-muted-foreground')], ['With Inset']),
          h.div([h.Class('rounded-lg border p-3 text-sm')], ['View → Copy / Cut / Paste (inset) + Bookmarks / Full URLs (inset checkboxes) + Theme radios (inset) + More Options submenu (inset).']),
        ],
      ),
    ],
  )

export const slice = defineSlice({
  fields: {},
  init: {},
  messages: [],
  handlers: () => ({}),
})
