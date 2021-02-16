import { useMutation, useQuery, useQueryClient, UseMutationResult } from 'react-query';
import API from 'api/api';
import { Form, RequestResponse } from 'types/Types';

const QUERY_KEY = 'form';

export const useFormById = (id: string) => {
  return useQuery<Form, RequestResponse>([QUERY_KEY, id], () => API.getForm(id), { enabled: id !== '-' });
};

export const useCreateForm = (): UseMutationResult<Form, RequestResponse, Form, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newForm: Form) => API.createForm(newForm), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(QUERY_KEY);
      queryClient.setQueryData([QUERY_KEY, data.id], data);
    },
  });
};

export const useUpdateForm = (id: string): UseMutationResult<Form, RequestResponse, Form, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedForm: Form) => API.updateForm(id, updatedForm), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(QUERY_KEY);
      queryClient.setQueryData([QUERY_KEY, id], data);
    },
  });
};

// export const useForms = () => {
//   const createForm = useCallback(async (form: Form) => {
//     return API.createForm(form).then((response) => {
//       return !response.isError ? Promise.resolve(response.data) : Promise.reject(response.data);
//     });
//   }, []);

//   const updateForm = useCallback(async (id: string, form: Form) => {
//     return API.updateForm(id, form).then((response) => {
//       return !response.isError ? Promise.resolve(response.data) : Promise.reject(response.data);
//     });
//   }, []);

//   return { createForm, updateForm };
// };
