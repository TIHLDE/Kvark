import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type QueryKey, type UseMutationResult, type UseQueryOptions } from '@tanstack/react-query';
import API from '~/api/api';
import { AuthObject } from '~/api/auth';
import { getCookie, removeCookie, setCookie } from '~/api/cookie';
import { ACCESS_TOKEN } from '~/constant';
import { getQueryClient } from '~/queryClient';
import type {
  Badge,
  EventList,
  Form,
  LoginRequestResponse,
  Membership,
  MembershipHistory,
  PaginationResponse,
  RequestResponse,
  User,
  UserCreate,
  UserList,
  UserNotificationSetting,
  UserPermissions,
} from '~/types';
import type { PermissionApp } from '~/types/Enums';
import URLS from '~/URLS';
import { useEffect, type ReactNode } from 'react';
import { useNavigate, useRevalidator } from 'react-router';

export const USER_QUERY_KEY = 'user';
export const USER_BADGES_QUERY_KEY = 'user_badges';
export const USER_EVENTS_QUERY_KEY = 'user_events';
export const USER_MEMBERSHIPS_QUERY_KEY = 'user_memberships';
export const USER_MEMBERSHIP_HISTORIES_QUERY_KEY = 'user_membership_histories';
export const USER_FORMS_QUERY_KEY = 'user_forms';
export const USER_STRIKES_QUERY_KEY = 'user_strikes';
export const USER_PERMISSIONS_QUERY_KEY = 'user_permissions';
export const USER_NOTIFICATION_SETTINGS_QUERY_KEY = 'user_notification_settings';
export const USER_NOTIFICATION_SETTING_CHOICES_QUERY_KEY = 'user_notification_setting_choices';
export const USERS_QUERY_KEY = 'users';

export const useUser = (userId?: User['user_id'], options: { enabled?: boolean } = {}) => {
  const isAuthenticated = useIsAuthenticated();
  const logOut = useLogout();
  const query = useQuery({
    queryKey: [USER_QUERY_KEY, userId],
    queryFn: () => API.getUserData(userId),
    initialData: () => {
      if (userId == null) {
        // Get the auth user object from the query client if no userId is provided.
        const auth = getQueryClient().getQueryData<AuthObject | null>(['auth']);
        if (auth == null) {
          return undefined;
        }
        return auth.tihldeUser;
      }
      return undefined;
    },
    enabled: Boolean(isAuthenticated),
    ...options,
  });

  useEffect(() => {
    if (query.isError && !userId) {
      logOut();
      window.location.reload();
    }
  }, [query.isError, userId, logOut]);

  return query;
};

export const useUserPermissions = (options?: UseQueryOptions<UserPermissions | undefined, RequestResponse, UserPermissions | undefined, QueryKey>) => {
  const isAuthenticated = useIsAuthenticated();
  return useQuery({
    queryKey: [USER_PERMISSIONS_QUERY_KEY],
    queryFn: () => API.getUserPermissions(),
    enabled: isAuthenticated,
    ...options,
  });
};

export const useUserBadges = (userId?: User['user_id']) =>
  useInfiniteQuery<PaginationResponse<Badge>, RequestResponse>({
    queryKey: [USER_BADGES_QUERY_KEY, userId],
    queryFn: ({ pageParam }) => API.getUserBadges(userId, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });

export const useUserEvents = (userId?: User['user_id'], expired?: boolean) => {
  return useInfiniteQuery<PaginationResponse<EventList>, RequestResponse>({
    queryKey: [USER_EVENTS_QUERY_KEY, userId, expired],
    queryFn: ({ pageParam }) => API.getUserEvents(userId, { page: pageParam, expired: expired }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useUserForms = (filters?: any) =>
  useInfiniteQuery<PaginationResponse<Form>, RequestResponse>({
    queryKey: [USER_FORMS_QUERY_KEY, filters],
    queryFn: ({ pageParam }) => API.getUserForms({ ...(filters ?? {}), page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });

// TODO: Investigate if this needs to be an infinite query
export const useUserMemberships = (userId?: User['user_id']) =>
  useInfiniteQuery<PaginationResponse<Membership>, RequestResponse>({
    queryKey: [USER_MEMBERSHIPS_QUERY_KEY, userId],
    queryFn: () => API.getUserMemberships(userId),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });

// TODO: Investigate if this needs to ba an infinite query
export const useUserMembershipHistories = (userId?: User['user_id']) =>
  useInfiniteQuery<PaginationResponse<MembershipHistory>, RequestResponse>({
    queryKey: [USER_MEMBERSHIP_HISTORIES_QUERY_KEY, userId],
    queryFn: () => API.getUserMembershipHistories(userId),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });

export const useUserStrikes = (userId?: string) =>
  useQuery({
    queryKey: [USER_STRIKES_QUERY_KEY, userId],
    queryFn: () => API.getUserStrikes(userId),
  });

export const useUserNotificationSettings = () =>
  useQuery({
    queryKey: [USER_NOTIFICATION_SETTINGS_QUERY_KEY],
    queryFn: () => API.getUserNotificationSettings(),
  });

export const useUserNotificationSettingChoices = () =>
  useQuery({
    queryKey: [USER_NOTIFICATION_SETTING_CHOICES_QUERY_KEY],
    queryFn: () => API.getUserNotificationSettingChoices(),
  });

export const useUpdateUserNotificationSettings = (): UseMutationResult<Array<UserNotificationSetting>, RequestResponse, UserNotificationSetting, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => API.updateUserNotificationSettings(data),
    onSuccess: (data) => {
      queryClient.setQueryData([USER_NOTIFICATION_SETTINGS_QUERY_KEY], data);
    },
  });
};

export const useSlackConnect = (): UseMutationResult<RequestResponse, RequestResponse, string, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slackCode) => API.slackConnect(slackCode),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEY],
      }),
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useUsers = (filters?: any) =>
  useInfiniteQuery<PaginationResponse<UserList>, RequestResponse>({
    queryKey: [USERS_QUERY_KEY, filters],
    queryFn: ({ pageParam }) => API.getUsers({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });

export const useLogin = (): UseMutationResult<LoginRequestResponse, RequestResponse, { username: string; password: string }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ username, password }) => API.authenticate(username, password),
    onSuccess: (data) => {
      setCookie(ACCESS_TOKEN, data.token);
      queryClient.removeQueries();
      queryClient.prefetchQuery({ queryKey: [USER_QUERY_KEY], queryFn: () => API.getUserData() });
    },
  });
};

export const useForgotPassword = (): UseMutationResult<RequestResponse, RequestResponse, string, unknown> =>
  useMutation({
    mutationFn: (email) => API.forgotPassword(email),
  });

export const useLogout = () => {
  const { revalidate } = useRevalidator();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return () => {
    removeCookie(ACCESS_TOKEN);
    queryClient.removeQueries();
    revalidate();
    navigate(URLS.landing);
  };
};

export const useIsAuthenticated = () => typeof getCookie(ACCESS_TOKEN) !== 'undefined';

export const useCreateUser = (): UseMutationResult<RequestResponse, RequestResponse, UserCreate, unknown> =>
  useMutation({
    mutationFn: (user) => API.createUser(user),
  });

export const useUpdateUser = (): UseMutationResult<User, RequestResponse, { userId: string; user: Partial<User> }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, user }) => API.updateUserData(userId, user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [USERS_QUERY_KEY],
      });
      const user = queryClient.getQueryData<User | undefined>([USER_QUERY_KEY]);
      if (data.user_id === user?.user_id) {
        queryClient.setQueryData([USER_QUERY_KEY], data);
      }
    },
  });
};

export const useExportUserData = (): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> =>
  useMutation({
    mutationFn: () => API.exportUserData(),
  });

export const useDeleteUser = (): UseMutationResult<RequestResponse, RequestResponse, string | undefined, unknown> =>
  useMutation({
    mutationFn: (userId) => API.deleteUser(userId),
  });

export const useActivateUser = (): UseMutationResult<RequestResponse, RequestResponse, string, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => API.activateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USERS_QUERY_KEY],
      });
    },
  });
};

export const useDeclineUser = (): UseMutationResult<RequestResponse, RequestResponse, { userId: string; reason: string }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }) => API.declineUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USERS_QUERY_KEY],
      });
    },
  });
};

export const useHavePermission = (
  apps: Array<PermissionApp>,
  options?: UseQueryOptions<UserPermissions | undefined, RequestResponse, UserPermissions | undefined, QueryKey>,
) => {
  const { data, isLoading } = useUserPermissions(options);
  return {
    allowAccess: isLoading ? false : Boolean(apps.some((app) => data?.permissions?.[app]?.write || data?.permissions?.[app]?.write_all)),
    isLoading,
  };
};

export type HavePermissionProps = {
  children: ReactNode;
  apps: Array<PermissionApp>;
};

export const HavePermission = ({ children, apps }: HavePermissionProps) => {
  const { allowAccess } = useHavePermission(apps);
  return <>{allowAccess && children}</>;
};
