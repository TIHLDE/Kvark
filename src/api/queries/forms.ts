import { infiniteQueryOptions, mutationOptions, queryOptions } from '@tanstack/react-query';
import { apiClient } from '~/api/api-client';
import { QueryParamsHelper } from '@tihlde/sdk/types';
import { CreateForm, UpdateForm, CreateSubmission } from '@tihlde/sdk';

const FormQueryKeys = {
  listInfinite: ['forms', 'list-infinite'] as const,
  list: ['forms', 'list-paged'] as const,
  detail: ['forms', 'detail'] as const,
  statistics: ['forms', 'statistics'] as const,
  submissions: ['forms', 'submissions'] as const,
} as const;

const DEFAULT_PAGE_SIZE = 25;

// -- Forms --

type FormListFilters = Omit<QueryParamsHelper<'get', '/api/forms'>, 'page' | 'pageSize'>;

export const getFormsQuery = (page: number, filters: FormListFilters = {}, pageSize: number = DEFAULT_PAGE_SIZE) =>
  queryOptions({
    queryKey: [...FormQueryKeys.list, page, pageSize, filters],
    queryFn: () =>
      apiClient.get('/api/forms', {
        searchParams: {
          page,
          pageSize,
          ...filters,
        },
      }),
  });

export const getFormsInfiniteQuery = (filters: FormListFilters = {}, pageSize: number = DEFAULT_PAGE_SIZE) =>
  infiniteQueryOptions({
    queryKey: [...FormQueryKeys.listInfinite, pageSize, filters],
    queryFn: ({ pageParam }) =>
      apiClient.get('/api/forms', {
        searchParams: {
          page: pageParam,
          pageSize,
          ...filters,
        },
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

export const getFormByIdQuery = (formId: string) =>
  queryOptions({
    queryKey: [...FormQueryKeys.detail, formId],
    queryFn: () =>
      apiClient.get('/api/forms/{id}', {
        params: { id: formId },
      }),
  });

export const getFormStatisticsQuery = (formId: string) =>
  queryOptions({
    queryKey: [...FormQueryKeys.statistics, formId],
    queryFn: () =>
      apiClient.get('/api/forms/{id}/statistics', {
        params: { id: formId },
      }),
  });

export const createFormMutation = mutationOptions({
  mutationFn: ({ data }: { data: CreateForm }) =>
    apiClient.post('/api/forms', {
      json: data,
    }),
  onSuccess(_, __, ___, ctx) {
    ctx.client.invalidateQueries({
      queryKey: [...FormQueryKeys.list],
      exact: false,
    });
    ctx.client.invalidateQueries({
      queryKey: [...FormQueryKeys.listInfinite],
      exact: false,
    });
  },
});

export const updateFormMutation = mutationOptions({
  mutationFn: ({ formId, data }: { formId: string; data: UpdateForm }) =>
    apiClient.patch('/api/forms/{id}', {
      params: { id: formId },
      json: data,
    }),
  onSuccess(_, vars, __, ctx) {
    ctx.client.invalidateQueries(getFormByIdQuery(vars.formId));
    ctx.client.invalidateQueries({
      queryKey: [...FormQueryKeys.list],
      exact: false,
    });
    ctx.client.invalidateQueries({
      queryKey: [...FormQueryKeys.listInfinite],
      exact: false,
    });
    ctx.client.invalidateQueries({
      queryKey: [...FormQueryKeys.statistics, vars.formId],
      exact: false,
    });
  },
});

export const deleteFormMutation = mutationOptions({
  mutationFn: ({ formId }: { formId: string }) =>
    apiClient.delete('/api/forms/{id}', {
      params: { id: formId },
    }),
  onSuccess(_, vars, __, ctx) {
    ctx.client.invalidateQueries(getFormByIdQuery(vars.formId));
    ctx.client.invalidateQueries({
      queryKey: [...FormQueryKeys.list],
      exact: false,
    });
    ctx.client.invalidateQueries({
      queryKey: [...FormQueryKeys.listInfinite],
      exact: false,
    });
  },
});

// -- Submissions --

type SubmissionListFilters = Omit<QueryParamsHelper<'get', '/api/forms/{formId}/submissions'>, 'page' | 'pageSize'>;

export const getFormSubmissionsQuery = (formId: string, page: number, filters: SubmissionListFilters = {}, pageSize: number = DEFAULT_PAGE_SIZE) =>
  queryOptions({
    queryKey: [...FormQueryKeys.submissions, formId, page, pageSize, filters],
    queryFn: () =>
      apiClient.get('/api/forms/{formId}/submissions', {
        params: { formId },
        searchParams: {
          page,
          pageSize,
          ...filters,
        },
      }),
  });

export const getFormSubmissionByIdQuery = (formId: string, submissionId: string) =>
  queryOptions({
    queryKey: [...FormQueryKeys.submissions, formId, submissionId],
    queryFn: () =>
      apiClient.get('/api/forms/{formId}/submissions/{id}', {
        params: { formId, id: submissionId },
      }),
  });

export const downloadFormSubmissionsQuery = (formId: string) =>
  queryOptions({
    queryKey: [...FormQueryKeys.submissions, formId, 'download'],
    queryFn: () =>
      apiClient.get('/api/forms/{formId}/submissions/download', {
        params: { formId },
      }),
    enabled: false,
  });

export const createSubmissionMutation = mutationOptions({
  mutationFn: ({ formId, data }: { formId: string; data: CreateSubmission }) =>
    apiClient.post('/api/forms/{formId}/submissions', {
      params: { formId },
      json: data,
    }),
  onSuccess(_, vars, __, ctx) {
    ctx.client.invalidateQueries({
      queryKey: [...FormQueryKeys.submissions, vars.formId],
      exact: false,
    });
    ctx.client.invalidateQueries({
      queryKey: [...FormQueryKeys.statistics, vars.formId],
      exact: false,
    });
  },
});

// TODO: deleteSubmissionWithReason requires a request body on DELETE,
// which the api client doesn't currently support. Add when the client supports it.
