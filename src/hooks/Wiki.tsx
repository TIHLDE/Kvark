import { QueryClient, useInfiniteQuery, useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';

import { PaginationResponse, RequestResponse, WikiChildren, WikiPage, WikiRequired, WikiTree } from 'types';

import API from 'api/api';

export const WIKI_QUERY_KEY = 'wiki';
export const WIKI_QUERY_KEY_TREE = `${WIKI_QUERY_KEY}/tree`;

export const useWikiTree = () => useQuery<WikiTree, RequestResponse>(WIKI_QUERY_KEY_TREE, () => API.getWikiTree());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useWikiSearch = (filters: Record<string, any>) => {
  return useInfiniteQuery<PaginationResponse<WikiChildren>, RequestResponse>(
    [WIKI_QUERY_KEY, filters],
    ({ pageParam = 1 }) => API.getWikiSearch({ ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
      enabled: Boolean(Object.keys(filters).length),
    },
  );
};

export const useWikiPage = (path: string) => useQuery<WikiPage, RequestResponse>([WIKI_QUERY_KEY, path], () => API.getWikiPage(path));

export const useCreateWikiPage = (): UseMutationResult<WikiPage, RequestResponse, WikiRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newPage: WikiRequired) => API.createWikiPage(newPage), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(WIKI_QUERY_KEY);
      queryClient.setQueryData([WIKI_QUERY_KEY, data.path], data);
    },
  });
};

export const useUpdateWikiPage = (path: string): UseMutationResult<WikiPage, RequestResponse, WikiRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedPage: WikiRequired) => API.updateWikiPage(path, updatedPage), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(WIKI_QUERY_KEY);
      queryClient.invalidateQueries(WIKI_QUERY_KEY_TREE);
      queryClient.setQueryData([WIKI_QUERY_KEY, data.path], data);
    },
  });
};

export const useDeleteWikiPage = (path: string): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => API.deleteWikiPage(path), {
    onSuccess: () => {
      invalidate(queryClient);
    },
  });
};

const invalidate = (queryClient: QueryClient) => {
  queryClient.invalidateQueries(WIKI_QUERY_KEY);
  queryClient.invalidateQueries(WIKI_QUERY_KEY_TREE);
};
