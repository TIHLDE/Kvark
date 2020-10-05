import React, { createContext, useContext, useReducer, useCallback } from 'react';
import API from 'api/api';
import AuthService from 'api/services/AuthService';
import { User, Event } from 'types/Types';

export type Action =
  | { type: 'update events'; payload: Array<Event> }
  | { type: 'set'; payload: User }
  | { type: 'remove' }
  | { type: 'update'; payload: Partial<User> };

export type Dispatch = (action: Action) => void;
export type UserProviderProps = { children: React.ReactNode };

const UserStateContext = createContext<User | null>(null);
const UserDispatchContext = createContext<Dispatch | undefined>(undefined);

const userReducer = (state: User | null, action: Action): User | null => {
  switch (action.type) {
    case 'set': {
      return action.payload;
    }
    case 'update': {
      return { ...state, ...action.payload } as User;
    }
    case 'update events': {
      return { ...state, events: action.payload } as User;
    }
    case 'remove': {
      return null;
    }
  }
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [state, dispatch] = useReducer(userReducer, null);
  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>{children}</UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

const useUserState = () => {
  const context = useContext(UserStateContext);
  if (context === undefined) {
    throw new Error('useUserState must be used within a UserProvider');
  }
  return context;
};

const useUserDispatch = () => {
  const context = useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error('useUserDispatch must be used within a UserProvider');
  }
  return context;
};

export const useUser = () => {
  const user = useUserState();
  const dispatch = useUserDispatch();

  const getUserData = useCallback(async () => {
    if (AuthService.isAuthenticated()) {
      if (user) {
        return Promise.resolve(user);
      } else {
        return API.getUserData().then((response) => {
          if (response.isError) {
            return Promise.reject(response.data);
          } else {
            dispatch({ type: 'set', payload: response.data });
            return Promise.resolve(response.data);
          }
        });
      }
    } else {
      return null;
    }
  }, [user, dispatch]);

  const getUsers = useCallback(async (filters = null) => {
    if (AuthService.isAuthenticated()) {
      return API.getUsers(filters).then((response) => {
        return !response.isError ? Promise.resolve(response.data) : Promise.reject(response.data);
      });
    }
  }, []);

  const updateUserData = useCallback(
    async (userName: string, userData: Partial<User>, updateLocally?: boolean) => {
      return API.updateUserData(userName, userData).then((response) => {
        if (response.isError) {
          return Promise.reject(response.data);
        } else {
          !updateLocally || dispatch({ type: 'update', payload: userData });
          return response.data;
        }
      });
    },
    [dispatch],
  );

  const updateUserEvents = useCallback(
    async (events: Array<Event>) => {
      return dispatch({ type: 'update events', payload: events });
    },
    [dispatch],
  );

  return { getUserData, getUsers, updateUserData, updateUserEvents };
};
