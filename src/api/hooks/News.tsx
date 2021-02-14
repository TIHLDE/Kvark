import { useMutation, useInfiniteQuery, useQuery, useQueryClient, UseMutationResult } from 'react-query';
import API from 'api/api';
import { News, NewsRequired, PaginationResponse, RequestResponse } from 'types/Types';

const QUERY_KEY = 'news';

export const useNewsById = (id: number) => {
  return useQuery<News, RequestResponse>([QUERY_KEY, id], () => API.getNewsItem(id), { enabled: id !== -1 });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useNews = () => {
  return useInfiniteQuery<PaginationResponse<News>, RequestResponse>([QUERY_KEY], ({ pageParam = 1 }) => API.getNewsItems({ page: pageParam }), {
    getNextPageParam: (lastPage) => lastPage.next,
  });
};

export const useCreateNews = (): UseMutationResult<News, RequestResponse, NewsRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newNewsItem: NewsRequired) => API.createNewsItem(newNewsItem), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(QUERY_KEY);
      queryClient.setQueryData([QUERY_KEY, data.id], data);
    },
  });
};

export const useUpdateNews = (id: number): UseMutationResult<News, RequestResponse, NewsRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedNewsItem: NewsRequired) => API.putNewsItem(id, updatedNewsItem), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(QUERY_KEY);
      queryClient.setQueryData([QUERY_KEY, id], data);
    },
  });
};

export const useDeleteNews = (id: number): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => API.deleteNewsItem(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY);
    },
  });
};
