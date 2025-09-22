import { useInfiniteQuery, useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import API from '~/api/api';
import type { createFeedbackInput, Feedback, PaginationResponse, RequestResponse } from '~/types';

type Filters = {
  search?: string;
  feedback_type?: string;
};

export const FEEDBACK_QUERY_KEYS = {
  all: ['feedbacks'],
  list: (filters?: Filters) => [...FEEDBACK_QUERY_KEYS.all, 'list', ...(filters ? [filters] : [])],
} as const;

export const useFeedbacks = (filters?: Filters) =>
  useInfiniteQuery<PaginationResponse<Feedback>, RequestResponse>({
    queryKey: FEEDBACK_QUERY_KEYS.list(filters),
    queryFn: ({ pageParam }) => API.getFeedbacks({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });

export const useCreateFeedback = (): UseMutationResult<createFeedbackInput, RequestResponse, createFeedbackInput, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => API.createFeedback(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.all });
    },
  });
};

export const useDeleteFeedback = (): UseMutationResult<Feedback, RequestResponse, Feedback['id'], unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (feedbackId: Feedback['id']) => API.deleteFeedback(feedbackId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.all });
    },
  });
};
