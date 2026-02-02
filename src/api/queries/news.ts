import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { CreateNewsData, CreateNewsReactionData, DeleteNewsData, DeleteNewsReactionData, UpdateNewsData } from '~/gen-client/types.gen';

import { photon } from '../photon';
import type { PathParams, Payload } from './helper';

export const newsKeys = {
  all: ['news'],
  lists: ['news', 'list'],
  details: ['news', 'detail'],
} as const;

export const listNewsQuery = () =>
  queryOptions({
    queryKey: newsKeys.lists,
    queryFn: () => photon.listNews(),
  });

export const getNewsQuery = (id: string) =>
  queryOptions({
    queryKey: [...newsKeys.details, id],
    queryFn: () => photon.getNews({ path: { id } }),
  });

export const createNewsMutation = mutationOptions({
  mutationFn: (body: Payload<CreateNewsData>) => photon.createNews({ body }),
  onMutate: async (_, ctx) => {
    await ctx.client.cancelQueries({ queryKey: newsKeys.lists });
  },
  onSuccess: (_, __, ___, ctx) => {
    ctx.client.invalidateQueries({ queryKey: newsKeys.lists });
  },
});

export const updateNewsMutation = (id: PathParams<UpdateNewsData>['id']) =>
  mutationOptions({
    mutationFn: (body: Payload<UpdateNewsData>) => photon.updateNews({ path: { id }, body }),
    onMutate: async (_, ctx) => {
      await ctx.client.cancelQueries({ queryKey: newsKeys.all });
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: newsKeys.all });
    },
  });

export const deleteNewsMutation = (id: PathParams<DeleteNewsData>['id']) =>
  mutationOptions({
    mutationFn: () => photon.deleteNews({ path: { id } }),
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: newsKeys.all });
    },
  });

export const createNewsReactionMutation = (id: PathParams<CreateNewsReactionData>['id']) =>
  mutationOptions({
    mutationFn: (body: Payload<CreateNewsReactionData>) => photon.createNewsReaction({ path: { id }, body }),
    onMutate: async (_, ctx) => {
      await ctx.client.cancelQueries({ queryKey: newsKeys.details });
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: newsKeys.details });
    },
  });

export const deleteNewsReactionMutation = (id: PathParams<DeleteNewsReactionData>['id']) =>
  mutationOptions({
    mutationFn: () => photon.deleteNewsReaction({ path: { id } }),
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: newsKeys.details });
    },
  });
