import { infiniteQueryOptions, mutationOptions, queryOptions } from '@tanstack/react-query';
import { apiClient } from '~/api/api-client';
import { QueryParamsHelper } from '@tihlde/sdk/types';
import { CreateApiKey, UpdateApiKey, ValidateApiKeyInput } from '@tihlde/sdk';

const ApiKeyQueryKeys = {
  listInfinite: ['api-keys', 'list-infinite'] as const,
  list: ['api-keys', 'list-paged'] as const,
  detail: ['api-keys', 'detail'] as const,
} as const;

const DEFAULT_PAGE_SIZE = 25;

type ApiKeyListFilters = Omit<QueryParamsHelper<'get', '/api/api-keys'>, 'page' | 'pageSize'>;

export const getApiKeysQuery = (page: number, filters: ApiKeyListFilters = {}, pageSize: number = DEFAULT_PAGE_SIZE) =>
  queryOptions({
    queryKey: [...ApiKeyQueryKeys.list, page, pageSize, filters],
    queryFn: () =>
      apiClient.get('/api/api-keys', {
        searchParams: {
          page,
          pageSize,
          ...filters,
        },
      }),
  });

export const getApiKeysInfiniteQuery = (filters: ApiKeyListFilters = {}, pageSize: number = DEFAULT_PAGE_SIZE) =>
  infiniteQueryOptions({
    queryKey: [...ApiKeyQueryKeys.listInfinite, pageSize, filters],
    queryFn: ({ pageParam }) =>
      apiClient.get('/api/api-keys', {
        searchParams: {
          page: pageParam,
          pageSize,
          ...filters,
        },
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

export const getApiKeyByIdQuery = (apiKeyId: string) =>
  queryOptions({
    queryKey: [...ApiKeyQueryKeys.detail, apiKeyId],
    queryFn: () =>
      apiClient.get('/api/api-keys/{id}', {
        params: { id: apiKeyId },
      }),
  });

export const createApiKeyMutation = mutationOptions({
  mutationFn: ({ data }: { data: CreateApiKey }) =>
    apiClient.post('/api/api-keys', {
      json: data,
    }),
  onSuccess(_, __, ___, ctx) {
    ctx.client.invalidateQueries({
      queryKey: [...ApiKeyQueryKeys.list],
      exact: false,
    });
    ctx.client.invalidateQueries({
      queryKey: [...ApiKeyQueryKeys.listInfinite],
      exact: false,
    });
  },
});

export const updateApiKeyMutation = mutationOptions({
  mutationFn: ({ apiKeyId, data }: { apiKeyId: string; data: UpdateApiKey }) =>
    apiClient.patch('/api/api-keys/{id}', {
      params: { id: apiKeyId },
      json: data,
    }),
  onSuccess(_, vars, __, ctx) {
    ctx.client.invalidateQueries(getApiKeyByIdQuery(vars.apiKeyId));
    ctx.client.invalidateQueries({
      queryKey: [...ApiKeyQueryKeys.list],
      exact: false,
    });
    ctx.client.invalidateQueries({
      queryKey: [...ApiKeyQueryKeys.listInfinite],
      exact: false,
    });
  },
});

export const deleteApiKeyMutation = mutationOptions({
  mutationFn: ({ apiKeyId }: { apiKeyId: string }) =>
    apiClient.delete('/api/api-keys/{id}', {
      params: { id: apiKeyId },
    }),
  onSuccess(_, vars, __, ctx) {
    ctx.client.invalidateQueries(getApiKeyByIdQuery(vars.apiKeyId));
    ctx.client.invalidateQueries({
      queryKey: [...ApiKeyQueryKeys.list],
      exact: false,
    });
    ctx.client.invalidateQueries({
      queryKey: [...ApiKeyQueryKeys.listInfinite],
      exact: false,
    });
  },
});

export const regenerateApiKeyMutation = mutationOptions({
  mutationFn: ({ apiKeyId }: { apiKeyId: string }) =>
    apiClient.post('/api/api-keys/{id}/regenerate', {
      params: { id: apiKeyId },
    }),
  onSuccess(_, vars, __, ctx) {
    ctx.client.invalidateQueries(getApiKeyByIdQuery(vars.apiKeyId));
  },
});

export const validateApiKeyMutation = mutationOptions({
  mutationFn: ({ data }: { data: ValidateApiKeyInput }) =>
    apiClient.post('/api/api-keys/validate', {
      json: data,
    }),
});
