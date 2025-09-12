import { infiniteQueryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '~/api/api';

export const NOTIFICATION_QUERY_KEY = 'notification';

export const notificationQueryOptions = infiniteQueryOptions({
  queryKey: [NOTIFICATION_QUERY_KEY],
  queryFn: ({ pageParam }) => API.getNotifications({ page: pageParam }),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => lastPage.next,
});

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, read }: { id: number; read: boolean }) => API.updateNotification(id, { read }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION_QUERY_KEY] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, read = true }: { ids: number[]; read?: boolean }) => Promise.allSettled(ids.map((id) => API.updateNotification(id, { read }))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION_QUERY_KEY] });
    },
  });
};
