import { News, NewsRequired, PaginationResponse, RequestResponse } from 'types';

import { IFetch } from 'api/fetch';

import { NEWS_ENDPOINT } from './api';

export const NEWS_API = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getNewsItem: (id: number) => IFetch<News>({ method: 'GET', url: `${NEWS_ENDPOINT}/${String(id)}/` }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getNewsItems: (filters?: any) => IFetch<PaginationResponse<News>>({ method: 'GET', url: `${NEWS_ENDPOINT}/`, data: filters || {} }),
  createNewsItem: (item: NewsRequired) => IFetch<News>({ method: 'POST', url: `${NEWS_ENDPOINT}/`, data: item }),
  putNewsItem: (id: number, item: NewsRequired) => IFetch<News>({ method: 'PUT', url: `${NEWS_ENDPOINT}/${String(id)}/`, data: item }),
  deleteNewsItem: (id: number) => IFetch<RequestResponse>({ method: 'DELETE', url: `${NEWS_ENDPOINT}/${String(id)}/` }),
};
