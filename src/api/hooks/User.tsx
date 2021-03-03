import { ReactNode } from 'react';
import { useMutation, useInfiniteQuery, useQuery, useQueryClient, UseMutationResult } from 'react-query';
import API from 'api/api';
import { User, UserCreate, LoginRequestResponse, PaginationResponse, RequestResponse } from 'types/Types';
import { Groups } from 'types/Enums';
import { getCookie, setCookie, removeCookie } from 'api/cookie';
import { ACCESS_TOKEN } from 'constant';

export const USER_QUERY_KEY = 'user';
const QUERY_KEY_USERS = 'users';

export const useUser = () => {
  const isAuthenticated = useIsAuthenticated();
  return useQuery<User | undefined, RequestResponse>(USER_QUERY_KEY, () => (isAuthenticated ? API.getUserData() : undefined));
};

export const useRefreshUser = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries(USER_QUERY_KEY);
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useUsers = (filters?: any) => {
  return useInfiniteQuery<PaginationResponse<User>, RequestResponse>(
    [QUERY_KEY_USERS, filters],
    ({ pageParam = 1 }) => API.getUsers({ ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};

export const useLogin = (): UseMutationResult<LoginRequestResponse, RequestResponse, { username: string; password: string }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(({ username, password }) => API.authenticate(username, password), {
    onSuccess: (data) => {
      setCookie(ACCESS_TOKEN, data.token);
      queryClient.removeQueries(USER_QUERY_KEY);
      queryClient.prefetchQuery(USER_QUERY_KEY, () => API.getUserData());
    },
  });
};

export const useForgotPassword = (): UseMutationResult<RequestResponse, RequestResponse, string, unknown> => {
  return useMutation((email) => API.forgotPassword(email));
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return () => {
    removeCookie(ACCESS_TOKEN);
    queryClient.removeQueries(USER_QUERY_KEY);
  };
};

export const useIsAuthenticated = () => {
  return typeof getCookie(ACCESS_TOKEN) !== 'undefined';
};

export const useCreateUser = (): UseMutationResult<RequestResponse, RequestResponse, UserCreate, unknown> => {
  return useMutation((user) => API.createUser(user));
};

export const useUpdateUser = (): UseMutationResult<User, RequestResponse, { userId: string; user: Partial<User> }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(({ userId, user }) => API.updateUserData(userId, user), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(QUERY_KEY_USERS);
      const user = queryClient.getQueryData<User | undefined>(USER_QUERY_KEY);
      if (data.user_id === user?.user_id) {
        queryClient.setQueryData(USER_QUERY_KEY, data);
      }
    },
  });
};

export const useHavePermission = (groups: Array<Groups>) => {
  const { data, isLoading } = useUser();
  return { allowAccess: isLoading ? false : Boolean(data?.groups.some((group) => groups.includes(group))), isLoading };
};

export type HavePermissionProps = {
  children: ReactNode;
  groups: Array<Groups>;
};

export const HavePermission = ({ children, groups }: HavePermissionProps) => {
  const { allowAccess } = useHavePermission(groups);
  return <>{allowAccess && children}</>;
};
