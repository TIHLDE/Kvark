import API from '~/api/api';
import type { RequestResponse, UserBio, UserBioCreate } from '~/types';
import { useMutation, type UseMutationResult, useQuery, useQueryClient } from 'react-query';

import { USER_QUERY_KEY } from './User';

export const USER_BIO_QUERY_KEY = 'user-bio';

export const useCreateUserBio = (): UseMutationResult<UserBio, RequestResponse, UserBioCreate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newUserBio: UserBioCreate) => API.createUserBio(newUserBio), {
    onSuccess: () => {
      queryClient.invalidateQueries([USER_QUERY_KEY]);
    },
  });
};

export const useUpdateUserBio = (userBioId: UserBio['id']): UseMutationResult<Partial<UserBio>, RequestResponse, Partial<UserBio>, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedUserBio: Partial<UserBio>) => API.updateUserBio(userBioId, updatedUserBio), {
    onSuccess: () => {
      queryClient.invalidateQueries([USER_QUERY_KEY]);
    },
  });
};

export const useDeleteUserBio = (userBioId: UserBio['id']): UseMutationResult<UserBio, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => API.deleteUserBio(userBioId), {
    onSuccess: () => queryClient.invalidateQueries([USER_QUERY_KEY]),
  });
};

export const useUserBio = (userBioId: UserBio['id'] | null) => useQuery<UserBio, RequestResponse>([USER_BIO_QUERY_KEY], () => API.getUserBio(userBioId));
