import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { CreateFormData, CreateFormSubmissionData, DeleteFormData, DeleteFormSubmissionData, UpdateFormData } from '~/gen-client/types.gen';

import { photon } from '../photon';
import type { PathParams, Payload } from './helper';

export const formKeys = {
  all: ['forms'],
  lists: ['forms', 'list'],
  details: ['forms', 'detail'],
  statistics: ['forms', 'statistics'],
  submissions: ['forms', 'submissions'],
} as const;

export const listFormsQuery = () =>
  queryOptions({
    queryKey: formKeys.lists,
    queryFn: () => photon.listForms(),
  });

export const getFormQuery = (id: string) =>
  queryOptions({
    queryKey: [...formKeys.details, id],
    queryFn: () => photon.getForm({ path: { id } }),
  });

export const getFormStatisticsQuery = (id: string) =>
  queryOptions({
    queryKey: [...formKeys.statistics, id],
    queryFn: () => photon.getFormStatistics({ path: { id } }),
  });

export const listFormSubmissionsQuery = (formId: string) =>
  queryOptions({
    queryKey: [...formKeys.submissions, formId],
    queryFn: () => photon.listFormSubmissions({ path: { formId } }),
  });

export const getFormSubmissionQuery = (formId: string, id: string) =>
  queryOptions({
    queryKey: [...formKeys.submissions, formId, id],
    queryFn: () => photon.getFormSubmission({ path: { formId, id } }),
  });

export const createFormMutation = mutationOptions({
  mutationFn: (body: Payload<CreateFormData>) => photon.createForm({ body }),
  onMutate: async (_, ctx) => {
    await ctx.client.cancelQueries({ queryKey: formKeys.lists });
  },
  onSuccess: (_, __, ___, ctx) => {
    ctx.client.invalidateQueries({ queryKey: formKeys.lists });
  },
});

export const updateFormMutation = (id: PathParams<UpdateFormData>['id']) =>
  mutationOptions({
    mutationFn: (body: Payload<UpdateFormData>) => photon.updateForm({ path: { id }, body }),
    onMutate: async (_, ctx) => {
      await ctx.client.cancelQueries({ queryKey: formKeys.all });
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: formKeys.all });
    },
  });

export const deleteFormMutation = (id: PathParams<DeleteFormData>['id']) =>
  mutationOptions({
    mutationFn: () => photon.deleteForm({ path: { id } }),
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: formKeys.all });
    },
  });

export const createFormSubmissionMutation = (formId: PathParams<CreateFormSubmissionData>['formId']) =>
  mutationOptions({
    mutationFn: (body: Payload<CreateFormSubmissionData>) => photon.createFormSubmission({ path: { formId }, body }),
    onMutate: async (_, ctx) => {
      await ctx.client.cancelQueries({ queryKey: formKeys.submissions });
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: formKeys.submissions });
    },
  });

export const deleteFormSubmissionMutation = (formId: PathParams<DeleteFormSubmissionData>['formId'], id: PathParams<DeleteFormSubmissionData>['id']) =>
  mutationOptions({
    mutationFn: (body: Payload<DeleteFormSubmissionData>) => photon.deleteFormSubmission({ path: { formId, id }, body }),
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: formKeys.submissions });
    },
  });
