import { useInfiniteQuery, useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';

import { createFeedbackInput, Feedback, PaginationResponse, RequestResponse } from 'types';

import API from 'api/api';

export const FEEDBACK_QUERY_KEYS = {
  all: ['feedbacks'] as const,
  list: (filters?: any) => [...FEEDBACK_QUERY_KEYS.all, 'list', ...(filters ? [filters] : [])] as const,
};

export const useFeedbacks = (filters?: any) =>
  useInfiniteQuery<PaginationResponse<Feedback>, RequestResponse>(
    FEEDBACK_QUERY_KEYS.list(filters),
    ({ pageParam = 1 }) => API.getFeedbacks({ ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );

export const useCreateFeedback = (): UseMutationResult<createFeedbackInput, RequestResponse, createFeedbackInput, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((data) => API.createFeedback(data), {
    onSuccess: () => {
      queryClient.invalidateQueries([FEEDBACK_QUERY_KEYS])
    },
  });
}
