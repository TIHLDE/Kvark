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
  const [allowAccess] = useHavePermission(groups);
  return <>{allowAccess && children}</>;
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
        return API.getUserData().then((data) => {
          dispatch({ type: 'set', payload: data });
          return data;
        });
      }
    } else {
      return null;
    }
  }, [user, dispatch, isAuthenticated]);

  const refreshUserData = useCallback(() => {
    if (isAuthenticated()) {
      API.getUserData().then((data) => dispatch({ type: 'set', payload: data }));
    }
  }, [user, dispatch, isAuthenticated]);

  const getUsers = useCallback((filters = null) => API.getUsers(filters), [isAuthenticated]);

  const updateUserData = useCallback(
    async (userName: string, userData: Partial<User>, updateLocally?: boolean) => {
      return API.updateUserData(userName, userData).then((data) => {
        !updateLocally || dispatch({ type: 'update', payload: userData });
        return data;
      });
    },
    [dispatch],
  );

  const addUserEvent = useCallback((event: Event) => dispatch({ type: 'add event', payload: event }), [dispatch]);

  const removeUserEvent = useCallback((event: Event) => dispatch({ type: 'remove event', payload: event }), [dispatch]);

  return { getUserData, refreshUserData, getUsers, updateUserData, addUserEvent, removeUserEvent };
};
