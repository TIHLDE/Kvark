import { useInfiniteQuery, useMutation, type UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';
import API from '~/api/api';
import type { News, NewsRequired, PaginationResponse, RequestResponse } from '~/types';

export const EXPORT_QUERY_KEY = 'news';

export const useNewsById = (id: number) => {
  return useQuery<News, RequestResponse>([EXPORT_QUERY_KEY, id], () => API.getNewsItem(id), { enabled: id !== -1 });
};

export const useNews = () => {
  return useInfiniteQuery<PaginationResponse<News>, RequestResponse>([EXPORT_QUERY_KEY], ({ pageParam = 1 }) => API.getNewsItems({ page: pageParam }), {
    getNextPageParam: (lastPage) => lastPage.next,
  });
};

export const useCreateNews = (): UseMutationResult<News, RequestResponse, NewsRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newNewsItem: NewsRequired) => API.createNewsItem(newNewsItem),
    onSuccess: (data) => {
      queryClient.invalidateQueries([EXPORT_QUERY_KEY]);
      queryClient.setQueryData([EXPORT_QUERY_KEY, data.id], data);
    },
  });
};

export const useUpdateNews = (id: number): UseMutationResult<News, RequestResponse, NewsRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedNewsItem: NewsRequired) => API.putNewsItem(id, updatedNewsItem),
    onSuccess: (data) => {
      queryClient.invalidateQueries([EXPORT_QUERY_KEY]);
      queryClient.setQueryData([EXPORT_QUERY_KEY, id], data);
    },
  });
};

export const useDeleteNews = (id: number): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => API.deleteNewsItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries([EXPORT_QUERY_KEY]);
    },
  });
};
