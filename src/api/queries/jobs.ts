import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { CreateJobData, DeleteJobData, UpdateJobData } from '~/gen-client/types.gen';

import { photon } from '../photon';
import type { PathParams, Payload } from './helper';

export const jobKeys = {
  all: ['jobs'],
  lists: ['jobs', 'list'],
  details: ['jobs', 'detail'],
} as const;

export const listJobsQuery = () =>
  queryOptions({
    queryKey: jobKeys.lists,
    queryFn: () => photon.listJobs(),
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
