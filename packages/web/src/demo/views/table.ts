import type { Html, HtmlBuilder } from 'foldkit/html'

import { Table } from '@foldcn/registry/styles/default/ui/table'

import { defineSlice } from '../slice'
import type { Message, Model } from '../assemble'

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV006',
    paymentStatus: 'Pending',
    totalAmount: '$200.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV007',
    paymentStatus: 'Unpaid',
    totalAmount: '$300.00',
    paymentMethod: 'Credit Card',
  },
]

export const tableView = (model: Model, h: HtmlBuilder<Message>): Html =>
  Table(
    {},
    [
      Table.caption({}, ['A list of your recent invoices.'], h),
      Table.header(
        {},
        [
          Table.row(
            {},
            [
              Table.head({ className: 'w-[100px]' }, ['Invoice'], h),
              Table.head({}, ['Status'], h),
              Table.head({}, ['Method'], h),
              Table.head({ className: 'text-right' }, ['Amount'], h),
            ],
            h,
          ),
        ],
        h,
      ),
      Table.body(
        {},
        invoices.map((invoice) =>
          Table.row(
            {},
            [
              Table.cell({ className: 'font-medium' }, [invoice.invoice], h),
              Table.cell({}, [invoice.paymentStatus], h),
              Table.cell({}, [invoice.paymentMethod], h),
              Table.cell({ className: 'text-right' }, [invoice.totalAmount], h),
            ],
            h,
          ),
        ),
        h,
      ),
      Table.footer(
        {},
        [
          Table.row(
            {},
            [
              h.td(
                [
                  h.Class('cn-table-cell'),
                  h.DataAttribute('slot', 'table-cell'),
                  h.Colspan(3),
                ],
                ['Total'],
              ),
              Table.cell({ className: 'text-right' }, ['$2,500.00'], h),
            ],
            h,
          ),
        ],
        h,
      ),
    ],
    h,
  )

export const slice = defineSlice({
  fields: {},
  init: {},
  messages: [],
  handlers: (_model: unknown) => ({}),
})
