import { RequestResponse, ShortLink } from 'types';

import { IFetch } from 'api/fetch';

import { SHORT_LINKS_ENDPOINT } from './api';

export const SHORTLINK_API = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getShortLinks: (filters?: any) => IFetch<Array<ShortLink>>({ method: 'GET', url: `${SHORT_LINKS_ENDPOINT}/`, data: filters || {} }),
  createShortLink: (item: ShortLink) => IFetch<ShortLink>({ method: 'POST', url: `${SHORT_LINKS_ENDPOINT}/`, data: item }),
  deleteShortLink: (slug: string) => IFetch<RequestResponse>({ method: 'DELETE', url: `${SHORT_LINKS_ENDPOINT}/${slug}/` }),
};
