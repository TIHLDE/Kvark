import { QueryKey, useInfiniteQuery, UseInfiniteQueryOptions, useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { PaginationResponse, RequestResponse, Toddel, ToddelMutate } from 'types';

import { TODDEL_API } from 'api/toddel';

export const TODDEL_QUERY_KEYS = {
  all: ['toddel'],
};

export const useToddels = (
  options?: UseInfiniteQueryOptions<PaginationResponse<Toddel>, RequestResponse, PaginationResponse<Toddel>, PaginationResponse<Toddel>, QueryKey>,
) => {
  return useInfiniteQuery<PaginationResponse<Toddel>, RequestResponse>(
    TODDEL_QUERY_KEYS.all,
    ({ pageParam = 1 }) => TODDEL_API.getToddels({ page: pageParam }),
    {
      ...options,
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};

export const useCreateToddel = (): UseMutationResult<Toddel, RequestResponse, ToddelMutate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((data) => TODDEL_API.createToddel(data), {
    onSuccess: () => queryClient.invalidateQueries(TODDEL_QUERY_KEYS.all),
  });
};

export const useUpdateToddel = (id: Toddel['edition']): UseMutationResult<Toddel, RequestResponse, ToddelMutate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((data) => TODDEL_API.updateToddel(id, data), {
    onSuccess: () => queryClient.invalidateQueries(TODDEL_QUERY_KEYS.all),
  });
};

export const useDeleteToddel = (id: Toddel['edition']): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => TODDEL_API.deleteToddel(id), {
    onSuccess: () => queryClient.invalidateQueries(TODDEL_QUERY_KEYS.all),
  });
};
