import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type {
  CreateEventData,
  CreateEventFormData,
  CreateEventPaymentData,
  CreateEventRegistrationData,
  DeleteEventData,
  DeleteEventRegistrationData,
  GetEventFormData,
  ListEventRegistrationsData,
  ListEventsData,
  UpdateEventData,
  UpdateEventFavoriteData,
} from '~/gen-client/types.gen';

import { photon } from '../photon';
import type { PathParams, Payload, QueryParams } from './helper';

export type EventFilters = QueryParams<ListEventsData>;
export type EventRegistrationFilters = QueryParams<ListEventRegistrationsData>;
export type EventFormType = PathParams<GetEventFormData>['type'];

export const eventKeys = {
  all: ['events'],
  lists: ['events', 'list'],
  details: ['events', 'detail'],
  favorites: ['events', 'favorites'],
  registrations: ['events', 'registrations'],
  forms: ['events', 'forms'],
} as const;

export const listEventsQuery = (filters?: EventFilters) =>
  queryOptions({
    queryKey: [...eventKeys.lists, filters].filter(Boolean),
    queryFn: () => photon.listEvents({ query: filters }),
  });

export const getEventQuery = (eventId: string) =>
  queryOptions({
    queryKey: [...eventKeys.details, eventId],
    queryFn: () => photon.getEvent({ path: { eventId } }),
  });

export const getFavoriteEventsQuery = () =>
  queryOptions({
    queryKey: [...eventKeys.favorites],
    queryFn: () => photon.getFavoriteEvents(),
  });

export const listEventRegistrationsQuery = (eventId: string, filters?: EventRegistrationFilters) =>
  queryOptions({
    queryKey: [...eventKeys.registrations, eventId, filters].filter(Boolean),
    queryFn: () => photon.listEventRegistrations({ path: { eventId }, query: filters }),
  });

export const listEventFormsQuery = (eventId: string) =>
  queryOptions({
    queryKey: [...eventKeys.forms, eventId],
    queryFn: () => photon.listEventForms({ path: { eventId } }),
  });

export const getEventFormQuery = (eventId: string, type: EventFormType) =>
  queryOptions({
    queryKey: [...eventKeys.forms, eventId, type],
    queryFn: () => photon.getEventForm({ path: { eventId, type } }),
  });

export const createEventMutation = mutationOptions({
  mutationFn: (body: Payload<CreateEventData>) => photon.createEvent({ body }),
  onMutate: async (_, ctx) => {
    await ctx.client.cancelQueries({ queryKey: eventKeys.lists });
  },
  onSuccess: (_, __, ___, ctx) => {
    ctx.client.invalidateQueries({
      queryKey: eventKeys.lists,
    });
  },
});

export const updateEventMutation = (id: PathParams<UpdateEventData>['id']) =>
  mutationOptions({
    mutationFn: (body: Payload<UpdateEventData>) => photon.updateEvent({ path: { id }, body }),
    onMutate: async (_, ctx) => {
      await ctx.client.cancelQueries({ queryKey: eventKeys.all });
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: eventKeys.all });
    },
  });

export const deleteEventMutation = (eventId: PathParams<DeleteEventData>['eventId']) =>
  mutationOptions({
    mutationFn: () => photon.deleteEvent({ path: { eventId } }),
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: eventKeys.all });
    },
  });

export const updateEventFavoriteMutation = (id: PathParams<UpdateEventFavoriteData>['id']) =>
  mutationOptions({
    mutationFn: (body: Payload<UpdateEventFavoriteData>) => photon.updateEventFavorite({ path: { id }, body }),
    onMutate: async (_, ctx) => {
      await ctx.client.cancelQueries({ queryKey: eventKeys.favorites });
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: eventKeys.favorites });
    },
  });

export const createEventRegistrationMutation = (eventId: PathParams<CreateEventRegistrationData>['eventId']) =>
  mutationOptions({
    mutationFn: (body: Payload<CreateEventRegistrationData>) => photon.createEventRegistration({ path: { eventId }, body }),
    onMutate: async (_, ctx) => {
      await ctx.client.cancelQueries({ queryKey: eventKeys.registrations });
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: eventKeys.registrations });
    },
  });

export const deleteEventRegistrationMutation = (eventId: PathParams<DeleteEventRegistrationData>['eventId']) =>
  mutationOptions({
    mutationFn: () => photon.deleteEventRegistration({ path: { eventId } }),
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: eventKeys.registrations });
    },
  });

export const createEventPaymentMutation = (eventId: PathParams<CreateEventPaymentData>['eventId']) =>
  mutationOptions({
    mutationFn: (body: Payload<CreateEventPaymentData>) => photon.createEventPayment({ path: { eventId }, body }),
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: eventKeys.registrations });
    },
  });

export const createEventFormMutation = (eventId: PathParams<CreateEventFormData>['eventId']) =>
  mutationOptions({
    mutationFn: (body: Payload<CreateEventFormData>) => photon.createEventForm({ path: { eventId }, body }),
    onMutate: async (_, ctx) => {
      await ctx.client.cancelQueries({ queryKey: eventKeys.forms });
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: eventKeys.forms });
    },
  });
