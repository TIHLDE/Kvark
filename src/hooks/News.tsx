import { useInfiniteQuery, useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';

import { News, NewsRequired, PaginationResponse, RequestResponse } from 'types';

import API from 'api/api';

export const NEWS_QUERY_KEY = 'news';

export const useNewsById = (id: number) => {
  return useQuery<News, RequestResponse>([NEWS_QUERY_KEY, id], () => API.getNewsItem(id), { enabled: id !== -1 });
};

export const useNews = () => {
  return useInfiniteQuery<PaginationResponse<News>, RequestResponse>([NEWS_QUERY_KEY], ({ pageParam = 1 }) => API.getNewsItems({ page: pageParam }), {
    getNextPageParam: (lastPage) => lastPage.next,
  });
};

export const useCreateNews = (): UseMutationResult<News, RequestResponse, NewsRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newNewsItem: NewsRequired) => API.createNewsItem(newNewsItem), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([NEWS_QUERY_KEY]);
      queryClient.setQueryData([NEWS_QUERY_KEY, data.id], data);
    },
  });
};

export const useUpdateNews = (id: number): UseMutationResult<News, RequestResponse, NewsRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedNewsItem: NewsRequired) => API.putNewsItem(id, updatedNewsItem), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([NEWS_QUERY_KEY]);
      queryClient.setQueryData([NEWS_QUERY_KEY, id], data);
    },
  });
};

export const useDeleteNews = (id: number): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => API.deleteNewsItem(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([NEWS_QUERY_KEY]);
    },
  });
};
