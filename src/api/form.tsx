import { Form, FormCreate, FormStatistics, FormUpdate, PaginationResponse, RequestResponse, Submission, UserSubmission } from 'types';

import { IFetch } from 'api/fetch';

import { FORMS_ENDPOINT, SUBMISSIONS_ENDPOINT } from './api';

export const FORM_API = {
  getForm: (formId: string) => IFetch<Form>({ method: 'GET', url: `${FORMS_ENDPOINT}/${formId}/` }),
  getFormTemplates: () => IFetch<Array<Form>>({ method: 'GET', url: `${FORMS_ENDPOINT}/` }),
  getFormStatistics: (formId: string) => IFetch<FormStatistics>({ method: 'GET', url: `${FORMS_ENDPOINT}/${formId}/statistics/` }),
  createForm: (item: FormCreate) => IFetch<Form>({ method: 'POST', url: `${FORMS_ENDPOINT}/`, data: item }),
  updateForm: (formId: string, item: FormUpdate) => IFetch<Form>({ method: 'PUT', url: `${FORMS_ENDPOINT}/${formId}/`, data: item }),
  deleteForm: (formId: string) => IFetch<RequestResponse>({ method: 'DELETE', url: `${FORMS_ENDPOINT}/${formId}/` }),

  // Submissions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSubmissions: (formId: string, filters?: any) =>
    IFetch<PaginationResponse<UserSubmission>>({ method: 'GET', url: `${FORMS_ENDPOINT}/${formId}/${SUBMISSIONS_ENDPOINT}/`, data: filters || {} }),
  createSubmission: (formId: string, submission: Submission) =>
    IFetch<Submission>({ method: 'POST', url: `${FORMS_ENDPOINT}/${formId}/${SUBMISSIONS_ENDPOINT}/`, data: submission }),
};
