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
    queryFn: async () => {
      // TODO: Probably do a helper that auto throws if error and returns the data
      // See comment example below
      const { data, error } = await photon.listEvents({ query: filters });
      if (error) throw error;
      return data;
    },

    // This is what i want. We could just do the boiler plate above
    // But i think it would be better if we handle everything in a
    // standardized way. Maybe we can do it with the generated client?
    /*
      queryFn: () => throwOnError(photon.listEvents({ query: filters }))
    */
  });

export const eventDetailQuery = (eventId: string) =>
  queryOptions({
    queryKey: [...eventKeys.details, eventId],
    queryFn: async () => {
      const { data, error } = await photon.getEvent({ path: { eventId } });
      if (error) throw error;
      return data;
    },
  });

export const favoriteEventsQuery = () =>
  queryOptions({
    queryKey: [...eventKeys.favorites],
    queryFn: async () => {
      const { data, error } = await photon.getFavoriteEvents();
      if (error) throw error;
      return data;
    },
  });

export const eventRegistrationsQuery = (eventId: string, filters?: EventRegistrationFilters) =>
  queryOptions({
    queryKey: [...eventKeys.registrations, eventId, filters].filter(Boolean), // Since the filters potentially can be undefined we remove it, this can backfire if eventId is an empty string or is also undefined
    queryFn: async () => {
      const { data, error } = await photon.listEventRegistrations({
        path: { eventId },
        query: filters,
      });
      if (error) throw error;
      return data;
    },
  });

export const eventFormsQuery = (eventId: string) =>
  queryOptions({
    queryKey: [...eventKeys.forms, eventId],
    queryFn: async () => {
      const { data, error } = await photon.listEventForms({
        path: { eventId },
      });
      if (error) throw error;
      return data;
    },
  });

// The type parameters should probably be more strongly typed if possible
// I know hono provides validators for path params as well
export const eventFormDetailQuery = (eventId: string, type: string) =>
  queryOptions({
    queryKey: [...eventKeys.forms, eventId, type],
    queryFn: async () => {
      const { data, error } = await photon.getEventForm({
        path: { eventId, type },
      });
      if (error) throw error;
      return data;
    },
  });
