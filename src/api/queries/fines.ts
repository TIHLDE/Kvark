import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { CreateFineData, DeleteFineData, UpdateFineData } from '~/gen-client/types.gen';

import { photon } from '../photon';
import type { PathParams, Payload } from './helper';

export const fineKeys = {
  all: ['fines'],
  lists: ['fines', 'list'],
  details: ['fines', 'detail'],
} as const;

export const listFinesQuery = (groupSlug: string) =>
  queryOptions({
    queryKey: [...fineKeys.lists, groupSlug],
    queryFn: () => photon.listFines({ path: { groupSlug } }),
  });

export const getFineQuery = (groupSlug: string, fineId: string) =>
  queryOptions({
    queryKey: [...fineKeys.details, groupSlug, fineId],
    queryFn: () => photon.getFine({ path: { groupSlug, fineId } }),
  });

export const createFineMutation = (groupSlug: PathParams<CreateFineData>['groupSlug']) =>
  mutationOptions({
    mutationFn: (body: Payload<CreateFineData>) => photon.createFine({ path: { groupSlug }, body }),
    onMutate: async (_, ctx) => {
      await ctx.client.cancelQueries({ queryKey: fineKeys.lists });
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: fineKeys.lists });
    },
  });

export const updateFineMutation = (groupSlug: PathParams<UpdateFineData>['groupSlug'], fineId: PathParams<UpdateFineData>['fineId']) =>
  mutationOptions({
    mutationFn: (body: Payload<UpdateFineData>) => photon.updateFine({ path: { groupSlug, fineId }, body }),
    onMutate: async (_, ctx) => {
      await ctx.client.cancelQueries({ queryKey: fineKeys.all });
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: fineKeys.all });
    },
  });

export const deleteFineMutation = (groupSlug: PathParams<DeleteFineData>['groupSlug'], fineId: PathParams<DeleteFineData>['fineId']) =>
  mutationOptions({
    mutationFn: () => photon.deleteFine({ path: { groupSlug, fineId } }),
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: fineKeys.all });
    },
  });
