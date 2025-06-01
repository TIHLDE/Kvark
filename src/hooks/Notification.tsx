import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import API from '~/api/api';
import { RequestResponse } from '~/types';
import { useEffect } from 'react';

export const NOTIFICATION_QUERY_KEY = 'notification';

type GetNotificationData = Awaited<ReturnType<typeof API.getNotifications>>;

export const useNotifications = (modalOpen: boolean) => {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery<GetNotificationData, RequestResponse>({
    queryKey: [NOTIFICATION_QUERY_KEY],
    queryFn: ({ pageParam }) => API.getNotifications({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });

  useEffect(() => {
    if (!modalOpen) {
      return;
    }
    if (!query.data || !Array.isArray(query.data.pages)) {
      return;
    }

    const currentData = query.data;
    const unread = query.data.pages.flatMap((page) => page.results).filter(({ read }) => !read);
    if (unread.length) {
      // TODO: This should be a single API call to mark multiplle notifications as read
      // TODO: Need backend chaneges
      Promise.allSettled(unread.map(({ id }) => API.updateNotification(id, { read: true }))).then((results) => {
        const successfullyUpdatedIds = new Set(results.map((result, index) => (result.status === 'fulfilled' ? unread[index].id : null)).filter(Boolean));

        // Once all notifications are marked as read update the query data
        const newQueryData = currentData.pages.map((page) => ({
          ...page,
          results: page.results.map((v) => (successfullyUpdatedIds.has(v.id) ? { ...v, read: true } : v)),
        }));
        queryClient.setQueryData([NOTIFICATION_QUERY_KEY], newQueryData);
      });
    }
  }, [modalOpen, query.data]);

  return query;
};
