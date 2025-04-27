import { useMutation, type UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';
import API from '~/api/api';
import type { RequestResponse, UserBio, UserBioCreate } from '~/types';

import { USER_QUERY_KEY } from './User';

export const USER_BIO_QUERY_KEY = 'user-bio';

export const useCreateUserBio = (): UseMutationResult<UserBio, RequestResponse, UserBioCreate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newUserBio: UserBioCreate) => API.createUserBio(newUserBio),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEY],
      });
    },
  });
};

export const useUpdateUserBio = (userBioId: UserBio['id']): UseMutationResult<Partial<UserBio>, RequestResponse, Partial<UserBio>, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedUserBio: Partial<UserBio>) => API.updateUserBio(userBioId, updatedUserBio),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEY],
      });
    },
  });
};

export const useDeleteUserBio = (userBioId: UserBio['id']): UseMutationResult<UserBio, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => API.deleteUserBio(userBioId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEY],
      }),
  });
};

export const useUserBio = (userBioId: UserBio['id'] | null) =>
  useQuery({
    queryKey: [USER_BIO_QUERY_KEY],
    queryFn: () => API.getUserBio(userBioId),
  });
