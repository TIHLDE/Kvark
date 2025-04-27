import { QueryClient, useInfiniteQuery, useMutation, type UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';
import API from '~/api/api';
import type { PaginationResponse, RequestResponse, WikiChildren, WikiPage, WikiRequired, WikiTree } from '~/types';

export const WIKI_QUERY_KEY = 'wiki';
export const WIKI_QUERY_KEY_TREE = `${WIKI_QUERY_KEY}/tree`;

export const useWikiTree = () =>
  useQuery<WikiTree, RequestResponse>({
    queryKey: [WIKI_QUERY_KEY_TREE],
    queryFn: () => API.getWikiTree(),
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useWikiSearch = (filters: Record<string, any>) => {
  return useInfiniteQuery<PaginationResponse<WikiChildren>, RequestResponse>({
    queryKey: [WIKI_QUERY_KEY, filters],
    queryFn: ({ pageParam }) => API.getWikiSearch({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
    enabled: Boolean(Object.keys(filters).length),
  });
};

export const useWikiPage = (path: string) =>
  useQuery<WikiPage, RequestResponse>({
    queryKey: [WIKI_QUERY_KEY, path],
    queryFn: () => API.getWikiPage(path),
  });

export const useCreateWikiPage = (): UseMutationResult<WikiPage, RequestResponse, WikiRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPage: WikiRequired) => API.createWikiPage(newPage),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [WIKI_QUERY_KEY],
      });
      queryClient.setQueryData([WIKI_QUERY_KEY, data.path], data);
    },
  });
};

export const useUpdateWikiPage = (path: string): UseMutationResult<WikiPage, RequestResponse, WikiRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedPage: WikiRequired) => API.updateWikiPage(path, updatedPage),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [WIKI_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [WIKI_QUERY_KEY_TREE],
      });
      queryClient.setQueryData([WIKI_QUERY_KEY, data.path], data);
    },
  });
};

export const useDeleteWikiPage = (path: string): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => API.deleteWikiPage(path),
    onSuccess: () => {
      invalidate(queryClient);
    },
  });
};

const invalidate = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    queryKey: [WIKI_QUERY_KEY],
  });
  queryClient.invalidateQueries({
    queryKey: [WIKI_QUERY_KEY_TREE],
  });
};
