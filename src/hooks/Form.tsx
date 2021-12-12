import { useMutation, useQuery, useQueryClient, UseMutationResult, useInfiniteQuery } from 'react-query';
import API from 'api/api';
import { USER_FORMS_QUERY_KEY, USER_QUERY_KEY } from 'hooks/User';
import { EVENT_QUERY_KEY } from 'hooks/Event';
import {
  FormCreate,
  EventFormCreate,
  EventForm,
  Form,
  FormUpdate,
  RequestResponse,
  PaginationResponse,
  UserSubmission,
  Submission,
  SelectFieldSubmission,
  FormStatistics,
  GroupFormCreate,
  GroupForm,
} from 'types';
import { FormFieldType } from 'types/Enums';
import { GROUPS_QUERY_KEYS } from 'hooks/Group';

export const FORM_QUERY_KEY = 'form';
export const SUBMISSIONS_QUERY_KEY = 'submission';
export const STATISTICS_QUERY_KEY = 'statistics';

export const useAllForms = () => {
  return useInfiniteQuery<PaginationResponse<Form>, RequestResponse>([FORM_QUERY_KEY], ({ pageParam = 1 }) => API.getForms({ all: true, page: pageParam }), {
    getNextPageParam: (lastPage) => lastPage.next,
  });
};

export const useFormById = (formId: string) =>
  useQuery<Form, RequestResponse>([FORM_QUERY_KEY, formId], () => API.getForm(formId), { enabled: formId !== '-' });
export const useFormStatisticsById = (formId: string) =>
  useQuery<FormStatistics, RequestResponse>([FORM_QUERY_KEY, formId, STATISTICS_QUERY_KEY], () => API.getFormStatistics(formId), { enabled: formId !== '-' });

export const useCreateForm = <T extends FormCreate | EventFormCreate | GroupFormCreate>(): UseMutationResult<Form, RequestResponse, T, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newForm: T) => API.createForm(newForm), {
    onSuccess: (data) => {
      if ((data as EventForm).event) {
        queryClient.invalidateQueries([EVENT_QUERY_KEY, (data as EventForm).event.id]);
      } else if ((data as GroupForm).group) {
        queryClient.invalidateQueries(GROUPS_QUERY_KEYS.forms.all((data as GroupForm).group.slug));
      }
      queryClient.setQueryData([FORM_QUERY_KEY, data.id], data);
    },
  });
};

export const useUpdateForm = (formId: string): UseMutationResult<Form, RequestResponse, FormUpdate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedForm: FormUpdate) => API.updateForm(formId, updatedForm), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([FORM_QUERY_KEY, formId]);
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
        queryClient.invalidateQueries([EVENT_QUERY_KEY, (data as EventForm).event.id]);
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

export const useCreateSubmission = (formId: string): UseMutationResult<Submission, RequestResponse, Submission, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((submission) => API.createSubmission(formId, submission), {
    onSuccess: () => {
      const data = queryClient.getQueryData<Form>([FORM_QUERY_KEY, formId]);
      if ((data as EventForm).event) {
        queryClient.invalidateQueries([EVENT_QUERY_KEY, (data as EventForm).event.id]);
      }
      queryClient.invalidateQueries([FORM_QUERY_KEY, formId]);
      queryClient.invalidateQueries([USER_FORMS_QUERY_KEY]);
      queryClient.invalidateQueries([USER_QUERY_KEY]);
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
