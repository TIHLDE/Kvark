import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '~/api/api';
import { USER_STRIKES_QUERY_KEY } from '~/hooks/User';
import type { PaginationResponse, RequestResponse, StrikeCreate, StrikeList } from '~/types';
import { toast } from 'sonner';

export const ALL_STRIKES_QUERY_KEY = 'strikes';

export const useCreateStrike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: StrikeCreate) => API.createStrike(item),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ALL_STRIKES_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [USER_STRIKES_QUERY_KEY, variables.user_id],
      });
      toast.success('Prikken ble opprettet');
    },

    onError: (e: RequestResponse) => {
      toast.error(e.detail);
    },
  });
};

export const useDeleteStrike = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation<RequestResponse, RequestResponse, string, unknown>({
    mutationFn: (id) => API.deleteStrike(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ALL_STRIKES_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [USER_STRIKES_QUERY_KEY, userId],
      });
      toast.success('Prikken ble slettet');
    },
    onError: (e) => {
      toast.error(e.detail);
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useStrikes = (filters?: any) => {
  return useInfiniteQuery<PaginationResponse<StrikeList>, RequestResponse>({
    queryKey: [ALL_STRIKES_QUERY_KEY, filters],
    queryFn: ({ pageParam }) => API.getStrikes({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });
};
