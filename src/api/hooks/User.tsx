import { createContext, ReactNode, useContext, useState, useEffect, useReducer, useCallback } from 'react';
import API from 'api/api';
import { useAuth } from 'api/hooks/Auth';
import { User, Event } from 'types/Types';
import { Groups } from 'types/Enums';

export type Action =
  | { type: 'add event'; payload: Event }
  | { type: 'remove event'; payload: Event }
  | { type: 'set'; payload: User }
  | { type: 'remove' }
  | { type: 'update'; payload: Partial<User> };

export type Dispatch = (action: Action) => void;
export type UserProviderProps = { children: ReactNode };

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
    case 'add event': {
      if (state) {
        return { ...state, events: [...state.events, action.payload] } as User;
      } else {
        return state;
      }
    }
    case 'remove event': {
      if (state) {
        const newUserEvents = [...state.events];
        for (let i = 0; i < newUserEvents.length; i++) {
          if (newUserEvents[i].id === action.payload.id) {
            newUserEvents.splice(i, 1);
          }
        }
        return { ...state, events: newUserEvents } as User;
      } else {
        return state;
      }
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

export type HavePermissionProps = {
  children: ReactNode;
  groups: Array<Groups>;
};

export const HavePermission = ({ children, groups }: HavePermissionProps) => {
  const [allowAccess, isLoading] = useHavePermission(groups);
  return allowAccess && !isLoading ? <>{children}</> : null;
};

export const useHavePermission = (groups: Array<Groups>) => {
  const user = useUserState();
  const { getUserData } = useUser();
  const [havePermission, setHavePermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let subscribed = true;
    getUserData()
      .then((user) => !subscribed || setHavePermission(Boolean(user?.groups.some((group) => groups.includes(group)))))
      .catch(() => !subscribed || setHavePermission(false))
      .finally(() => !subscribed || setIsLoading(false));
    return () => {
      subscribed = false;
    };
  }, [user, getUserData, groups]);

  return [havePermission, isLoading] as const;
};

export const useUser = () => {
  const user = useUserState();
  const dispatch = useUserDispatch();
  const { isAuthenticated } = useAuth();

  const getUserData = useCallback(async () => {
    if (isAuthenticated()) {
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
  }, [user, dispatch, isAuthenticated]);

  const getUsers = useCallback(
    async (filters = null) => {
      if (isAuthenticated()) {
        return API.getUsers(filters).then((response) => {
          return !response.isError ? Promise.resolve(response.data) : Promise.reject(response.data);
        });
      }
    },
    [isAuthenticated],
  );

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

  const addUserEvent = useCallback(
    async (event: Event) => {
      return dispatch({ type: 'add event', payload: event });
    },
    [dispatch],
  );

  const removeUserEvent = useCallback(
    async (event: Event) => {
      return dispatch({ type: 'remove event', payload: event });
    },
    [dispatch],
  );

  return { getUserData, getUsers, updateUserData, addUserEvent, removeUserEvent };
};
