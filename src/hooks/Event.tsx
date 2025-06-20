/* eslint-disable @typescript-eslint/no-explicit-any */

import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import API from '~/api/api';
import { FORM_QUERY_KEY } from '~/hooks/Form';
import { NOTIFICATION_QUERY_KEY } from '~/hooks/Notification';
import { USER_EVENTS_QUERY_KEY, USER_QUERY_KEY } from '~/hooks/User';
import type { Event, EventFavorite, EventList, EventMutate, PaginationResponse, PublicRegistration, Registration, RequestResponse, User } from '~/types';

export const EVENT_QUERY_KEYS = {
  all: ['event'],
  list: (filters?: any) => [...EVENT_QUERY_KEYS.all, 'list', ...(filters ? [filters] : [])],
  list_admin: (filters?: any) => [...EVENT_QUERY_KEYS.all, 'admin_list', ...(filters ? [filters] : [])],
  detail: (eventId: Event['id']) => [...EVENT_QUERY_KEYS.all, eventId],
  statistics: (eventId: Event['id']) => [...EVENT_QUERY_KEYS.detail(eventId), 'statistics'],
  favorite: (eventId: Event['id']) => [...EVENT_QUERY_KEYS.detail(eventId), 'favorite'],
  public_registrations: (eventId: Event['id']) => [...EVENT_QUERY_KEYS.detail(eventId), 'public_registrations'],
  registrations: {
    all: (eventId: Event['id']) => [...EVENT_QUERY_KEYS.detail(eventId), 'registrations'],
    list: (eventId: Event['id'], filters?: any) => [...EVENT_QUERY_KEYS.registrations.all(eventId), 'list', ...(filters ? [filters] : [])],
    detail: (eventId: Event['id'], userId: User['user_id']) => [...EVENT_QUERY_KEYS.registrations.all(eventId), userId],
  },
} as const;

export const useEventById = (eventId: Event['id']) =>
  useQuery({
    queryKey: EVENT_QUERY_KEYS.detail(eventId),
    queryFn: () => API.getEvent(eventId),
    enabled: eventId !== -1,
  });

export const useEvents = (filters?: any) =>
  useInfiniteQuery<PaginationResponse<EventList>, RequestResponse>({
    queryKey: EVENT_QUERY_KEYS.list(filters),
    queryFn: ({ pageParam }) => API.getEvents({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });

export const useEventsWhereIsAdmin = (filters?: any) =>
  useInfiniteQuery<PaginationResponse<EventList>, RequestResponse>({
    queryKey: EVENT_QUERY_KEYS.list_admin(filters),
    queryFn: ({ pageParam = 1 }) => API.getEventsWhereIsAdmin({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });

export const useCreateEvent = (): UseMutationResult<Event, RequestResponse, EventMutate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newEvent: EventMutate) => API.createEvent(newEvent),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.all });
      queryClient.setQueryData(EVENT_QUERY_KEYS.detail(data.id), data);
    },
  });
};

export const useUpdateEvent = (eventId: Event['id']): UseMutationResult<Event, RequestResponse, EventMutate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedEvent: EventMutate) => API.updateEvent(eventId, updatedEvent),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.all });
      queryClient.setQueryData(EVENT_QUERY_KEYS.detail(eventId), data);
    },
  });
};

export const useDeleteEvent = (eventId: Event['id']): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => API.deleteEvent(eventId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.all }),
  });
};

export const useEventIsFavorite = (eventId: Event['id']) =>
  useQuery({
    queryKey: EVENT_QUERY_KEYS.favorite(eventId),
    queryFn: () => API.getEventIsFavorite(eventId),
    enabled: eventId !== -1,
  });

export const useEventSetIsFavorite = (eventId: Event['id']): UseMutationResult<EventFavorite, RequestResponse, EventFavorite, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventFavorite) => API.setEventIsFavorite(eventId, eventFavorite),
    onSuccess: (data) => {
      queryClient.setQueryData(EVENT_QUERY_KEYS.favorite(eventId), data);
    },
  });
};

export const useSendGiftCardsToAttendees = (eventId: number): UseMutationResult<RequestResponse, RequestResponse, { files: File | File[] | Blob }, unknown> =>
  useMutation({
    mutationFn: ({ files }) => API.sendGiftCardsToAttendees(eventId, files),
  });

export const useNotifyEventRegistrations = (
  eventId: Event['id'],
): UseMutationResult<RequestResponse, RequestResponse, { title: string; message: string }, unknown> =>
  useMutation({
    mutationFn: ({ title, message }) => API.notifyEventRegistrations(eventId, title, message),
  });

export const useEventStatistics = (eventId: Event['id']) =>
  useQuery({
    queryKey: EVENT_QUERY_KEYS.statistics(eventId),
    queryFn: () => API.getEventStatistics(eventId),
  });

export const useEventRegistrations = (eventId: Event['id'], filters?: any) =>
  useInfiniteQuery<PaginationResponse<Registration>, RequestResponse>({
    queryKey: EVENT_QUERY_KEYS.registrations.list(eventId, filters),
    queryFn: ({ pageParam }) => API.getEventRegistrations(eventId, { ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });

/**
 * Get "public" event registrations, registrations which all members is allowed to see. Users can anonymize themself through their profile-settings
 * @param eventId The event-id
 * @param options UseInfiniteQueryOptions
 */
export const usePublicEventRegistrations = (eventId: Event['id'], options: { enabled?: boolean } = {}) =>
  useInfiniteQuery<PaginationResponse<PublicRegistration>, RequestResponse>({
    queryKey: EVENT_QUERY_KEYS.public_registrations(eventId),
    queryFn: ({ pageParam }) => API.getPublicEventRegistrations(eventId, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
    ...options,
  });

export const useEventRegistration = (eventId: Event['id'], userId: User['user_id']) =>
  useQuery({
    queryKey: EVENT_QUERY_KEYS.registrations.detail(eventId, userId),
    queryFn: () => API.getRegistration(eventId, userId),
    enabled: userId !== '',
    retry: false,
  });

export const useCreateEventRegistration = (eventId: Event['id']): UseMutationResult<Registration, RequestResponse, Partial<Registration>, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newRegistration: Partial<Registration>) => API.createRegistration(eventId, newRegistration),
    onSuccess: (data) => {
      const formId = queryClient.getQueryData<Event>(EVENT_QUERY_KEYS.detail(eventId))?.survey;
      if (formId) {
        queryClient.invalidateQueries({
          queryKey: [FORM_QUERY_KEY, formId],
        });
      }
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.detail(eventId) });
      queryClient.setQueryData(EVENT_QUERY_KEYS.registrations.detail(eventId, data.user_info.user_id), data);
      queryClient.invalidateQueries({
        queryKey: [USER_EVENTS_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [NOTIFICATION_QUERY_KEY],
      });
    },
  });
};

export const useCreateEventRegistrationAdmin = (eventId: Event['id']): UseMutationResult<Registration, RequestResponse, User['user_id'], unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: User['user_id']) => API.createRegistrationAdmin(eventId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.all });
    },
  });
};

export const useUpdateEventRegistration = (
  eventId: Event['id'],
): UseMutationResult<
  Registration,
  RequestResponse,
  {
    userId: User['user_id'];
    registration: Partial<Registration>;
  },
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ registration, userId }) => API.updateRegistration(eventId, registration, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.registrations.list(eventId) });
      queryClient.invalidateQueries({
        queryKey: [USER_EVENTS_QUERY_KEY],
      });
      queryClient.setQueryData(EVENT_QUERY_KEYS.registrations.detail(eventId, data.user_info.user_id), data);
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.all });
    },
  });
};

export const useDeleteEventRegistration = (eventId: Event['id']): UseMutationResult<RequestResponse, RequestResponse, User['user_id'], unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => API.deleteRegistration(eventId, userId),
    onSuccess: () => {
      const formId = queryClient.getQueryData<Event>(EVENT_QUERY_KEYS.detail(eventId))?.survey;
      if (formId) {
        queryClient.invalidateQueries({
          queryKey: [FORM_QUERY_KEY, formId],
        });
      }
      queryClient.removeQueries({ queryKey: EVENT_QUERY_KEYS.registrations.all(eventId) });
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.detail(eventId) });
      queryClient.invalidateQueries({
        queryKey: [USER_EVENTS_QUERY_KEY],
      });
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.all });
    },
  });
};
