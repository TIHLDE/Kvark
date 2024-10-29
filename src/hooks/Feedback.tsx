import { useInfiniteQuery, useQuery } from 'react-query';

import { Feedback, PaginationResponse, RequestResponse } from 'types';

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
