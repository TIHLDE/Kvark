import { Notification, PaginationResponse } from 'types';

import { IFetch } from 'api/fetch';

import { NOTIFICATIONS_ENDPOINT } from './api';

export const NOTIFICATIONS_API = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getNotifications: (filters?: any) => IFetch<PaginationResponse<Notification>>({ method: 'GET', url: `${NOTIFICATIONS_ENDPOINT}/`, data: filters || {} }),
  updateNotification: (id: number, item: { read: boolean }) =>
    IFetch<Notification>({ method: 'PUT', url: `${NOTIFICATIONS_ENDPOINT}/${String(id)}/`, data: item }),
};
