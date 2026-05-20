import { infiniteQueryOptions, mutationOptions, queryOptions } from '@tanstack/react-query';
import { apiClient } from '~/api/api-client';
import { QueryParamsHelper } from '@tihlde/sdk/types';
import { CreateNews, UpdateNews, CreateNewsReaction } from '@tihlde/sdk';

const NewsQueryKeys = {
  listInfinite: ['news', 'list-infinite'] as const,
  list: ['news', 'list-paged'] as const,
  detail: ['news', 'detail'] as const,
} as const;

const DEFAULT_PAGE_SIZE = 25;

type NewsListFilters = Omit<QueryParamsHelper<'get', '/api/news'>, 'page' | 'pageSize'>;

export const getNewsQuery = (page: number, filters: NewsListFilters = {}, pageSize: number = DEFAULT_PAGE_SIZE) =>
  queryOptions({
    queryKey: [...NewsQueryKeys.list, page, pageSize, filters],
    queryFn: () =>
      apiClient.get('/api/news', {
        searchParams: {
          page,
          pageSize,
          ...filters,
        },
      }),
  });

export const getNewsInfiniteQuery = (filters: NewsListFilters = {}, pageSize: number = DEFAULT_PAGE_SIZE) =>
  infiniteQueryOptions({
    queryKey: [...NewsQueryKeys.listInfinite, pageSize, filters],
    queryFn: ({ pageParam }) =>
      apiClient.get('/api/news', {
        searchParams: {
          page: pageParam,
          pageSize,
          ...filters,
        },
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

export const getNewsByIdQuery = (newsId: string) =>
  queryOptions({
    queryKey: [...NewsQueryKeys.detail, newsId],
    queryFn: () =>
      apiClient.get('/api/news/{id}', {
        params: { id: newsId },
      }),
  });

export const createNewsMutation = mutationOptions({
  mutationFn: ({ data }: { data: CreateNews }) =>
    apiClient.post('/api/news', {
      json: data,
    }),
  onSuccess(_, __, ___, ctx) {
    ctx.client.invalidateQueries({
      queryKey: [...NewsQueryKeys.list],
      exact: false,
    });
    ctx.client.invalidateQueries({
      queryKey: [...NewsQueryKeys.listInfinite],
      exact: false,
    });
  },
});

export const updateNewsMutation = mutationOptions({
  mutationFn: ({ newsId, data }: { newsId: string; data: UpdateNews }) =>
    apiClient.patch('/api/news/{id}', {
      params: { id: newsId },
      json: data,
    }),
  onSuccess(_, vars, __, ctx) {
    ctx.client.invalidateQueries(getNewsByIdQuery(vars.newsId));
    ctx.client.invalidateQueries({
      queryKey: [...NewsQueryKeys.list],
      exact: false,
    });
    ctx.client.invalidateQueries({
      queryKey: [...NewsQueryKeys.listInfinite],
      exact: false,
    });
  },
});

export const deleteNewsMutation = mutationOptions({
  mutationFn: ({ newsId }: { newsId: string }) =>
    apiClient.delete('/api/news/{id}', {
      params: { id: newsId },
    }),
  onSuccess(_, vars, __, ctx) {
    ctx.client.invalidateQueries(getNewsByIdQuery(vars.newsId));
    ctx.client.invalidateQueries({
      queryKey: [...NewsQueryKeys.list],
      exact: false,
    });
    ctx.client.invalidateQueries({
      queryKey: [...NewsQueryKeys.listInfinite],
      exact: false,
    });
  },
});

// -- Reactions --

export const createNewsReactionMutation = mutationOptions({
  mutationFn: ({ newsId, data }: { newsId: string; data: CreateNewsReaction }) =>
    apiClient.post('/api/news/{id}/reactions', {
      params: { id: newsId },
      json: data,
    }),
  onSuccess(_, vars, __, ctx) {
    ctx.client.invalidateQueries(getNewsByIdQuery(vars.newsId));
  },
});

export const deleteNewsReactionMutation = mutationOptions({
  mutationFn: ({ newsId }: { newsId: string }) =>
    apiClient.delete('/api/news/{id}/reactions', {
      params: { id: newsId },
    }),
  onSuccess(_, vars, __, ctx) {
    ctx.client.invalidateQueries(getNewsByIdQuery(vars.newsId));
  },
});
