import { useInfiniteQuery, useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';

import { News, NewsRequired, PaginationResponse, RequestResponse } from 'types';

import { NEWS_API } from 'api/news';

export const EXPORT_QUERY_KEY = 'news';

export const useNewsById = (id: number) => {
  return useQuery<News, RequestResponse>([EXPORT_QUERY_KEY, id], () => NEWS_API.getNewsItem(id), { enabled: id !== -1 });
};

export const useNews = () => {
  return useInfiniteQuery<PaginationResponse<News>, RequestResponse>([EXPORT_QUERY_KEY], ({ pageParam = 1 }) => NEWS_API.getNewsItems({ page: pageParam }), {
    getNextPageParam: (lastPage) => lastPage.next,
  });
};

export const useCreateNews = (): UseMutationResult<News, RequestResponse, NewsRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newNewsItem: NewsRequired) => NEWS_API.createNewsItem(newNewsItem), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(EXPORT_QUERY_KEY);
      queryClient.setQueryData([EXPORT_QUERY_KEY, data.id], data);
    },
  });
};

export const useUpdateNews = (id: number): UseMutationResult<News, RequestResponse, NewsRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedNewsItem: NewsRequired) => NEWS_API.putNewsItem(id, updatedNewsItem), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(EXPORT_QUERY_KEY);
      queryClient.setQueryData([EXPORT_QUERY_KEY, id], data);
    },
  });
};

export const useDeleteNews = (id: number): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => NEWS_API.deleteNewsItem(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(EXPORT_QUERY_KEY);
    },
  });
};
