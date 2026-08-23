import type { Html, HtmlBuilder } from 'foldkit/html'

import { button } from '@foldcn/registry/styles/default/ui/button'
import { Card } from '@foldcn/registry/styles/default/ui/card'
import { inputClass } from '@foldcn/registry/styles/default/ui/input'
import { label } from '@foldcn/registry/styles/default/ui/label'

import { defineSlice } from '../slice'
import type { Message, Model } from '../assemble'

export const cardView = (model: Model, h: HtmlBuilder<Message>): Html =>
  Card<Message>(
    { className: 'w-full max-w-sm' },
    [
      Card.header<Message>(
        {},
        [
          Card.title<Message>({}, ['Login to your account'], h),
          Card.description<Message>(
            {},
            ['Enter your email below to login to your account'],
            h,
          ),
          Card.action<Message>(
            {},
            [button<Message>({ variant: 'link' }, 'Sign Up', h)],
            h,
          ),
        ],
        h,
      ),
      Card.content<Message>(
        {},
        [
          h.form(
            [],
            [
              h.div(
                [h.Class('flex flex-col gap-6')],
                [
                  h.div(
                    [h.Class('grid gap-2')],
                    [
                      label<Message>({ forId: 'email' }, ['Email'], h),
                      h.input([
                        h.Id('email'),
                        h.Type('email'),
                        h.Placeholder('m@example.com'),
                        h.Required(true),
                        h.Class(inputClass),
                      ]),
                    ],
                  ),
                  h.div(
                    [h.Class('grid gap-2')],
                    [
                      h.div(
                        [h.Class('flex items-center')],
                        [
                          label<Message>({ forId: 'password' }, ['Password'], h),
                          h.a(
                            [
                              h.Href('#'),
                              h.Class(
                                'ml-auto inline-block text-sm underline-offset-4 hover:underline',
                              ),
                            ],
                            ['Forgot your password?'],
                          ),
                        ],
                      ),
                      h.input([
                        h.Id('password'),
                        h.Type('password'),
                        h.Required(true),
                        h.Class(inputClass),
                      ]),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
        h,
      ),
      Card.footer<Message>(
        { className: 'flex-col gap-2' },
        [
          button<Message>({ type: 'submit', className: 'w-full' }, 'Login', h),
          button<Message>(
            { variant: 'outline', className: 'w-full' },
            'Login with Google',
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
