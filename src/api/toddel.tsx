import { IFetch } from '~/api/fetch';
import type { PaginationResponse, RequestResponse, Toddel, ToddelMutate } from '~/types';

export const TODDEL_ENDPOINT = 'toddel';

export const TODDEL_API = {
  // biome-ignore lint/suspicious/noExplicitAny: // TODO: Explain the disable of lint rule
  getToddels: (filters?: any) => IFetch<PaginationResponse<Toddel>>({ method: 'GET', url: `${TODDEL_ENDPOINT}/`, data: filters || {} }),
  createToddel: (data: ToddelMutate) => IFetch<Toddel>({ method: 'POST', url: `${TODDEL_ENDPOINT}/`, data }),
  updateToddel: (edition: Toddel['edition'], data: ToddelMutate) => IFetch<Toddel>({ method: 'PUT', url: `${TODDEL_ENDPOINT}/${edition}/`, data }),
  deleteToddel: (edition: Toddel['edition']) => IFetch<RequestResponse>({ method: 'DELETE', url: `${TODDEL_ENDPOINT}/${edition}/` }),
};
