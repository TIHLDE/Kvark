import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { DeleteNotificationData, ListNotificationsData, MarkNotificationReadData } from '~/gen-client/types.gen';

import { photon } from '../photon';
import type { PathParams, QueryParams } from './helper';

export type NotificationFilters = QueryParams<ListNotificationsData>;

export const notificationKeys = {
  all: ['notifications'],
  lists: ['notifications', 'list'],
} as const;

export const listNotificationsQuery = (filters?: NotificationFilters) =>
  queryOptions({
    queryKey: [...notificationKeys.lists, filters].filter(Boolean),
    queryFn: () => photon.listNotifications({ query: filters }),
  });

export const deleteNotificationMutation = (id: PathParams<DeleteNotificationData>['id']) =>
  mutationOptions({
    mutationFn: () => photon.deleteNotification({ path: { id } }),
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

export const markNotificationReadMutation = (id: PathParams<MarkNotificationReadData>['id']) =>
  mutationOptions({
    mutationFn: () => photon.markNotificationRead({ path: { id } }),
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
