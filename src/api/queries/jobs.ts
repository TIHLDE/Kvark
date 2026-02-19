import { infiniteQueryOptions, mutationOptions, queryOptions } from '@tanstack/react-query';
import type { CreateJobData, DeleteJobData, ListJobsData, ListJobsResponses, UpdateJobData } from '~/gen-client/types.gen';

import { photon } from '../photon';
import type { PathParams, Payload, QueryParams, RequestReturnType } from './helper';

export const jobKeys = {
  all: ['jobs'],
  infinite: ['jobs', 'infinite'],
  lists: ['jobs', 'list'],
  details: ['jobs', 'detail'],
} as const;

const DEFAULT_PAGE_SIZE = 20;

export type JobFilters = QueryParams<ListJobsData>;
export type JobListEntry = RequestReturnType<ListJobsResponses, 200>['items'][number];

export const listJobInfiniteQuery = (filters?: JobFilters) =>
  infiniteQueryOptions({
    queryKey: [...jobKeys.infinite, filters].filter(Boolean),
    queryFn: async ({ pageParam }) =>
      await photon.listJobs({
        throwOnError: true,
        query: {
          ...filters,
          page: pageParam,
          pageSize: DEFAULT_PAGE_SIZE,
        },
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

export const listJobsQuery = (page: number, pageSize = DEFAULT_PAGE_SIZE, filters: Omit<JobFilters, 'page' | 'pageSize'> = {}) =>
  queryOptions({
    queryKey: [...jobKeys.lists, page, pageSize, filters],
    queryFn: async () =>
      await photon.listJobs({
        throwOnError: true,
        query: { ...filters, page, pageSize },
      }),
    select: (data) => data.items,
  });

export const getJobQuery = (id: string) =>
  queryOptions({
    queryKey: [...jobKeys.details, id],
    queryFn: () => photon.getJob({ path: { id } }),
  });

export const createJobMutation = mutationOptions({
  mutationFn: (body: Payload<CreateJobData>) => photon.createJob({ body }),
  onMutate: async (_, ctx) => {
    await ctx.client.cancelQueries({ queryKey: jobKeys.lists });
  },
  onSuccess: (_, __, ___, ctx) => {
    ctx.client.invalidateQueries({ queryKey: jobKeys.lists });
  },
});

export const updateJobMutation = (id: PathParams<UpdateJobData>['id']) =>
  mutationOptions({
    mutationFn: (body: Payload<UpdateJobData>) => photon.updateJob({ path: { id }, body }),
    onMutate: async (_, ctx) => {
      await ctx.client.cancelQueries({ queryKey: jobKeys.all });
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: jobKeys.all });
    },
  });

export const deleteJobMutation = (id: PathParams<DeleteJobData>['id']) =>
  mutationOptions({
    mutationFn: () => photon.deleteJob({ path: { id } }),
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
