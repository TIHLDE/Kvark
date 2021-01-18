import { createContext, ReactNode, useContext, useState, useEffect, useReducer, useCallback } from 'react';
import { parseISO, differenceInSeconds } from 'date-fns';
import API from 'api/api';
import { Event, EventRequired, Registration, RequestResponse } from 'types/Types';
import { useInterval } from 'api/hooks/Utils';
import { useUser } from 'api/hooks/User';

export type Action =
  | { type: 'set'; payload: Array<Event> }
  | { type: 'add'; payload: Event }
  | { type: 'update'; payload: Event }
  | { type: 'remove'; payload: number };

export type Dispatch = (action: Action) => void;
export type EventProviderProps = { children: ReactNode };

const EventStateContext = createContext<Array<Event> | undefined>(undefined);
const EventDispatchContext = createContext<Dispatch | undefined>(undefined);

const eventReducer = (state: Array<Event>, action: Action): Array<Event> => {
  switch (action.type) {
    case 'set': {
      return action.payload;
    }
    case 'add': {
      if (state.find((item) => item.id === action.payload.id)) {
        return state.map((eventItem) => {
          let returnValue = { ...eventItem };
          if (eventItem.id === action.payload.id) {
            returnValue = { ...returnValue, ...action.payload };
          }
          return returnValue;
        });
      } else {
        return [...state, action.payload];
      }
    }
    case 'update': {
      return state.map((eventItem) => {
        let returnValue = { ...eventItem };
        if (eventItem.id === action.payload.id) {
          returnValue = { ...returnValue, ...action.payload };
        }
        return returnValue;
      });
    }
    case 'remove': {
      return state.filter((eventItem) => eventItem.id !== action.payload);
    }
  }
};

export const EventProvider = ({ children }: EventProviderProps) => {
  const [state, dispatch] = useReducer(eventReducer, []);
  return (
    <EventStateContext.Provider value={state}>
      <EventDispatchContext.Provider value={dispatch}>{children}</EventDispatchContext.Provider>
    </EventStateContext.Provider>
  );
};

const useEventState = () => {
  const context = useContext(EventStateContext);
  if (context === undefined) {
    throw new Error('useEventState must be used within a EventProvider');
  }
  return context;
};

const useEventDispatch = () => {
  const context = useContext(EventDispatchContext);
  if (context === undefined) {
    throw new Error('useEventDispatch must be used within a EventProvider');
  }
  return context;
};

export const useEventById = (id: number) => {
  const { getEventById } = useEvent();
  const event = useEventState();
  const [eventData, setEventData] = useState<Event | null>(null);
  const [error, setError] = useState<RequestResponse | null>(null);
  const [refreshDelay, setRefreshDelay] = useState<number | null>(300 * 1000);

  useInterval(() => {
    getEventById(id, true);
  }, refreshDelay);

  useEffect(() => {
    getEventById(id)
      .then((data) => {
        if (data.sign_up) {
          const SEC = 1000;
          const MIN = 60;
          const difference = differenceInSeconds(new Date(), parseISO(data.start_registration_at));
          if (-(6 * MIN) < difference && difference < -MIN) {
            setRefreshDelay(MIN * SEC);
          } else if (-MIN <= difference && difference <= 2 * MIN) {
            setRefreshDelay(10 * SEC);
          } else if (2 * MIN < difference && difference < 10 * MIN) {
            setRefreshDelay(30 * SEC);
          } else {
            setRefreshDelay(5 * MIN * SEC);
          }
        } else {
          setRefreshDelay(null);
        }
        setEventData(data);
        setError(null);
      })
      .catch((error: RequestResponse) => {
        setError(error);
        setEventData(null);
      });
  }, [id, getEventById, event]);

  return [eventData, error] as const;
};

export const useEvent = () => {
  const event = useEventState();
  const dispatch = useEventDispatch();
  const { addUserEvent, removeUserEvent } = useUser();

  const getEvents = useCallback(async (filters = null) => {
    return API.getEvents(filters).then((response) => {
      return !response.isError ? Promise.resolve(response.data) : Promise.reject(response.data);
    });
  }, []);

  const getExpiredEvents = useCallback(async () => {
    return API.getExpiredEvents().then((response) => {
      return !response.isError ? Promise.resolve(response.data) : Promise.reject(response.data);
    });
  }, []);

  const getEventById = useCallback(
    async (id: number, forceReload?: boolean): Promise<Event> => {
      const eventItem = event.find((item) => item.id === Number(id));
      if (eventItem && !forceReload) {
        return Promise.resolve(eventItem);
      } else {
        return API.getEvent(id).then((response) => {
          if (response.isError) {
            return Promise.reject(response.data);
          } else {
            dispatch({ type: 'add', payload: response.data });
            return Promise.resolve(response.data);
          }
        });
      }
    },
    [event, dispatch],
  );

  const createEvent = useCallback(
    async (eventData: EventRequired) => {
      return API.createEvent(eventData).then((response) => {
        if (response.isError) {
          return Promise.reject(response.data);
        } else {
          dispatch({
            type: 'add',
            payload: response.data,
          });
          return Promise.resolve(response.data);
        }
      });
    },
    [dispatch],
  );

  const updateEvent = useCallback(
    async (id: number, eventData: Partial<Event>) => {
      return API.updateEvent(id, eventData).then((response) => {
        if (response.isError) {
          return Promise.reject(response.data);
        } else {
          dispatch({
            type: 'update',
            payload: response.data,
          });
          return Promise.resolve(response.data);
        }
      });
    },
    [dispatch],
  );

  const deleteEvent = useCallback(
    async (id: number) => {
      return API.deleteEvent(id).then((response) => {
        if (response.isError) {
          return Promise.reject(response.data);
        } else {
          dispatch({
            type: 'remove',
            payload: id,
          });
          return Promise.resolve(response.data);
        }
      });
    },
    [dispatch],
  );

  const updateAttendedStatus = useCallback(async (eventId: number, newAttendedStatus: boolean, userId: string) => {
    return API.putAttended(eventId, { has_attended: newAttendedStatus }, userId).then((response) => {
      return !response.isError ? Promise.resolve(response.data) : Promise.reject(response.data);
    });
  }, []);

  const getRegistration = useCallback(async (eventId: number, userId: string) => {
    return API.getRegistration(eventId, userId).then((response) => {
      return !response.isError ? Promise.resolve(response.data) : Promise.reject(response.data);
    });
  }, []);

  const getEventRegistrations = useCallback(async (eventId: number) => {
    return API.getEventRegistrations(eventId).then((response) => {
      return !response.isError ? Promise.resolve(response.data) : Promise.reject(response.data);
    });
  }, []);

  const createRegistration = useCallback(
    async (eventId: number, item: Partial<Registration>) => {
      return API.createRegistration(eventId, item).then((response) => {
        if (response.isError) {
          return Promise.reject(response.data);
        } else {
          return getEventById(eventId).then((event) => {
            const newEvent = { ...event };
            if (response.data.is_on_wait) {
              newEvent.waiting_list_count++;
            } else {
              newEvent.list_count++;
            }
            addUserEvent(event);
            dispatch({ type: 'update', payload: newEvent });
            return Promise.resolve(response.data);
          });
        }
      });
    },
    [getEventById, dispatch, addUserEvent],
  );

  const updateRegistration = useCallback(async (eventId: number, item: Partial<Registration>, userId: string) => {
    return API.updateRegistration(eventId, item, userId).then((response) => {
      return !response.isError ? Promise.resolve(response.data) : Promise.reject(response.data);
    });
  }, []);

  const deleteRegistration = useCallback(
    async (eventId: number, userId: string, oldRegistration?: Registration | null) => {
      return API.deleteRegistration(eventId, userId).then((response) => {
        if (response.isError) {
          return Promise.reject(response.data);
        } else {
          return getEventById(eventId).then((event) => {
            const newEvent = { ...event };
            if (oldRegistration) {
              if (oldRegistration.is_on_wait) {
                newEvent.waiting_list_count--;
              } else {
                newEvent.list_count--;
              }
            }
            removeUserEvent(event);
            dispatch({ type: 'update', payload: newEvent });
            return Promise.resolve(response.data);
          });
        }
      });
    },
    [getEventById, dispatch, removeUserEvent],
  );

  return {
    EventProvider,
    getEvents,
    getExpiredEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    updateAttendedStatus,
    getRegistration,
    getEventRegistrations,
    createRegistration,
    updateRegistration,
    deleteRegistration,
  };
};
