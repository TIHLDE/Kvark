import { type UseMutationResult, useMutation, useQuery, useQueryClient } from 'react-query';
import API from '~/api/api';
import type { RequestResponse, ShortLink } from '~/types';

export const SHORT_LINK_QUERY_KEY = 'short-link';

export const useShortLinks = () => {
  return useQuery<Array<ShortLink>, RequestResponse>([SHORT_LINK_QUERY_KEY], () => API.getShortLinks());
};

export const useCreateShortLink = (): UseMutationResult<ShortLink, RequestResponse, ShortLink, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((item) => API.createShortLink(item), {
    onSuccess: () => {
      queryClient.invalidateQueries(SHORT_LINK_QUERY_KEY);
    },
  });
};

export const useDeleteShortLink = (): UseMutationResult<RequestResponse, RequestResponse, string, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((slug) => API.deleteShortLink(slug), {
    onSuccess: () => {
      queryClient.invalidateQueries(SHORT_LINK_QUERY_KEY);
    },
  });
};
