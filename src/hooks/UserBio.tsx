import { useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';

import { RequestResponse, UserBio, UserBioCreate } from 'types';

import API from 'api/api';

export const USER_BIO_QUERY_KEY = 'user-bio';

export const useCreateUserBio = (): UseMutationResult<UserBio, RequestResponse, UserBioCreate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newUserBio: UserBioCreate) => API.createUserBio(newUserBio), {
    onSuccess: (data) => {
      queryClient.setQueryData([USER_BIO_QUERY_KEY], data);
    },
  });
};

export const useUpdateUserBio = (userBioId: UserBio['id']): UseMutationResult<UserBio, RequestResponse, UserBio, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedUserBio: UserBio) => API.updateUserBio(userBioId, updatedUserBio), {
    onSuccess: (data) => {
      queryClient.setQueryData([USER_BIO_QUERY_KEY], data);
    },
  });
};

export const useDeleteUserBio = (userBioId: UserBio['id']): UseMutationResult<UserBio, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => API.deleteUserBio(userBioId), {
    onSuccess: () => queryClient.invalidateQueries([USER_BIO_QUERY_KEY]),
  });
};

export const useUserBio = (userBioId: UserBio['id']) => useQuery<UserBio, RequestResponse>([USER_BIO_QUERY_KEY], () => API.getUserBio(userBioId));
