import { useMutation, useQuery, useQueryClient, UseMutationResult } from 'react-query';
import API from 'api/api';
import { EVENT_QUERY_KEY } from 'api/hooks/Event';
import { EventForm, Form, RequestResponse, Submission, SelectFieldSubmission } from 'types/Types';
import { FormFieldType } from 'types/Enums';

export const FORM_QUERY_KEY = 'form';

export const useFormById = (id: string) => {
  return useQuery<Form, RequestResponse>([FORM_QUERY_KEY, id], () => API.getForm(id), { enabled: id !== '-' });
};

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

export const useUpdateForm = (id: string): UseMutationResult<Form, RequestResponse, Form, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedForm: Form) => API.updateForm(id, updatedForm), {
    onSuccess: (data) => {
      queryClient.setQueryData([FORM_QUERY_KEY, id], data);
    },
  });
};

export const useDeleteForm = (id: string): UseMutationResult<RequestResponse, RequestResponse, undefined, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => API.deleteForm(id), {
    onSuccess: () => {
      const data = queryClient.getQueryData<Form>([FORM_QUERY_KEY, id]);
      if ((data as EventForm).event) {
        queryClient.invalidateQueries([EVENT_QUERY_KEY, (data as EventForm).event]);
      }
      queryClient.removeQueries([FORM_QUERY_KEY, id]);
    },
  });
};

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
