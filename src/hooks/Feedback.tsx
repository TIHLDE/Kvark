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
      queryClient.invalidateQueries(FEEDBACK_QUERY_KEYS.all);
    },
  });
};

export const useDeleteFeedback = (): UseMutationResult<Feedback, RequestResponse, Feedback['id'], unknown> => {
  const queryClient = useQueryClient();
  return useMutation((feedbackId: Feedback['id']) => API.deleteFeedback(feedbackId), {
    onSuccess: () => {
      queryClient.invalidateQueries(FEEDBACK_QUERY_KEYS.all);
    },
  });
};

export const useFeedbackVotes = (filter?: any) =>
  useInfiniteQuery<PaginationResponse<Feedback>, RequestResponse>(
    FEEDBACK_QUERY_KEYS.list(filter),
    ({ pageParam = 1 }) =>
      API.getFeedbackVotes({ ...filter, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );