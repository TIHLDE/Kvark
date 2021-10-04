import { useMutation, useQuery, useQueryClient } from 'react-query';
import API from 'api/api';
import { Strike, StrikeCreate, RequestResponse } from 'types';
import { useSnackbar } from 'hooks/Snackbar';
import { USER_STRIKES_QUERY_KEY } from 'hooks/User';

export const ALL_STRIKES_QUERY_KEY = 'strike';
export const STRIKE_USER_QUERY_KEY = 'strike_user';
export const STRIKE_EVENT_QUERY_KEY = 'strike_event';

export const useEventRegistrationStrikes = (eventId: number, userId: string) =>
  useQuery<Array<Strike>, RequestResponse>([STRIKE_USER_QUERY_KEY, userId, STRIKE_EVENT_QUERY_KEY, eventId], () =>
    API.getEventRegistrationStrikes(eventId, userId),
  );

export const useCreateStrike = () => {
  const queryClient = useQueryClient();
  const showSnackbar = useSnackbar();
  return useMutation<Strike, RequestResponse, StrikeCreate, unknown>((item) => API.createStrike(item), {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([ALL_STRIKES_QUERY_KEY]);
      queryClient.invalidateQueries([STRIKE_USER_QUERY_KEY, variables.user_id]);
      queryClient.invalidateQueries([USER_STRIKES_QUERY_KEY]);
      showSnackbar('Prikken ble opprettet', 'success');
    },
  });
};

export const useDeleteStrike = (userId?: string) => {
  const queryClient = useQueryClient();
  const showSnackbar = useSnackbar();
  return useMutation<RequestResponse, RequestResponse, string, unknown>((id) => API.deleteStrike(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([ALL_STRIKES_QUERY_KEY]);
      queryClient.invalidateQueries([USER_STRIKES_QUERY_KEY]);
      queryClient.invalidateQueries(userId ? [STRIKE_USER_QUERY_KEY, userId] : [STRIKE_USER_QUERY_KEY]);
      showSnackbar('Prikken ble slettet', 'success');
    },
  });
};
