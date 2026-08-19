import type { DemoItemName } from './view'

export type DemoExample = Readonly<{ path: string; code: string }>

/**
 * Curated usage snippets for each demo — what a consumer copies to use the
 * component, not the registry implementation. Keep in sync with `demo/views/*`.
 */
export const demoExampleByName: Partial<Record<DemoItemName, DemoExample>> = {
  button: {
    path: 'example/button.tsx',
    code: `import { button } from '@foldcn/registry/src/ui/button'\nimport type { HtmlBuilder } from 'foldkit/html'\n\n// Variants: default | destructive | outline | secondary | ghost | link\n// Sizes: default | xs | sm | lg | icon | icon-xs | icon-sm | icon-lg\nexport const Example = (h: HtmlBuilder<Message>) =>\n  button({ variant: 'default', onClick: ClickedButton() }, 'Submit', h)\n`,
  },

  card: {
    path: 'example/card.tsx',
    code: `import { Card } from '@foldcn/registry/src/ui/card'\nimport { button } from '@foldcn/registry/src/ui/button'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  Card(\n    {},\n    [\n      Card.header({}, [\n        Card.title({}, ['Card title'], h),\n        Card.description({}, ['Cards group related content.'], h),\n      ], h),\n      Card.content({}, [\n        h.p([h.Class('text-sm text-muted-foreground')], ['Your content here.']),\n      ], h),\n      Card.footer({}, [button({ size: 'sm' }, 'Action', h)], h),\n    ],\n    h,\n  )\n`,
  },

  nav: {
    path: 'example/nav.tsx',
    code: `import { nav } from '@foldcn/registry/src/ui/nav'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nconst ITEMS = ['Overview', 'Components', 'Settings', 'Docs'] as const\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  nav({\n    items: ITEMS,\n    ariaLabel: 'Primary',\n    toHref: (_value, index) => (index === 1 ? '/' : '#'),\n    isItemCurrent: (_value, index) => index === 1,\n    toLabel: (value) => value,\n  }, h)\n`,
  },

  disclosure: {
    path: 'example/disclosure.tsx',
    code: `import { disclosure } from '@foldcn/registry/src/ui/disclosure'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  disclosure(\n    {\n      id: 'disclosure-faq',\n      isOpen: model.isDisclosureBasicOpen,\n      onToggle: (isOpen) => ToggledDisclosureBasic({ isOpen }),\n      title: 'What is foldcn?',\n      content: 'A shadcn-style registry of copy-paste components built on @foldkit/ui.',\n      isAnimated: true, // smooth open/close\n    },\n    h,\n  )\n`,
  },

  input: {
    path: 'example/input.tsx',
    code: `import { input } from '@foldcn/registry/src/ui/input'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  input(\n    {\n      id: 'email',\n      label: 'Email',\n      type: 'email',\n      value: model.inputValue,\n      onInput: (value) => UpdatedInputValue({ value }),\n      placeholder: 'you@example.com',\n      maybeDescription: 'We never share your email.',\n    },\n    h,\n  )\n`,
  },

  textarea: {
    path: 'example/textarea.tsx',
    code: `import { textarea } from '@foldcn/registry/src/ui/textarea'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  textarea(\n    {\n      id: 'bio',\n      label: 'Bio',\n      value: model.textareaValue,\n      onInput: (value) => UpdatedTextareaValue({ value }),\n      rows: 4,\n      placeholder: 'Tell us about yourself...',\n      maybeDescription: 'Appears on your public profile.',\n    },\n    h,\n  )\n`,
  },

  select: {
    path: 'example/select.tsx',
    code: `import * as select from '@foldcn/registry/src/ui/select'\nimport { LanguageSelect } from '../bundles'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  h.div([h.Class(select.selectWrapperClass)], [\n    select.selectLabel('Language', h),\n    h.submodel({\n      slotId: model.select.id,\n      model: model.select,\n      view: LanguageSelect.view,\n      viewInputs: select.styledViewInputs({\n        options: [\n          { value: 'en', label: 'English' },\n          { value: 'id', label: 'Bahasa Indonesia' },\n          { value: 'ja', label: '日本語' },\n        ],\n        maybeSelectedValue: model.maybeSelectValue,\n        itemToValue: (item) => item.value,\n        itemToLabel: (item) => item.label,\n        label: 'Language',\n      }, h),\n      toParentMessage: (message) => GotSelectMessage({ message }),\n    }),\n  ])\n`,
  },

  checkbox: {
    path: 'example/checkbox.tsx',
    code: `import { checkbox } from '@foldcn/registry/src/ui/checkbox'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  checkbox(\n    {\n      id: 'terms',\n      label: 'Accept terms and conditions',\n      maybeDescription: 'Required before you can continue.',\n      isChecked: model.isCheckboxChecked,\n      onToggle: (isChecked) => ToggledCheckbox({ isChecked }),\n    },\n    h,\n  )\n`,
  },

  switch: {
    path: 'example/switch.tsx',
    code: `import { switch_ } from '@foldcn/registry/src/ui/switch'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  switch_(\n    {\n      id: 'email-notifs',\n      label: 'Email notifications',\n      maybeDescription: 'Receive emails about your account activity.',\n      isChecked: model.isSwitchEmailChecked,\n      onToggle: (isChecked) => ToggledSwitchEmail({ isChecked }),\n    },\n    h,\n  )\n`,
  },

  fieldset: {
    path: 'example/fieldset.tsx',
    code: `import { fieldset } from '@foldcn/registry/src/ui/fieldset'\nimport { input } from '@foldcn/registry/src/ui/input'\nimport * as select from '@foldcn/registry/src/ui/select'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  fieldset(\n    {\n      id: 'contact',\n      legend: 'Contact details',\n      maybeDescription: 'Used for shipping and billing.',\n      children: [\n        input({ id: 'name', label: 'Name', value: model.inputValue, onInput: (v) => UpdatedInputValue({ value: v }) }, h),\n        select.select({\n          id: 'country',\n          label: 'Country',\n          value: 'en',\n          onChange: (value) => UpdatedSelectValue({ value }),\n          options: [h.option([h.Value('en')], ['English']), h.option([h.Value('id')], ['Indonesia'])],\n        }, h),\n      ],\n    },\n    h,\n  )\n`,
  },

  icons: {
    path: 'example/icons.tsx',
    code: `import { icon } from '@foldcn/registry/src/lib/icons'\nimport { Check, X, ChevronDown } from 'lucide'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  h.div([h.Class('flex items-center gap-2')], [\n    icon(h, Check),\n    icon(h, X),\n    icon(h, ChevronDown),\n  ])\n`,
  },

  dialog: {
    path: 'example/dialog.tsx',
    code: `import * as Dialog from '@foldcn/registry/src/ui/dialog'\nimport { button } from '@foldcn/registry/src/ui/button'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  h.div([], [\n    button({ onClick: ClickedOpenDialog() }, 'Open dialog', h),\n    h.submodel({\n      slotId: model.dialog.id,\n      model: model.dialog,\n      view: Dialog.view,\n      viewInputs: Dialog.styledViewInputs({\n        content: ({ closeButton, title, description }, h) => [\n          h.h2([...title, h.Class('text-lg font-semibold')], ['Edit profile']),\n          h.p([...description, h.Class('text-sm text-muted-foreground')], ['Make changes here.']),\n          h.div([h.Class('mt-6 flex justify-end gap-2')], [\n            h.button([...closeButton, h.Class('rounded-md border px-4 py-2 text-sm')], ['Cancel']),\n            h.button([...closeButton, h.Class('rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground')], ['Save']),\n          ]),\n        ],\n      }, h),\n      toParentMessage: (message) => GotDialogMessage({ message }),\n    }),\n  ])\n`,
  },

  popover: {
    path: 'example/popover.tsx',
    code: `import * as Popover from '@foldcn/registry/src/ui/popover'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  h.submodel({\n    slotId: model.popover.id,\n    model: model.popover,\n    view: Popover.view,\n    viewInputs: Popover.styledViewInputs({\n      anchor: { placement: 'bottom-start', gap: 4, padding: 8 },\n      trigger: 'Open popover',\n      content: [\n        h.p([h.Class('text-sm font-medium')], ['Dimensions']),\n        h.p([h.Class('text-sm text-muted-foreground')], ['Set the dimensions for the layer.']),\n      ],\n    }, h),\n    toParentMessage: (message) => GotPopoverMessage({ message }),\n  })\n`,
  },

  tooltip: {
    path: 'example/tooltip.tsx',
    code: `import * as Tooltip from '@foldcn/registry/src/ui/tooltip'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  h.submodel({\n    slotId: model.tooltip.id,\n    model: model.tooltip,\n    view: Tooltip.view,\n    viewInputs: Tooltip.styledViewInputs({\n      anchor: { placement: 'top', gap: 8, padding: 8 },\n      trigger: 'Hover me',\n      content: 'Tooltip content',\n    }, h),\n    toParentMessage: (message) => GotTooltipMessage({ message }),\n  })\n`,
  },

  menu: {
    path: 'example/menu.tsx',
    code: `import * as menu from '@foldcn/registry/src/ui/menu'\nimport { DemoMenu } from '../bundles'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  h.submodel({\n    slotId: model.menu.id,\n    model: model.menu,\n    view: DemoMenu.view,\n    viewInputs: menu.viewInputs({\n      items: ['Edit', 'Duplicate', 'Archive', 'Delete'],\n      buttonContent: h.span([], ['Open menu']),\n      itemToConfig: (item, { isActive }) => ({\n        content: h.span([h.Class(isActive ? 'font-medium' : '')], [item]),\n      }),\n    }),\n    toParentMessage: (message) => GotMenuMessage({ message }),\n  })\n`,
  },

  listbox: {
    path: 'example/listbox.tsx',
    code: `import * as listbox from '@foldcn/registry/src/ui/listbox'\nimport { ItemListbox } from '../bundles'\nimport { Option } from 'effect'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  h.submodel({\n    slotId: model.listbox.id,\n    model: model.listbox,\n    view: ItemListbox.view,\n    viewInputs: listbox.viewInputs({\n      items: ['Michael Bluth', 'Lindsay Funke', 'Gob Bluth'],\n      maybeSelectedValue: model.maybeListboxValue,\n      buttonContent: h.span([], [Option.getOrElse(model.maybeListboxValue, () => 'Select a Bluth')]),\n      itemToConfig: (item, { isSelected, isActive }) => ({\n        content: h.span([h.Class('flex w-full justify-between')], [\n          h.span([h.Class(isActive ? 'font-medium' : '')], [item]),\n          ...(isSelected ? [h.span([], ['✓'])] : []),\n        ]),\n      }),\n    }),\n    toParentMessage: (message) => GotListboxMessage({ message }),\n  })\n`,
  },

  combobox: {
    path: 'example/combobox.tsx',
    code: `import * as combobox from '@foldcn/registry/src/ui/combobox'\nimport { CityCombobox } from '../bundles'\nimport { Option } from 'effect'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  h.submodel({\n    slotId: model.combobox.id,\n    model: model.combobox,\n    view: CityCombobox.view,\n    viewInputs: combobox.viewInputs({\n      items: ['Johannesburg', 'Kyiv', 'Oxford', 'Quito', 'Zurich'],\n      restingInputValue: Option.getOrElse(model.maybeComboboxValue, () => ''),\n      maybeSelectedValue: model.maybeComboboxValue,\n      itemToValue: (city) => city,\n      itemToDisplayText: (city) => city,\n      inputPlaceholder: 'Select a city...',\n      itemToConfig: (city, { isSelected }) => ({\n        content: h.span([h.Class('flex w-full justify-between')], [h.span([], [city]), ...(isSelected ? [h.span([], ['✓'])] : [])]),\n      }),\n    }),\n    toParentMessage: (message) => GotComboboxMessage({ message }),\n  })\n`,
  },

  tabs: {
    path: 'example/tabs.tsx',
    code: `import * as tabs from '@foldcn/registry/src/ui/tabs'\nimport { DemoTabs } from '../bundles'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  h.submodel({\n    slotId: model.tabs.id,\n    model: model.tabs,\n    view: DemoTabs.view,\n    viewInputs: tabs.styledViewInputs({\n      tabs: ['Overview', 'Settings', 'Billing'],\n      selectedValue: model.activeTab,\n      ariaLabel: 'Demo tabs',\n      panel: (tab, _render, h) => h.p([h.Class('p-3 text-sm')], ['Content for ' + tab]),\n    }, h),\n    toParentMessage: (message) => GotTabsMessage({ message }),\n  })\n`,
  },

  'radio-group': {
    path: 'example/radio-group.tsx',
    code: `import * as radioGroup from '@foldcn/registry/src/ui/radio-group'\nimport { PlanRadioGroup } from '../bundles'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  h.submodel({\n    slotId: model.radioGroup.id,\n    model: model.radioGroup,\n    view: PlanRadioGroup.view,\n    viewInputs: radioGroup.styledViewInputs({\n      options: ['Startup', 'Business', 'Enterprise'],\n      selectedValue: model.maybePlan,\n      ariaLabel: 'Plan',\n      option: (value, info, _render, h) =>\n        h.label([h.Class('flex items-center gap-2 rounded-md border p-3')], [\n          h.input([...info.input, h.Value(value)]),\n          h.span([...info.label], [value]),\n        ]),\n    }, h),\n    toParentMessage: (message) => GotRadioGroupMessage({ message }),\n  })\n`,
  },

  slider: {
    path: 'example/slider.tsx',
    code: `import * as slider from '@foldcn/registry/src/ui/slider'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  h.submodel({\n    slotId: model.sliderRating.id,\n    model: model.sliderRating,\n    view: slider.view,\n    viewInputs: slider.styledViewInputs({ value: model.sliderRatingValue, label: 'Rating', formatValue: (v) => v + ' / 10' }, h),\n    toParentMessage: (message) => GotSliderRatingMessage({ message }),\n  })\n`,
  },

  calendar: {
    path: 'example/calendar.tsx',
    code: `import * as calendar from '@foldcn/registry/src/ui/calendar'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  h.submodel({\n    slotId: model.calendar.id,\n    model: model.calendar,\n    view: calendar.view,\n    viewInputs: calendar.styledViewInputs({ maybeSelectedDate: model.maybeSelectedDate }, h),\n    toParentMessage: (message) => GotCalendarMessage({ message }),\n  })\n`,
  },

  'date-picker': {
    path: 'example/date-picker.tsx',
    code: `import * as datePicker from '@foldcn/registry/src/ui/date-picker'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  h.submodel({\n    slotId: model.datePicker.id,\n    model: model.datePicker,\n    view: datePicker.view,\n    viewInputs: datePicker.styledViewInputs({ maybeSelectedDate: model.maybePickedDate }, h),\n    toParentMessage: (message) => GotDatePickerMessage({ message }),\n  })\n`,
  },

  toast: {
    path: 'example/toast.tsx',
    code: `import * as ToastModule from '@foldcn/registry/src/ui/toast'\nimport { Toast } from '../toast'\nimport { button } from '@foldcn/registry/src/ui/button'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  h.div([], [\n    button({ onClick: ClickedShowInfoToast() }, 'Show toast', h),\n    h.submodel({\n      slotId: model.toast.id,\n      model: model.toast,\n      view: ToastModule.view,\n      viewInputs: {\n        position: 'BottomRight',\n        entryToView: (entry, handlers) =>\n          Toast.entryView({ entry, handlers, h, toContent: (e) => [h.span([], [e.title])] }),\n        entryClassName: ToastModule.toastEntryClass,\n      },\n      toParentMessage: (message) => GotToastMessage({ message }),\n    }),\n  ])\n`,
  },

  animation: {
    path: 'example/animation.tsx',
    code: `import * as animation from '@foldcn/registry/src/ui/animation'\nimport { button } from '@foldcn/registry/src/ui/button'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  h.div([h.Class('flex flex-col gap-3')], [\n    button({ onClick: ToggledAnimation() }, model.isAnimationShowing ? 'Hide' : 'Show', h),\n    h.submodel({\n      slotId: model.animation.id,\n      model: model.animation,\n      view: animation.view,\n      viewInputs: animation.styledViewInputs({ animateSize: true, content: [h.p([], ['Animated content'])] }),\n      toParentMessage: (message) => GotAnimationMessage({ message }),\n    }),\n  ])\n`,
  },

  'file-drop': {
    path: 'example/file-drop.tsx',
    code: `import * as fileDrop from '@foldcn/registry/src/ui/file-drop'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  h.submodel({\n    slotId: model.fileDrop.id,\n    model: model.fileDrop,\n    view: fileDrop.view,\n    viewInputs: fileDrop.styledViewInputs({\n      multiple: true,\n      accept: ['image/*'],\n      content: [h.p([h.Class('text-sm text-muted-foreground')], ['Drop images here or click to browse'])],\n    }, h),\n    toParentMessage: (message) => GotFileDropMessage({ message }),\n  })\n`,
  },

  'virtual-list': {
    path: 'example/virtual-list.tsx',
    code: `import * as virtualList from '@foldcn/registry/src/ui/virtual-list'\nimport { button } from '@foldcn/registry/src/ui/button'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  h.div([h.Class('flex flex-col gap-2')], [\n    button({ onClick: ClickedScrollToMiddle() }, 'Scroll to middle', h),\n    h.submodel({\n      slotId: model.virtualList.id,\n      model: model.virtualList,\n      view: virtualList.view<number>(),\n      viewInputs: virtualList.styledViewInputs({\n        items: Array.from({ length: 100_000 }, (_, i) => i),\n        itemToKey: (item) => String(item),\n        itemToView: (item) => h.div([h.Class('flex h-14 items-center border-b px-4')], ['Row ' + item]),\n        itemToRowHeightPx: () => 56,\n      }),\n      toParentMessage: (message) => GotVirtualListMessage({ message }),\n    }),\n  ])\n`,
  },

  'drag-and-drop': {
    path: 'example/drag-and-drop.tsx',
    code: `import * as DragAndDrop from '@foldcn/registry/src/ui/drag-and-drop'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  h.div([h.Class('flex gap-4')],\n    model.dragColumns.map((column) =>\n      h.div(DragAndDrop.droppable(column.id, column.label), [\n        h.p([h.Class('text-sm font-medium')], [column.label]),\n        ...column.cards.map((card, index) =>\n          h.div(DragAndDrop.draggable({ model: model.dragAndDrop, toParentMessage: (m) => GotDragAndDropMessage({ message: m }), itemId: card.id, containerId: column.id, index }, h), [\n            h.div([h.Class(DragAndDrop.dragCardClass)], [card.label]),\n          ])\n        ),\n      ])\n    )\n  )\n`,
  },

  'login-form': {
    path: 'example/login-form.tsx',
    code: `import { loginForm } from '@foldcn/registry/src/blocks/login-form/login-form'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  loginForm({\n    email: model.loginEmail,\n    onEmailInput: (value) => UpdatedLoginEmail({ value }),\n    password: model.loginPassword,\n    onPasswordInput: (value) => UpdatedLoginPassword({ value }),\n    onSubmit: SubmittedLogin(),\n  }, h)\n`,
  },

  'settings-page': {
    path: 'example/settings-page.tsx',
    code: `import { settingsPage } from '@foldcn/registry/src/blocks/settings-page/settings-page'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  settingsPage({\n    name: model.settingsName,\n    onNameInput: (value) => UpdatedSettingsName({ value }),\n    email: model.settingsEmail,\n    onEmailInput: (value) => UpdatedSettingsEmail({ value }),\n    bio: model.settingsBio,\n    onBioInput: (value) => UpdatedSettingsBio({ value }),\n    language: model.settingsLanguage,\n    onLanguageChange: (value) => UpdatedSettingsLanguage({ value }),\n    isEmailNotificationsEnabled: model.settingsEmailNotifs,\n    onToggleEmailNotifications: (v) => ToggledSettingsEmailNotifs({ value: v }),\n    isTwoFactorEnabled: model.settingsTfa,\n    onToggleTwoFactor: (v) => ToggledSettingsTfa({ value: v }),\n    onSave: ClickedSaveSettings(),\n  }, h)\n`,
  },

  'data-table': {
    path: 'example/data-table.tsx',
    code: `import { dataTable } from '@foldcn/registry/src/blocks/data-table/data-table'\nimport type { HtmlBuilder } from 'foldkit/html'\n\nexport const Example = (h: HtmlBuilder<Message>) =>\n  dataTable({\n    columns: [\n      { key: 'name', title: 'Name' },\n      { key: 'email', title: 'Email' },\n      { key: 'plan', title: 'Plan', align: 'right' },\n      { key: 'status', title: 'Status', align: 'right' },\n    ],\n    rows: filteredRows(model.tableSearch).map((row) => ({\n      id: row.id,\n      cells: { name: row.name, email: row.email, plan: row.plan, status: row.status },\n    })),\n    searchValue: model.tableSearch,\n    onSearchInput: (value) => UpdatedTableSearch({ value }),\n  }, h)\n`,
  },
}
