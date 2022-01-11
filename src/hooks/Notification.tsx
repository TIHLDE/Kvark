import { useMutation, useInfiniteQuery, useQueryClient, UseInfiniteQueryOptions, UseMutationResult, QueryKey } from 'react-query';
import API from 'api/api';
import { Notification, PaginationResponse, RequestResponse } from 'types';
import { USER_QUERY_KEY } from 'hooks/User';

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
  return useInfiniteQuery<PaginationResponse<Notification>, RequestResponse>(
    [NOTIFICATION_QUERY_KEY],
    ({ pageParam = 1 }) => API.getNotifications({ page: pageParam }),
    {
      ...options,
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};

export const useUpdateNotification = (id: number): UseMutationResult<Notification, RequestResponse, boolean, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newReadState: boolean) => API.updateNotification(id, { read: newReadState }), {
    onSuccess: () => {
      queryClient.invalidateQueries([NOTIFICATION_QUERY_KEY]);
      queryClient.invalidateQueries([USER_QUERY_KEY]);
    },
  });
};
