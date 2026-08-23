import { Option } from 'effect'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { codeBlock as registryCodeBlock } from '@foldcn/registry/styles/default/lib/code-block'
import { separator } from '@foldcn/registry/styles/default/ui/separator'

import { componentCount } from '../catalog'
import { Message } from '../message'
import type { Message as AppMessage } from '../message'
import type { Model } from '../model'

export const homeView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  h.div(
    [h.Class('flex-1')],
    [
      h.div(
        [
          h.Class(
            'mx-auto w-full max-w-3xl px-4 py-10 font-mono text-[15px] leading-[1.7] text-muted-foreground sm:px-6',
          ),
        ],
        [
          h.h1(
            [
              h.Class(
                "whitespace-pre-line text-3xl font-bold leading-[1.2] tracking-[-0.01em] text-foreground before:content-['#_'] before:font-normal before:text-muted-foreground",
              ),
            ],
            ['shadcn components for Foldkit.'],
          ),
          h.p(
            [h.Class('mt-5')],
            [
              'A registry of ',
              String(componentCount),
              ' copy-paste components built with @foldkit/ui, Foldkit TEA architecture, and Tailwind CSS.',
            ],
          ),
          registryCodeBlock<Message>(
            {
              path: 'Terminal',
              code: 'npx shadcn@latest add @foldcn/foldcn',
              lang: 'shell',
              onCopy: Message.ClickedCopy({ value: 'npx shadcn@latest add @foldcn/foldcn' }),
              isCopied: Option.exists(
                model.maybeCopiedValue,
                (v) => v === 'npx shadcn@latest add @foldcn/foldcn',
              ),
              className: 'mt-5',
            },
            h,
          ),
          h.p(
            [h.Class('mt-5')],
            [
              'or ',
              h.a(
                [
                  h.Href('https://foldkit.dev'),
                  h.Rel('noopener noreferrer'),
                  h.Class(
                    'text-foreground underline decoration-1 decoration-border underline-offset-[3px] hover:decoration-foreground',
                  ),
                ],
                ['learn Foldkit'],
              ),
              ' first.',
            ],
          ),
          h.h2(
            [
              h.Class(
                "mt-10 text-[1.375rem] font-semibold leading-[1.25] text-foreground before:content-['##_'] before:font-normal before:text-muted-foreground",
              ),
            ],
            ['Get started'],
          ),
          h.p(
            [h.Class('mt-5')],
            [
              'Two steps: register the ',
              h.code([h.Class('font-mono text-[0.9em]')], ['@foldcn']),
              ' namespace, then install the base style (the command above) to write the theme variables and core dependencies into your project.',
            ],
          ),
          h.ol(
            [h.Class('mt-5 list-decimal pl-5')],
            [
              h.li(
                [h.Class('mt-[0.375rem]')],
                [
                  h.div([], ['Register the namespace']),
                  registryCodeBlock<Message>(
                    {
                      path: 'Terminal',
                      code: 'npx shadcn@latest registry add @foldcn=https://foldcn.elianiva.com/r/{name}.json',
                      lang: 'shell',
                      onCopy: Message.ClickedCopy({
                        value:
                          'npx shadcn@latest registry add @foldcn=https://foldcn.elianiva.com/r/{name}.json',
                      }),
                      isCopied: Option.exists(
                        model.maybeCopiedValue,
                        (v) =>
                          v ===
                          'npx shadcn@latest registry add @foldcn=https://foldcn.elianiva.com/r/{name}.json',
                      ),
                      className: 'mt-2',
                    },
                    h,
                  ),
                ],
              ),
              h.li(
                [h.Class('mt-[0.375rem]')],
                [
                  h.div([], ['Install the base style']),
                  h.p(
                    [h.Class('mt-2')],
                    [
                      'Use the command above — it writes the theme variables and core dependencies into your project.',
                    ],
                  ),
                ],
              ),
            ],
          ),
          separator<Message>({ className: 'mt-8' }, h),
          h.p(
            [h.Class('mt-5')],
            [
              h.a(
                [
                  h.Href('/docs'),
                  h.Class(
                    'text-foreground underline decoration-1 decoration-border underline-offset-[3px] hover:decoration-foreground',
                  ),
                ],
                [`Browse all ${componentCount} components`],
              ),
            ],
          ),
        ],
      ),
    ],
  )

export const notFoundView = (h: HtmlBuilder<AppMessage>): Html =>
  h.div(
    [
      h.Class(
        'mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-32 text-center',
      ),
    ],
    [
      h.h1([h.Class('text-6xl font-bold tracking-tight')], ['404']),
      h.p([h.Class('mt-4 text-muted-foreground')], ['That page could not be found.']),
      h.div(
        [h.Class('mt-6')],
        [
          h.a(
            [
              h.Href('/'),
              h.Class(
                'inline-flex items-center rounded-full border border-border bg-muted/40 px-4 py-1.5 text-sm font-medium text-foreground underline-offset-4 hover:border-primary/40 hover:text-primary',
              ),
            ],
            ['Back to the registry'],
          ),
        ],
      ),
    ],
  )
