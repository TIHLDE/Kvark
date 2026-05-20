import { infiniteQueryOptions, mutationOptions, queryOptions } from '@tanstack/react-query';
import { apiClient } from '~/api/api-client';
import { QueryParamsHelper } from '@tihlde/sdk/types';
import { CreateJob, UpdateJob } from '@tihlde/sdk';

const JobQueryKeys = {
  listInfinite: ['jobs', 'list-infinite'] as const,
  list: ['jobs', 'list-paged'] as const,
  detail: ['jobs', 'detail'] as const,
} as const;

const DEFAULT_PAGE_SIZE = 25;

type JobListFilters = Omit<QueryParamsHelper<'get', '/api/jobs'>, 'page' | 'pageSize'>;

export const getJobsQuery = (page: number, filters: JobListFilters = {}, pageSize: number = DEFAULT_PAGE_SIZE) =>
  queryOptions({
    queryKey: [...JobQueryKeys.list, page, pageSize, filters],
    queryFn: () =>
      apiClient.get('/api/jobs', {
        searchParams: {
          page,
          pageSize,
          ...filters,
        },
      }),
  });

export const getJobsInfiniteQuery = (filters: JobListFilters = {}, pageSize: number = DEFAULT_PAGE_SIZE) =>
  infiniteQueryOptions({
    queryKey: [...JobQueryKeys.listInfinite, pageSize, filters],
    queryFn: ({ pageParam }) =>
      apiClient.get('/api/jobs', {
        searchParams: {
          page: pageParam,
          pageSize,
          ...filters,
        },
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

export const getJobByIdQuery = (jobId: string) =>
  queryOptions({
    queryKey: [...JobQueryKeys.detail, jobId],
    queryFn: () =>
      apiClient.get('/api/jobs/{id}', {
        params: { id: jobId },
      }),
  });

export const createJobMutation = mutationOptions({
  mutationFn: ({ data }: { data: CreateJob }) =>
    apiClient.post('/api/jobs', {
      json: data,
    }),
  onSuccess(_, __, ___, ctx) {
    ctx.client.invalidateQueries({
      queryKey: [...JobQueryKeys.list],
      exact: false,
    });
    ctx.client.invalidateQueries({
      queryKey: [...JobQueryKeys.listInfinite],
      exact: false,
    });
  },
});

export const updateJobMutation = mutationOptions({
  mutationFn: ({ jobId, data }: { jobId: string; data: UpdateJob }) =>
    apiClient.patch('/api/jobs/{id}', {
      params: { id: jobId },
      json: data,
    }),
  onSuccess(_, vars, __, ctx) {
    ctx.client.invalidateQueries(getJobByIdQuery(vars.jobId));
    ctx.client.invalidateQueries({
      queryKey: [...JobQueryKeys.list],
      exact: false,
    });
    ctx.client.invalidateQueries({
      queryKey: [...JobQueryKeys.listInfinite],
      exact: false,
    });
  },
});

export const deleteJobMutation = mutationOptions({
  mutationFn: ({ jobId }: { jobId: string }) =>
    apiClient.delete('/api/jobs/{id}', {
      params: { id: jobId },
    }),
  onSuccess(_, vars, __, ctx) {
    ctx.client.invalidateQueries(getJobByIdQuery(vars.jobId));
    ctx.client.invalidateQueries({
      queryKey: [...JobQueryKeys.list],
      exact: false,
    });
    ctx.client.invalidateQueries({
      queryKey: [...JobQueryKeys.listInfinite],
      exact: false,
    });
  },
});
