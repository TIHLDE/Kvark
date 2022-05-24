import { PaginationResponse, RequestResponse, Strike, StrikeCreate, StrikeList } from 'types';

import { IFetch } from 'api/fetch';

import { STRIKES_ENDPOINT } from './api';

export const STRIKES_API = {
  createStrike: (item: StrikeCreate) => IFetch<Strike>({ method: 'POST', url: `${STRIKES_ENDPOINT}/`, data: item }),
  deleteStrike: (id: string) => IFetch<RequestResponse>({ method: 'DELETE', url: `${STRIKES_ENDPOINT}/${id}/` }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getStrikes: (filters?: any) => IFetch<PaginationResponse<StrikeList>>({ method: 'GET', url: `${STRIKES_ENDPOINT}/`, data: filters || {} }),
};
