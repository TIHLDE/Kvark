import {
  Category,
  Event,
  EventFavorite,
  EventList,
  EventMutate,
  EventStatistics,
  PaginationResponse,
  PublicRegistration,
  Registration,
  RequestResponse,
  User,
} from 'types';

import { IFetch } from 'api/fetch';

import { CATEGORIES_ENDPOINT, EVENT_REGISTRATIONS_ENDPOINT, EVENTS_ENDPOINT } from './api';

export const EVENT_API = {
  // Events
  getEvent: (eventId: Event['id']) => IFetch<Event>({ method: 'GET', url: `${EVENTS_ENDPOINT}/${String(eventId)}/` }),
  getEventStatistics: (eventId: Event['id']) => IFetch<EventStatistics>({ method: 'GET', url: `${EVENTS_ENDPOINT}/${String(eventId)}/statistics/` }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getEvents: (filters?: any) => IFetch<PaginationResponse<EventList>>({ method: 'GET', url: `${EVENTS_ENDPOINT}/`, data: filters || {} }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getEventsWhereIsAdmin: (filters?: any) => IFetch<PaginationResponse<EventList>>({ method: 'GET', url: `${EVENTS_ENDPOINT}/admin/`, data: filters || {} }),
  createEvent: (item: EventMutate) => IFetch<Event>({ method: 'POST', url: `${EVENTS_ENDPOINT}/`, data: item }),
  updateEvent: (eventId: Event['id'], item: EventMutate) => IFetch<Event>({ method: 'PUT', url: `${EVENTS_ENDPOINT}/${String(eventId)}/`, data: item }),
  deleteEvent: (eventId: Event['id']) => IFetch<RequestResponse>({ method: 'DELETE', url: `${EVENTS_ENDPOINT}/${String(eventId)}/` }),
  notifyEventRegistrations: (eventId: Event['id'], title: string, message: string) =>
    IFetch<RequestResponse>({ method: 'POST', url: `${EVENTS_ENDPOINT}/${String(eventId)}/notify/`, data: { title, message } }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPublicEventRegistrations: (eventId: Event['id'], filters?: any) =>
    IFetch<PaginationResponse<PublicRegistration>>({ method: 'GET', url: `${EVENTS_ENDPOINT}/${String(eventId)}/public_registrations/`, data: filters || {} }),
  sendGiftCardsToAttendees: (eventId: Event['id'], files: File | File[] | Blob) =>
    IFetch<RequestResponse>({ method: 'POST', url: `${EVENTS_ENDPOINT}/${String(eventId)}/mail-gift-cards/`, file: files }),
  getEventIsFavorite: (eventId: Event['id']) => IFetch<EventFavorite>({ method: 'GET', url: `${EVENTS_ENDPOINT}/${String(eventId)}/favorite/` }),
  setEventIsFavorite: (eventId: Event['id'], data: EventFavorite) =>
    IFetch<EventFavorite>({ method: 'PUT', url: `${EVENTS_ENDPOINT}/${String(eventId)}/favorite/`, data }),

  // Event registrations
  getRegistration: (eventId: Event['id'], userId: User['user_id']) =>
    IFetch<Registration>({ method: 'GET', url: `${EVENTS_ENDPOINT}/${String(eventId)}/${EVENT_REGISTRATIONS_ENDPOINT}/${userId}/` }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getEventRegistrations: (eventId: Event['id'], filters?: any) =>
    IFetch<PaginationResponse<Registration>>({
      method: 'GET',
      url: `${EVENTS_ENDPOINT}/${String(eventId)}/${EVENT_REGISTRATIONS_ENDPOINT}/`,
      data: filters || {},
    }),
  createRegistration: (eventId: Event['id'], item: Partial<Registration>) =>
    IFetch<Registration>({ method: 'POST', url: `${EVENTS_ENDPOINT}/${String(eventId)}/${EVENT_REGISTRATIONS_ENDPOINT}/`, data: item }),
  updateRegistration: (eventId: Event['id'], item: Partial<Registration>, userId: User['user_id']) =>
    IFetch<Registration>({ method: 'PUT', url: `${EVENTS_ENDPOINT}/${String(eventId)}/${EVENT_REGISTRATIONS_ENDPOINT}/${userId}/`, data: item }),
  deleteRegistration: (eventId: Event['id'], userId: User['user_id']) =>
    IFetch<RequestResponse>({ method: 'DELETE', url: `${EVENTS_ENDPOINT}/${String(eventId)}/${EVENT_REGISTRATIONS_ENDPOINT}/${userId}/` }),

  // Event Categories
  getCategories: () => IFetch<Array<Category>>({ method: 'GET', url: `${CATEGORIES_ENDPOINT}/` }),
};
