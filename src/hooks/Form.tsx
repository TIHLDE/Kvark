import { keepPreviousData, useMutation, useQuery, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import API from '~/api/api';
import { EVENT_QUERY_KEYS } from '~/hooks/Event';
import { GROUPS_QUERY_KEYS } from '~/hooks/Group';
import { USER_FORMS_QUERY_KEY, USER_QUERY_KEY } from '~/hooks/User';
import {
  PaginationResponse,
  UserSubmission,
  type Form,
  type FormCreate,
  type FormUpdate,
  type RequestResponse,
  type SelectFieldSubmission,
  type Submission,
  type TextFieldSubmission,
} from '~/types';
import { FormFieldType, FormResourceType } from '~/types/Enums';

export const FORM_QUERY_KEY = 'form';
export const SUBMISSIONS_QUERY_KEY = 'submission';
export const STATISTICS_QUERY_KEY = 'statistics';
export const TEMPLATE_QUERY_KEY = 'templates';

export const formByIdQuery = (formId: string) => ({
  queryKey: [FORM_QUERY_KEY, formId],
  queryFn: () => API.getForm(formId),
});

export const useFormById = (formId: string) =>
  useQuery({
    ...formByIdQuery(formId),
    enabled: formId !== '-',
  });
export const useFormStatisticsById = (formId: string) =>
  useQuery({
    queryKey: [FORM_QUERY_KEY, formId, STATISTICS_QUERY_KEY],
    queryFn: () => API.getFormStatistics(formId),
    enabled: formId !== '-',
  });
export const useFormTemplates = () =>
  useQuery({
    queryKey: [FORM_QUERY_KEY, TEMPLATE_QUERY_KEY],
    queryFn: () => API.getFormTemplates(),
  });

export const useCreateForm = (): UseMutationResult<Form, RequestResponse, FormCreate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newForm) => API.createForm(newForm),
    onSuccess: (data) => {
      if (data.resource_type === FormResourceType.FORM) {
        queryClient.invalidateQueries({
          queryKey: [FORM_QUERY_KEY],
        });
      }
      if (data.resource_type === FormResourceType.EVENT_FORM) {
        queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.detail(data.event.id) });
      }
      if (data.resource_type === FormResourceType.GROUP_FORM) {
        queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.forms.all(data.group.slug) });
      }
      queryClient.setQueryData([FORM_QUERY_KEY, data.id], data);
    },
  });
};

export const useUpdateForm = (formId: string): UseMutationResult<Form, RequestResponse, FormUpdate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedForm: FormUpdate) => API.updateForm(formId, updatedForm),
    onSuccess: (data) => {
      if (data.resource_type === FormResourceType.EVENT_FORM) {
        queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.detail(data.event.id) });
      }
      if (data.resource_type === FormResourceType.GROUP_FORM) {
        queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.forms.all(data.group.slug) });
      }
      queryClient.invalidateQueries({
        queryKey: [FORM_QUERY_KEY, TEMPLATE_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [FORM_QUERY_KEY, formId],
      });
      queryClient.setQueryData([FORM_QUERY_KEY, formId], data);
    },
  });
};

export const useDeleteForm = (formId: string): UseMutationResult<RequestResponse, RequestResponse, undefined, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => API.deleteForm(formId),
    onSuccess: () => {
      const data = queryClient.getQueryData<Form>([FORM_QUERY_KEY, formId]);
      if (data?.resource_type === FormResourceType.EVENT_FORM) {
        queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.detail(data.event.id) });
      }
      if (data?.resource_type === FormResourceType.GROUP_FORM) {
        queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.forms.all(data.group.slug) });
      }
      queryClient.invalidateQueries({
        queryKey: [FORM_QUERY_KEY, TEMPLATE_QUERY_KEY],
      });
      queryClient.removeQueries({
        queryKey: [FORM_QUERY_KEY, formId],
      });
    },
  });
};

export const useFormSubmissions = (formId: string, page: number) =>
  useQuery<PaginationResponse<UserSubmission>, RequestResponse>({
    queryKey: [FORM_QUERY_KEY, formId, SUBMISSIONS_QUERY_KEY, { page }],
    queryFn: () => API.getSubmissions(formId, { page }),
    enabled: formId !== '-',
    placeholderData: keepPreviousData,
  });

export const useCreateSubmission = (formId: string): UseMutationResult<Submission, RequestResponse, Submission, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (submission) => API.createSubmission(formId, submission),
    onSuccess: () => {
      const data = queryClient.getQueryData<Form>([FORM_QUERY_KEY, formId]);
      if (data?.resource_type === FormResourceType.EVENT_FORM) {
        queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.detail(data.event.id) });
        queryClient.invalidateQueries({
          queryKey: [USER_FORMS_QUERY_KEY],
        });
        queryClient.invalidateQueries({
          queryKey: [USER_QUERY_KEY],
        });
      }
      if (data?.resource_type === FormResourceType.GROUP_FORM) {
        queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.forms.all(data.group.slug) });
      }
      queryClient.invalidateQueries({
        queryKey: [FORM_QUERY_KEY, formId],
      });
    },
  });
};

export const validateSubmissionInput = (submission: Submission, form: Form) => {
  submission.answers?.forEach((answer, index) => {
    const field = form.fields.find((field) => field.id === answer.field.id);
    if (field && field.type === FormFieldType.MULTIPLE_SELECT && field.required) {
      const ans = answer as SelectFieldSubmission;
      if (!ans.selected_options || !ans.selected_options.length) {
        throw new Error(`answers.${index}.selected_options`);
      }
    }
  });
};

export const validateSubmissionTextInput = (submission: Submission, form: Form) => {
  submission.answers?.forEach((answer, index) => {
    const field = form.fields.find((field) => field.id === answer.field.id);
    if (field && field.type === FormFieldType.TEXT_ANSWER && field.required) {
      const ans = answer as TextFieldSubmission;
      if (!ans.answer_text) {
        throw new Error(`answers.${index}.answer_text`);
      }
    }
  });
};
