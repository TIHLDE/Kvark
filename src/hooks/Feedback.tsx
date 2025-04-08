import { type UseMutationResult, useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import API from '~/api/api';
import type { Feedback, PaginationResponse, RequestResponse, createFeedbackInput } from '~/types';

type Filters = {
  search?: string;
  feedback_type?: string;
};

export const FEEDBACK_QUERY_KEYS = {
  all: ['feedbacks'] as const,
  list: (filters?: Filters) => [...FEEDBACK_QUERY_KEYS.all, 'list', ...(filters ? [filters] : [])] as const,
};

export const useFeedbacks = (filters?: Filters) =>
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
