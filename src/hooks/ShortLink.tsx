import { useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';

import { RequestResponse, ShortLink } from 'types';

import { SHORTLINK_API } from 'api/shortLink';

export const SHORT_LINK_QUERY_KEY = 'short-link';

export const useShortLinks = () => {
  return useQuery<Array<ShortLink>, RequestResponse>([SHORT_LINK_QUERY_KEY], () => SHORTLINK_API.getShortLinks());
};

export const useCreateShortLink = (): UseMutationResult<ShortLink, RequestResponse, ShortLink, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((item) => SHORTLINK_API.createShortLink(item), {
    onSuccess: () => {
      queryClient.invalidateQueries(SHORT_LINK_QUERY_KEY);
    },
  });
};

export const useDeleteShortLink = (): UseMutationResult<RequestResponse, RequestResponse, string, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((slug) => SHORTLINK_API.deleteShortLink(slug), {
    onSuccess: () => {
      queryClient.invalidateQueries(SHORT_LINK_QUERY_KEY);
    },
  });
};
