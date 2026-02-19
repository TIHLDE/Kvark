import { infiniteQueryOptions, mutationOptions, queryOptions } from '@tanstack/react-query';
import type {
  CreateNewsData,
  CreateNewsReactionData,
  DeleteNewsData,
  DeleteNewsReactionData,
  ListNewsData,
  ListNewsResponses,
  UpdateNewsData,
} from '~/gen-client/types.gen';

import { photon } from '../photon';
import type { PathParams, Payload, QueryParams, RequestReturnType } from './helper';

export const newsKeys = {
  all: ['news'],
  infinite: ['news', 'infinite'],
  lists: ['news', 'list'],
  details: ['news', 'detail'],
} as const;

const DEFAULT_PAGE_SIZE = 20;

export type NewsFilters = QueryParams<ListNewsData>;
export type NewsListEntry = RequestReturnType<ListNewsResponses, 200>['items'][number];

export const listNewsInfiniteQuery = (filters?: NewsFilters) =>
  infiniteQueryOptions({
    queryKey: [...newsKeys.infinite, filters].filter(Boolean),
    queryFn: async ({ pageParam }) =>
      await photon.listNews({
        throwOnError: true,
        query: {
          ...filters,
          page: pageParam,
          pageSize: DEFAULT_PAGE_SIZE,
        },
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
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
