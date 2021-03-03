import { useMutation, useInfiniteQuery, useQueryClient, UseMutationResult } from 'react-query';
import API from 'api/api';
import { Notification, PaginationResponse, RequestResponse } from 'types/Types';
import { USER_QUERY_KEY } from 'api/hooks/User';

export const NOTIFICATION_QUERY_KEY = 'notification';

export const useNotifications = () => {
  return useInfiniteQuery<PaginationResponse<Notification>, RequestResponse>(
    [NOTIFICATION_QUERY_KEY],
    ({ pageParam = 1 }) => API.getNotifications({ page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};

export const useUpdateNotification = (id: number): UseMutationResult<Notification, RequestResponse, boolean, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newReadState: boolean) => API.updateNotification(id, { read: newReadState }), {
    onSuccess: () => {
      queryClient.invalidateQueries(NOTIFICATION_QUERY_KEY);
      queryClient.invalidateQueries(USER_QUERY_KEY);
      // queryClient.setQueryData([NOTIFICATION_QUERY_KEY, id], data);
    },
  });
};
