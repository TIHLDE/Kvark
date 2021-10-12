import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import API from 'api/api';
import { Strike, StrikeCreate, RequestResponse, PaginationResponse, StrikeList } from 'types';
import { useSnackbar } from 'hooks/Snackbar';
import { USER_STRIKES_QUERY_KEY } from 'hooks/User';

export const ALL_STRIKES_QUERY_KEY = 'strikes';

export const useCreateStrike = () => {
  const queryClient = useQueryClient();
  const showSnackbar = useSnackbar();
  return useMutation<Strike, RequestResponse, StrikeCreate, unknown>((item) => API.createStrike(item), {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([ALL_STRIKES_QUERY_KEY]);
      queryClient.invalidateQueries([USER_STRIKES_QUERY_KEY, variables.user_id]);
      showSnackbar('Prikken ble opprettet', 'success');
    },
  });
};

export const useDeleteStrike = (userId: string) => {
  const queryClient = useQueryClient();
  const showSnackbar = useSnackbar();
  return useMutation<RequestResponse, RequestResponse, string, unknown>((id) => API.deleteStrike(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([ALL_STRIKES_QUERY_KEY]);
      queryClient.invalidateQueries([USER_STRIKES_QUERY_KEY, userId]);
      showSnackbar('Prikken ble slettet', 'success');
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useStrikes = (filters?: any) => {
  return useInfiniteQuery<PaginationResponse<StrikeList>, RequestResponse>(
    [ALL_STRIKES_QUERY_KEY, filters],
    ({ pageParam = 1 }) => API.getStrikes({ ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};
