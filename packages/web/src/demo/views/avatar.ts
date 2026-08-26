import { Option } from 'effect'
import { Schema as S } from 'effect'
import { evo } from 'foldkit/struct'
import { defineMessageUnion } from 'foldkit/message'
import type { Html, HtmlBuilder } from 'foldkit/html'
import * as Update from 'foldkit/update'

import * as AvatarModule from '../../generated/registry/ui/avatar'

import { defineSlice, type UpdateReturn } from '../slice'
import type { Model, Message as AppMessage } from '../assemble'

const Avatar = AvatarModule.Avatar

const Message = defineMessageUnion({
  GotTopShadcnAvatarMessage: { message: AvatarModule.Message },
  GotTopEvilrabbitAvatarMessage: { message: AvatarModule.Message },
  GotGroupShadcnAvatarMessage: { message: AvatarModule.Message },
  GotGroupMaxleiterAvatarMessage: { message: AvatarModule.Message },
  GotGroupEvilrabbitAvatarMessage: { message: AvatarModule.Message },
})

export const avatarView = (model: Model, h: HtmlBuilder<AppMessage>): Html =>
  h.div(
    [h.Class('flex flex-row flex-wrap items-center gap-6 md:gap-12')],
    [
      Avatar<AppMessage>(
        {},
        [
          Avatar.picture(
            {
              id: 'avatar-top-shadcn',
              src: 'https://github.com/shadcn.png',
              alt: '@shadcn',
              fallback: ['CN'],
              className: 'grayscale',
            },
            model.avatarTopShadcn,
            (message) => Message.GotTopShadcnAvatarMessage({ message }),
            h,
          ),
        ],
        h,
      ),
      Avatar<AppMessage>(
        {},
        [
          Avatar.picture(
            {
              id: 'avatar-top-evilrabbit',
              src: 'https://github.com/evilrabbit.png',
              alt: '@evilrabbit',
              fallback: ['ER'],
            },
            model.avatarTopEvilrabbit,
            (message) => Message.GotTopEvilrabbitAvatarMessage({ message }),
            h,
          ),
          Avatar.badge<AppMessage>({ className: 'bg-green-600 dark:bg-green-800' }, [], h),
        ],
        h,
      ),
      Avatar.group<AppMessage>(
        { className: 'grayscale' },
        [
          Avatar<AppMessage>(
            {},
            [
              Avatar.picture(
                {
                  id: 'avatar-group-shadcn',
                  src: 'https://github.com/shadcn.png',
                  alt: '@shadcn',
                  fallback: ['CN'],
                },
                model.avatarGroupShadcn,
                (message) => Message.GotGroupShadcnAvatarMessage({ message }),
                h,
              ),
            ],
            h,
          ),
          Avatar<AppMessage>(
            {},
            [
              Avatar.picture(
                {
                  id: 'avatar-group-maxleiter',
                  src: 'https://github.com/maxleiter.png',
                  alt: '@maxleiter',
                  fallback: ['LR'],
                },
                model.avatarGroupMaxleiter,
                (message) => Message.GotGroupMaxleiterAvatarMessage({ message }),
                h,
              ),
            ],
            h,
          ),
          Avatar<AppMessage>(
            {},
            [
              Avatar.picture(
                {
                  id: 'avatar-group-evilrabbit',
                  src: 'https://github.com/evilrabbit.png',
                  alt: '@evilrabbit',
                  fallback: ['ER'],
                },
                model.avatarGroupEvilrabbit,
                (message) => Message.GotGroupEvilrabbitAvatarMessage({ message }),
                h,
              ),
            ],
            h,
          ),
          Avatar.groupCount<AppMessage>({}, ['+3'], h),
        ],
        h,
      ),
    ],
  )

const fields = {
  avatarTopShadcn: AvatarModule.Model,
  avatarTopEvilrabbit: AvatarModule.Model,
  avatarGroupShadcn: AvatarModule.Model,
  avatarGroupMaxleiter: AvatarModule.Model,
  avatarGroupEvilrabbit: AvatarModule.Model,
}

const stateSchema = S.Struct(fields)
type State = typeof stateSchema.Type

const foldTopShadcn = Update.foldChild({
  update: AvatarModule.update,
  read: (model: State) => Option.some(model.avatarTopShadcn),
  write: (model, next) => evo(model, { avatarTopShadcn: () => next }),
  toParentMessage: (message) => Message.GotTopShadcnAvatarMessage({ message }),
})

const foldTopEvilrabbit = Update.foldChild({
  update: AvatarModule.update,
  read: (model: State) => Option.some(model.avatarTopEvilrabbit),
  write: (model, next) => evo(model, { avatarTopEvilrabbit: () => next }),
  toParentMessage: (message) => Message.GotTopEvilrabbitAvatarMessage({ message }),
})

const foldGroupShadcn = Update.foldChild({
  update: AvatarModule.update,
  read: (model: State) => Option.some(model.avatarGroupShadcn),
  write: (model, next) => evo(model, { avatarGroupShadcn: () => next }),
  toParentMessage: (message) => Message.GotGroupShadcnAvatarMessage({ message }),
})

const foldGroupMaxleiter = Update.foldChild({
  update: AvatarModule.update,
  read: (model: State) => Option.some(model.avatarGroupMaxleiter),
  write: (model, next) => evo(model, { avatarGroupMaxleiter: () => next }),
  toParentMessage: (message) => Message.GotGroupMaxleiterAvatarMessage({ message }),
})

const foldGroupEvilrabbit = Update.foldChild({
  update: AvatarModule.update,
  read: (model: State) => Option.some(model.avatarGroupEvilrabbit),
  write: (model, next) => evo(model, { avatarGroupEvilrabbit: () => next }),
  toParentMessage: (message) => Message.GotGroupEvilrabbitAvatarMessage({ message }),
})

export const slice = defineSlice({
  fields,
  init: {
    avatarTopShadcn: AvatarModule.init,
    avatarTopEvilrabbit: AvatarModule.init,
    avatarGroupShadcn: AvatarModule.init,
    avatarGroupMaxleiter: AvatarModule.init,
    avatarGroupEvilrabbit: AvatarModule.init,
  },
  messages: [
    Message.GotTopShadcnAvatarMessage,
    Message.GotTopEvilrabbitAvatarMessage,
    Message.GotGroupShadcnAvatarMessage,
    Message.GotGroupMaxleiterAvatarMessage,
    Message.GotGroupEvilrabbitAvatarMessage,
  ],
  handlers: (model: State) => ({
    GotTopShadcnAvatarMessage: (payload: typeof Message.GotTopShadcnAvatarMessage.Type): UpdateReturn =>
      foldTopShadcn(model, payload.message),
    GotTopEvilrabbitAvatarMessage: (
      payload: typeof Message.GotTopEvilrabbitAvatarMessage.Type,
    ): UpdateReturn => foldTopEvilrabbit(model, payload.message),
    GotGroupShadcnAvatarMessage: (
      payload: typeof Message.GotGroupShadcnAvatarMessage.Type,
    ): UpdateReturn => foldGroupShadcn(model, payload.message),
    GotGroupMaxleiterAvatarMessage: (
      payload: typeof Message.GotGroupMaxleiterAvatarMessage.Type,
    ): UpdateReturn => foldGroupMaxleiter(model, payload.message),
    GotGroupEvilrabbitAvatarMessage: (
      payload: typeof Message.GotGroupEvilrabbitAvatarMessage.Type,
    ): UpdateReturn => foldGroupEvilrabbit(model, payload.message),
  }),
  samples: [Message.GotTopShadcnAvatarMessage({ message: AvatarModule.Message.ImageErrored() })],
})
