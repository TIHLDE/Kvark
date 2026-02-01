import { queryOptions } from '@tanstack/react-query';
// TODO: We should probably have a utility type to extract query params etc from something
import type { ListEventRegistrationsData, ListEventsData } from '~/gen-client/types.gen';

import { photon } from '../photon';

export type EventFilters = ListEventsData['query'];
export type EventRegistrationFilters = ListEventRegistrationsData['query'];

export const eventKeys = {
  all: ['events'],
  lists: ['events', 'list'],
  details: ['events', 'detail'],
  favorites: ['events', 'favorites'],
  registrations: ['events', 'registrations'],
  forms: ['events', 'forms'],
} as const;

export const eventListQuery = (filters?: EventFilters) =>
  queryOptions({
    queryKey: [...eventKeys.lists, filters].filter(Boolean), // Since the filters potentially can be undefined we remove it
    queryFn: () => photon.listEvents({ query: filters }),
  });

export const eventDetailQuery = (eventId: string) =>
  queryOptions({
    queryKey: [...eventKeys.details, eventId],
    queryFn: () => photon.getEvent({ path: { eventId } }),
  });

export const favoriteEventsQuery = () =>
  queryOptions({
    queryKey: [...eventKeys.favorites],
    queryFn: () => photon.getFavoriteEvents(),
  });

export const eventRegistrationsQuery = (eventId: string, filters?: EventRegistrationFilters) =>
  queryOptions({
    queryKey: [...eventKeys.registrations, eventId, filters].filter(Boolean), // Since the filters potentially can be undefined we remove it, this can backfire if eventId is an empty string or is also undefined
    queryFn: () => photon.listEventRegistrations({ path: { eventId }, query: filters }),
  });

export const eventFormsQuery = (eventId: string) =>
  queryOptions({
    queryKey: [...eventKeys.forms, eventId],
    queryFn: () => photon.listEventForms({ path: { eventId } }),
  });

// The type parameters should probably be more strongly typed if possible
// I know hono provides validators for path params as well
export const eventFormDetailQuery = (eventId: string, type: 'survey' | 'evaluation') =>
  queryOptions({
    queryKey: [...eventKeys.forms, eventId, type],
    queryFn: () => photon.getEventForm({ path: { eventId, type } }),
  });
