import { PaginationResponse, RequestResponse, WikiChildren, WikiPage, WikiRequired, WikiTree } from 'types';

import { IFetch } from 'api/fetch';

import { WIKI_ENDPOINT } from './api';
export const WIKI_API = {
  getWikiTree: () => IFetch<WikiTree>({ method: 'GET', url: `${WIKI_ENDPOINT}/tree/` }),
  getWikiPage: (path: string) => IFetch<WikiPage>({ method: 'GET', url: `${WIKI_ENDPOINT}/${path}` }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getWikiSearch: (filters: any) => IFetch<PaginationResponse<WikiChildren>>({ method: 'GET', url: `${WIKI_ENDPOINT}/`, data: filters }),
  createWikiPage: (data: WikiRequired) => IFetch<WikiPage>({ method: 'POST', url: `${WIKI_ENDPOINT}/`, data }),
  updateWikiPage: (path: string, data: Partial<WikiPage>) => IFetch<WikiPage>({ method: 'PUT', url: `${WIKI_ENDPOINT}/${path}`, data }),
  deleteWikiPage: (path: string) => IFetch<RequestResponse>({ method: 'DELETE', url: `${WIKI_ENDPOINT}/${path}` }),
};
