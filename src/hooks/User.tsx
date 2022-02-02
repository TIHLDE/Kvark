import { ReactNode } from 'react';
import { useMutation, useInfiniteQuery, useQuery, useQueryClient, UseMutationResult } from 'react-query';
import API from 'api/api';
import {
  User,
  UserList,
  Group,
  UserCreate,
  Strike,
  LoginRequestResponse,
  PaginationResponse,
  RequestResponse,
  Badge,
  EventCompact,
  Form,
  UserPermissions,
} from 'types';
import { PermissionApp } from 'types/Enums';
import { getCookie, setCookie, removeCookie } from 'api/cookie';
import { ACCESS_TOKEN } from 'constant';
import { useGoogleAnalytics } from 'hooks/Utils';

export const USER_QUERY_KEY = 'user';
export const USER_BADGES_QUERY_KEY = 'user_badges';
export const USER_EVENTS_QUERY_KEY = 'user_events';
export const USER_GROUPS_QUERY_KEY = 'user_groups';
export const USER_FORMS_QUERY_KEY = 'user_forms';
export const USER_STRIKES_QUERY_KEY = 'user_strikes';
export const USER_PERMISSIONS_QUERY_KEY = 'user_permissions';
export const USERS_QUERY_KEY = 'users';

export const useUser = (userId?: User['user_id']) => {
  const isAuthenticated = useIsAuthenticated();
  const { setUserId } = useGoogleAnalytics();
  return useQuery<User | undefined, RequestResponse>([USER_QUERY_KEY, userId], () => (isAuthenticated ? API.getUserData(userId) : undefined), {
    onSuccess: (data) => !data || userId || setUserId(data.user_id),
  });
};

export const useUserPermissions = () => {
  const isAuthenticated = useIsAuthenticated();
  return useQuery<UserPermissions | undefined, RequestResponse>([USER_PERMISSIONS_QUERY_KEY], () => (isAuthenticated ? API.getUserPermissions() : undefined));
};

export const useUserBadges = (userId?: User['user_id']) =>
  useInfiniteQuery<PaginationResponse<Badge>, RequestResponse>(
    [USER_BADGES_QUERY_KEY, userId],
    ({ pageParam = 1 }) => API.getUserBadges(userId, { page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );

export const useUserEvents = (userId?: User['user_id']) => {
  return useInfiniteQuery<PaginationResponse<EventCompact>, RequestResponse>(
    [USER_EVENTS_QUERY_KEY, userId],
    ({ pageParam = 1 }) => API.getUserEvents(userId, { page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useUserForms = (filters?: any) =>
  useInfiniteQuery<PaginationResponse<Form>, RequestResponse>(
    [USER_FORMS_QUERY_KEY, filters],
    ({ pageParam = 1 }) => API.getUserForms({ ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );

export const useUserGroups = (userId?: User['user_id']) =>
  useQuery<Array<Group>, RequestResponse>([USER_GROUPS_QUERY_KEY, userId], () => API.getUserGroups(userId));

export const useUserStrikes = (userId?: string) => useQuery<Array<Strike>, RequestResponse>([USER_STRIKES_QUERY_KEY, userId], () => API.getUserStrikes(userId));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useUsers = (filters?: any) =>
  useInfiniteQuery<PaginationResponse<UserList>, RequestResponse>(
    [USERS_QUERY_KEY, filters],
    ({ pageParam = 1 }) => API.getUsers({ ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );

export const useLogin = (): UseMutationResult<LoginRequestResponse, RequestResponse, { username: string; password: string }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(({ username, password }) => API.authenticate(username, password), {
    onSuccess: (data) => {
      setCookie(ACCESS_TOKEN, data.token);
      queryClient.removeQueries();
      queryClient.prefetchQuery([USER_QUERY_KEY], () => API.getUserData());
    },
  });
};

export const useForgotPassword = (): UseMutationResult<RequestResponse, RequestResponse, string, unknown> => useMutation((email) => API.forgotPassword(email));

export const useLogout = () => {
  const queryClient = useQueryClient();
  return () => {
    removeCookie(ACCESS_TOKEN);
    queryClient.removeQueries();
  };
};

export const useIsAuthenticated = () => typeof getCookie(ACCESS_TOKEN) !== 'undefined';

export const useCreateUser = (): UseMutationResult<RequestResponse, RequestResponse, UserCreate, unknown> => useMutation((user) => API.createUser(user));

export const useUpdateUser = (): UseMutationResult<User, RequestResponse, { userId: string; user: Partial<User> }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(({ userId, user }) => API.updateUserData(userId, user), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([USERS_QUERY_KEY]);
      const user = queryClient.getQueryData<User | undefined>([USER_QUERY_KEY]);
      if (data.user_id === user?.user_id) {
        queryClient.setQueryData([USER_QUERY_KEY], data);
      }
    },
  });
};

export const useActivateUser = (): UseMutationResult<RequestResponse, RequestResponse, string, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((userId) => API.activateUser(userId), {
    onSuccess: () => {
      queryClient.invalidateQueries([USERS_QUERY_KEY]);
    },
  });
};

export const useDeclineUser = (): UseMutationResult<RequestResponse, RequestResponse, { userId: string; reason: string }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(({ userId, reason }) => API.declineUser(userId, reason), {
    onSuccess: () => {
      queryClient.invalidateQueries([USERS_QUERY_KEY]);
    },
  });
};

export const useHavePermission = (apps: Array<PermissionApp>) => {
  const { data, isLoading } = useUserPermissions();
  return { allowAccess: isLoading ? false : Boolean(apps.some((app) => data?.permissions[app].write)), isLoading };
};

export type HavePermissionProps = {
  children: ReactNode;
  apps: Array<PermissionApp>;
};

export const HavePermission = ({ children, apps }: HavePermissionProps) => {
  const { allowAccess } = useHavePermission(apps);
  return <>{allowAccess && children}</>;
};
