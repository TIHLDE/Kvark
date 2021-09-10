import { useMutation, useQuery, useQueryClient, UseMutationResult } from 'react-query';
import API from 'api/api';
import { EVENT_QUERY_KEY } from 'hooks/Event';
import { EventForm, Form, RequestResponse, PaginationResponse, UserSubmission, Submission, SelectFieldSubmission, FormStatistics } from 'types';
import { FormFieldType } from 'types/Enums';

export const FORM_QUERY_KEY = 'form';
export const SUBMISSIONS_QUERY_KEY = 'submission';

export const useFormById = (formId: string) =>
  useQuery<Form, RequestResponse>([FORM_QUERY_KEY, formId], () => API.getForm(formId), { enabled: formId !== '-' });
export const useFormStatisticsById = (formId: string) =>
  useQuery<FormStatistics, RequestResponse>([FORM_QUERY_KEY, formId, 'statistics'], () => API.getFormStatistics(formId), { enabled: formId !== '-' });

export const useCreateForm = (): UseMutationResult<Form, RequestResponse, Form, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newForm: Form) => API.createForm(newForm), {
    onSuccess: (data) => {
      if ((data as EventForm).event) {
        queryClient.invalidateQueries([EVENT_QUERY_KEY, (data as EventForm).event]);
      }
      queryClient.invalidateQueries(FORM_QUERY_KEY);
      queryClient.setQueryData([FORM_QUERY_KEY, data.id], data);
    },
  });
};

export const useUpdateForm = (formId: string): UseMutationResult<Form, RequestResponse, Form, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedForm: Form) => API.updateForm(formId, updatedForm), {
    onSuccess: (data) => {
      queryClient.setQueryData([FORM_QUERY_KEY, formId], data);
    },
  });
};

export const useDeleteForm = (formId: string): UseMutationResult<RequestResponse, RequestResponse, undefined, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => API.deleteForm(formId), {
    onSuccess: () => {
      const data = queryClient.getQueryData<Form>([FORM_QUERY_KEY, formId]);
      if ((data as EventForm).event) {
        queryClient.invalidateQueries([EVENT_QUERY_KEY, (data as EventForm).event]);
      }
      queryClient.removeQueries([FORM_QUERY_KEY, formId]);
    },
  });
};

export const useFormSubmissions = (formId: string, page: number) =>
  useQuery<PaginationResponse<UserSubmission>, RequestResponse>(
    [FORM_QUERY_KEY, formId, SUBMISSIONS_QUERY_KEY, { page }],
    () => API.getSubmissions(formId, { page }),
    {
      enabled: formId !== '-',
      keepPreviousData: true,
    },
  );

export const useCreateSubmission = (formId: string): UseMutationResult<Submission, RequestResponse, Submission, unknown> =>
  useMutation((submission) => API.createSubmission(formId, submission));

export const validateSubmissionInput = (submission: Submission, form: Form) => {
  submission.answers.forEach((answer, index) => {
    const field = form.fields.find((field) => field.id === answer.field.id);
    if (field && field.type === FormFieldType.MULTIPLE_SELECT && field.required) {
      const ans = answer as SelectFieldSubmission;
      if (!ans.selected_options || !ans.selected_options.length) {
        throw new Error(`answers.${index}.selected_options`);
      }
    }
  });
};
