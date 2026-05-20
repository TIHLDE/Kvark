import { infiniteQueryOptions, mutationOptions, queryOptions } from '@tanstack/react-query';
import { apiClient } from '~/api/api-client';
import { QueryParamsHelper } from '@tihlde/sdk/types';

const NotificationQueryKeys = {
  listInfinite: ['notifications', 'list-infinite'] as const,
  list: ['notifications', 'list-paged'] as const,
} as const;

const DEFAULT_PAGE_SIZE = 25;

type NotificationListFilters = Omit<QueryParamsHelper<'get', '/api/notification'>, 'page' | 'pageSize'>;

export const getNotificationsQuery = (page: number, filters: NotificationListFilters = {}, pageSize: number = DEFAULT_PAGE_SIZE) =>
  queryOptions({
    queryKey: [...NotificationQueryKeys.list, page, pageSize, filters],
    queryFn: () =>
      apiClient.get('/api/notification', {
        searchParams: {
          page,
          pageSize,
          ...filters,
        },
      }),
  });

export const getNotificationsInfiniteQuery = (filters: NotificationListFilters = {}, pageSize: number = DEFAULT_PAGE_SIZE) =>
  infiniteQueryOptions({
    queryKey: [...NotificationQueryKeys.listInfinite, pageSize, filters],
    queryFn: ({ pageParam }) =>
      apiClient.get('/api/notification', {
        searchParams: {
          page: pageParam,
          pageSize,
          ...filters,
        },
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

export const deleteNotificationMutation = mutationOptions({
  mutationFn: ({ notificationId }: { notificationId: string }) =>
    apiClient.delete('/api/notification/{id}', {
      params: { id: notificationId },
    }),
  onSuccess(_, __, ___, ctx) {
    ctx.client.invalidateQueries({
      queryKey: [...NotificationQueryKeys.list],
      exact: false,
    });
    ctx.client.invalidateQueries({
      queryKey: [...NotificationQueryKeys.listInfinite],
      exact: false,
    });
  },
});

export const markNotificationReadMutation = mutationOptions({
  mutationFn: ({ notificationId }: { notificationId: string }) =>
    apiClient.patch('/api/notification/{id}/read', {
      params: { id: notificationId },
    }),
  onSuccess(_, __, ___, ctx) {
    ctx.client.invalidateQueries({
      queryKey: [...NotificationQueryKeys.list],
      exact: false,
    });
    ctx.client.invalidateQueries({
      queryKey: [...NotificationQueryKeys.listInfinite],
      exact: false,
    });
  },
});
