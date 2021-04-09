import { useMutation, useQuery, useQueryClient, UseMutationResult } from 'react-query';
import API from 'api/api';
import { EVENT_QUERY_KEY } from 'api/hooks/Event';
import { EventForm, Form, RequestResponse } from 'types/Types';

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
