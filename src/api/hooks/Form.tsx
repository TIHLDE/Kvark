import { useCallback } from 'react';
import API from 'api/api';
import { Form } from 'types/Types';

export const useForms = () => {
  const createForm = useCallback(async (form: Form) => {
    return API.createForm(form).then((response) => {
      return !response.isError ? Promise.resolve(response.data) : Promise.reject(response.data);
    });
  }, []);

  const updateForm = useCallback(async (id: string, form: Form) => {
    return API.updateForm(id, form).then((response) => {
      return !response.isError ? Promise.resolve(response.data) : Promise.reject(response.data);
    });
  }, []);

  return { createForm, updateForm };
};
