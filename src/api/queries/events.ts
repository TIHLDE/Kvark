import { infiniteQueryOptions, mutationOptions, queryOptions } from '@tanstack/react-query';
import { apiClient } from '~/api/api-client';
import { QueryParamsHelper } from '@tihlde/sdk/types';
import { CreateEventSchema, UpdateEventSchema, CreatePaymentBody, CreateEventForm, UpdateFavoriteEvent } from '@tihlde/sdk';

const EventQueryKeys = {
  listInfinite: ['events', 'list-infinite'] as const,
  list: ['events', 'list-paged'] as const,
  detail: ['events', 'detail'] as const,
  favorites: ['events', 'favorites'] as const,
  registrations: ['events', 'registrations'] as const,
  forms: ['events', 'forms'] as const,
} as const;

const DEFAULT_PAGE_SIZE = 25;

type EventListFilters = Omit<QueryParamsHelper<'get', '/api/event'>, 'page' | 'pageSize'>;

export const getEventsQuery = (page: number, filters: EventListFilters = {}, pageSize: number = DEFAULT_PAGE_SIZE) =>
  queryOptions({
    queryKey: [...EventQueryKeys.list, page, pageSize, filters],
    queryFn: () =>
      apiClient.get('/api/event', {
        searchParams: {
          page,
          pageSize,
        },
      }),
  });

export const getEventsInfiniteQuery = (filters: EventListFilters = {}, pageSize: number = DEFAULT_PAGE_SIZE) =>
  infiniteQueryOptions({
    queryKey: [...EventQueryKeys.listInfinite, pageSize, filters],
    queryFn: ({ pageParam }) =>
      apiClient.get('/api/event', {
        searchParams: {
          page: pageParam,
          pageSize,
        },
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

export const getEventByIdQuery = (eventId: string) =>
  queryOptions({
    queryKey: [...EventQueryKeys.detail, eventId],
    queryFn: () =>
      apiClient.get(`/api/event/{eventId}`, {
        params: { eventId },
      }),
  });

export const updateEventMutation = mutationOptions({
  mutationFn: ({ eventId, data }: { eventId: string; data: UpdateEventSchema }) =>
    apiClient.put('/api/event/{id}', {
      params: { id: eventId },
      json: data,
    }),
  onSuccess(_, vars, __, ctx) {
    ctx.client.invalidateQueries(getEventByIdQuery(vars.eventId));
    ctx.client.invalidateQueries({
      queryKey: [...EventQueryKeys.list],
      exact: false,
    });
    ctx.client.invalidateQueries({
      queryKey: [...EventQueryKeys.listInfinite],
      exact: false,
    });
  },
});

export const deleteEventMutation = mutationOptions({
  mutationFn: ({ eventId }: { eventId: string }) =>
    apiClient.delete(`/api/event/{eventId}`, {
      params: { eventId: eventId },
    }),
  onSuccess(_, vars, __, ctx) {
    ctx.client.invalidateQueries(getEventByIdQuery(vars.eventId));
    ctx.client.invalidateQueries({
      queryKey: [...EventQueryKeys.list],
      exact: false,
    });
    ctx.client.invalidateQueries({
      queryKey: [...EventQueryKeys.listInfinite],
      exact: false,
    });
  },
});

export const createEventMutation = mutationOptions({
  mutationFn: ({ data }: { data: CreateEventSchema }) =>
    apiClient.post('/api/event', {
      json: data,
    }),
  onSuccess(_, __, ___, ctx) {
    ctx.client.invalidateQueries({
      queryKey: [...EventQueryKeys.list],
      exact: false,
    });
    ctx.client.invalidateQueries({
      queryKey: [...EventQueryKeys.listInfinite],
      exact: false,
    });
  },
});

// -- Favorites --

export const getFavoriteEventsQuery = () =>
  queryOptions({
    queryKey: [...EventQueryKeys.favorites],
    queryFn: () => apiClient.get('/api/event/favorite'),
  });

export const updateFavoriteEventMutation = mutationOptions({
  mutationFn: ({ eventId, data }: { eventId: string; data: UpdateFavoriteEvent }) =>
    apiClient.put('/api/event/favorite/{id}', {
      params: { id: eventId },
      json: data,
    }),
  onSuccess(_, __, ___, ctx) {
    ctx.client.invalidateQueries({
      queryKey: [...EventQueryKeys.favorites],
      exact: false,
    });
  },
});

// -- Registrations (Participants) --

type RegistrationListFilters = Omit<QueryParamsHelper<'get', '/api/event/{eventId}/registration'>, 'page' | 'pageSize'>;

export const getEventRegistrationsQuery = (eventId: string, page: number, filters: RegistrationListFilters = {}, pageSize: number = DEFAULT_PAGE_SIZE) =>
  queryOptions({
    queryKey: [...EventQueryKeys.registrations, eventId, page, pageSize, filters],
    queryFn: () =>
      apiClient.get('/api/event/{eventId}/registration', {
        params: { eventId },
        searchParams: {
          page,
          pageSize,
          ...filters,
        },
      }),
  });

export const registerForEventMutation = mutationOptions({
  mutationFn: ({ eventId }: { eventId: string }) =>
    apiClient.post('/api/event/{eventId}/registration', {
      params: { eventId },
    }),
  onSuccess(_, vars, __, ctx) {
    ctx.client.invalidateQueries({
      queryKey: [...EventQueryKeys.registrations, vars.eventId],
      exact: false,
    });
    ctx.client.invalidateQueries(getEventByIdQuery(vars.eventId));
  },
});

export const unregisterFromEventMutation = mutationOptions({
  mutationFn: ({ eventId }: { eventId: string }) =>
    apiClient.delete('/api/event/{eventId}/registration', {
      params: { eventId },
    }),
  onSuccess(_, vars, __, ctx) {
    ctx.client.invalidateQueries({
      queryKey: [...EventQueryKeys.registrations, vars.eventId],
      exact: false,
    });
    ctx.client.invalidateQueries(getEventByIdQuery(vars.eventId));
  },
});

// -- Payment --

export const createEventPaymentMutation = mutationOptions({
  mutationFn: ({ eventId, data }: { eventId: string; data: CreatePaymentBody }) =>
    apiClient.post('/api/event/{eventId}/payment', {
      params: { eventId },
      json: data,
    }),
});

// -- Event Forms --

export const getEventFormsQuery = (eventId: string) =>
  queryOptions({
    queryKey: [...EventQueryKeys.forms, eventId],
    queryFn: () =>
      apiClient.get('/api/event/{eventId}/forms', {
        params: { eventId },
      }),
  });

export const getEventFormByTypeQuery = (eventId: string, type: 'survey' | 'evaluation') =>
  queryOptions({
    queryKey: [...EventQueryKeys.forms, eventId, type],
    queryFn: () =>
      apiClient.get('/api/event/{eventId}/forms/{type}', {
        params: { eventId, type },
      }),
  });

export const createEventFormMutation = mutationOptions({
  mutationFn: ({ eventId, data }: { eventId: string; data: CreateEventForm }) =>
    apiClient.post('/api/event/{eventId}/forms', {
      params: { eventId },
      json: data,
    }),
  onSuccess(_, vars, __, ctx) {
    ctx.client.invalidateQueries({
      queryKey: [...EventQueryKeys.forms, vars.eventId],
      exact: false,
    });
  },
});
