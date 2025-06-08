import { useMutation, useQuery, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import API from '~/api/api';
import type { RequestResponse, ShortLink } from '~/types';

export const SHORT_LINK_QUERY_KEY = 'short-link';

export const useShortLinks = () => {
  return useQuery<ShortLink[], RequestResponse>({
    queryKey: [SHORT_LINK_QUERY_KEY],
    queryFn: () => API.getShortLinks(),
  });
};

export const useCreateShortLink = (): UseMutationResult<ShortLink, RequestResponse, ShortLink, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item) => API.createShortLink(item),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SHORT_LINK_QUERY_KEY],
      });
    },
  });
};

export const useDeleteShortLink = (): UseMutationResult<RequestResponse, RequestResponse, string, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug) => API.deleteShortLink(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SHORT_LINK_QUERY_KEY],
      });
    },
  });
};
