import { useMutation, useInfiniteQuery, useQuery, useQueryClient, UseMutationResult } from 'react-query';
import API from 'api/api';
import { USER_EVENTS_QUERY_KEY } from 'api/hooks/User';
import { Event, EventRequired, EventCompact, Registration, PaginationResponse, RequestResponse } from 'types/Types';

export const EVENT_QUERY_KEY = 'event';
export const EVENTQUERY_KEY_REGISTRATION = 'event_registration';

export const useEventById = (eventId: number) => {
  return useQuery<Event, RequestResponse>([EVENT_QUERY_KEY, eventId], () => API.getEvent(eventId), { enabled: eventId !== -1 });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useEvents = (filters?: any) => {
  return useInfiniteQuery<PaginationResponse<EventCompact>, RequestResponse>(
    [EVENT_QUERY_KEY, filters],
    ({ pageParam = 1 }) => API.getEvents({ ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};

export const useCreateEvent = (): UseMutationResult<Event, RequestResponse, EventRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newEvent: EventRequired) => API.createEvent(newEvent), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(EVENT_QUERY_KEY);
      queryClient.setQueryData([EVENT_QUERY_KEY, data.id], data);
    },
  });
};

export const useUpdateEvent = (eventId: number): UseMutationResult<Event, RequestResponse, EventRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedEvent: EventRequired) => API.updateEvent(eventId, updatedEvent), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(EVENT_QUERY_KEY);
      queryClient.setQueryData([EVENT_QUERY_KEY, eventId], data);
    },
  });
};

export const useDeleteEvent = (eventId: number): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => API.deleteEvent(eventId), {
    onSuccess: () => {
      queryClient.invalidateQueries(EVENT_QUERY_KEY);
    },
  });
};

export const useEventRegistrations = (eventId: number) => {
  return useQuery<Array<Registration>, RequestResponse>([EVENT_QUERY_KEY, eventId, EVENTQUERY_KEY_REGISTRATION], () => API.getEventRegistrations(eventId));
};

export const useEventRegistration = (eventId: number, userId: string) => {
  return useQuery<Registration, RequestResponse>([EVENT_QUERY_KEY, eventId, EVENTQUERY_KEY_REGISTRATION, userId], () => API.getRegistration(eventId, userId), {
    enabled: userId !== '',
    retry: false,
  });
};

export const useCreateEventRegistration = (eventId: number): UseMutationResult<Registration, RequestResponse, Partial<Registration>, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newRegistration: Partial<Registration>) => API.createRegistration(eventId, newRegistration), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([EVENT_QUERY_KEY, eventId]);
      queryClient.setQueryData([EVENT_QUERY_KEY, eventId, EVENTQUERY_KEY_REGISTRATION, data.user_info.user_id], data);
      queryClient.invalidateQueries(USER_EVENTS_QUERY_KEY);
    },
  });
};

export const useUpdateEventRegistration = (
  eventId: number,
): UseMutationResult<
  Registration,
  RequestResponse,
  {
    userId: string;
    registration: Partial<Registration>;
  },
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation(({ registration, userId }) => API.updateRegistration(eventId, registration, userId), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([EVENT_QUERY_KEY, eventId]);
      queryClient.setQueryData([EVENT_QUERY_KEY, eventId, EVENTQUERY_KEY_REGISTRATION, data.registration_id], data);
    },
  });
};

export const useDeleteEventRegistration = (eventId: number): UseMutationResult<RequestResponse, RequestResponse, string, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((userId: string) => API.deleteRegistration(eventId, userId), {
    onSuccess: () => {
      queryClient.removeQueries([EVENT_QUERY_KEY, eventId]);
      queryClient.invalidateQueries(USER_EVENTS_QUERY_KEY);
    },
  });
};
