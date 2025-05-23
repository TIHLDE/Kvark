import API from '~/api/api';
import { USER_QUERY_KEY } from '~/hooks/User';
import type { Notification, PaginationResponse, RequestResponse } from '~/types';
import { useEffect, useState } from 'react';
import { type InfiniteData, type QueryKey, useInfiniteQuery, type UseInfiniteQueryOptions, useQueryClient } from 'react-query';

export const NOTIFICATION_QUERY_KEY = 'notification';

export const useNotifications = (
  options?: UseInfiniteQueryOptions<
    PaginationResponse<Notification>,
    RequestResponse,
    PaginationResponse<Notification>,
    PaginationResponse<Notification>,
    QueryKey
  >,
) => {
  const queryClient = useQueryClient();
  const [newQueryData, setNewQueryData] = useState<InfiniteData<PaginationResponse<Notification>> | null>(null);
  const enabled = options?.enabled || false;

  // Don't run `setQueryData` until the notifications are hidden (`options?.enabled === false`) to prevent unwanted UI-updates
  useEffect(() => {
    if (!enabled && newQueryData) {
      queryClient.setQueryData([NOTIFICATION_QUERY_KEY], () => newQueryData);
      setNewQueryData(null);
    }
  }, [enabled, newQueryData]);

  return useInfiniteQuery<PaginationResponse<Notification>, RequestResponse>(
    [NOTIFICATION_QUERY_KEY],
    ({ pageParam = 1 }) => API.getNotifications({ page: pageParam }),
    {
      ...options,
      getNextPageParam: (lastPage) => lastPage.next,
      onSuccess: async (data) => {
        // Get not read notifications
        const notifications = data.pages
          .map((page) => page.results)
          .flat()
          .filter((not) => !not.read);
        // If some not read notifications exists, mark them as read
        if (notifications.length) {
          await Promise.allSettled(notifications.map((notification) => API.updateNotification(notification.id, { read: true })));
          const newPagesArray = data.pages.map((page) => ({ ...page, results: page.results.map((val) => ({ ...val, read: true })) }));
          queryClient.invalidateQueries([USER_QUERY_KEY]);
          // Update the NewQueryData-variable.
          setNewQueryData({ pages: newPagesArray, pageParams: data.pageParams });
        }
      },
    },
  );
};
