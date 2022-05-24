import { PaginationResponse, RequestResponse, Toddel, ToddelMutate } from 'types';

import { IFetch } from 'api/fetch';

import { TODDEL_ENDPOINT } from './api';

export const TODDEL_API = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getToddels: (filters?: any) => IFetch<PaginationResponse<Toddel>>({ method: 'GET', url: `${TODDEL_ENDPOINT}/`, data: filters || {} }),
  createToddel: (data: ToddelMutate) => IFetch<Toddel>({ method: 'POST', url: `${TODDEL_ENDPOINT}/`, data }),
  updateToddel: (edition: Toddel['edition'], data: ToddelMutate) => IFetch<Toddel>({ method: 'PUT', url: `${TODDEL_ENDPOINT}/${edition}/`, data }),
  deleteToddel: (edition: Toddel['edition']) => IFetch<RequestResponse>({ method: 'DELETE', url: `${TODDEL_ENDPOINT}/${edition}/` }),
};
