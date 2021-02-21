import { Study } from 'types/Enums';
import API from 'api/api';
import { useInfiniteQuery, useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';
import { Cheatsheet, PaginationResponse, RequestResponse } from 'types/Types';

const QUERY_KEY = 'cheatsheet';

export const useCheatsheet = (study: Study, grade: number, id: string) => {
  return useQuery<Cheatsheet, RequestResponse>([QUERY_KEY, id], () => API.getCheatsheet(id, study, grade), { enabled: id !== -1 });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useCheatsheets = (study: Study, grade: number, filters?: any) => {
  return useInfiniteQuery<PaginationResponse<Cheatsheet>, RequestResponse>(
    [QUERY_KEY, study, grade, filters],
    ({ pageParam = 1 }) => API.getCheatsheets(study, grade, { ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};

export const useCreateCheatsheet = (study: Study, grade: number): UseMutationResult<Cheatsheet, RequestResponse, Cheatsheet, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newCheatsheet: Cheatsheet) => API.createCheatsheet(newCheatsheet, study, grade), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(QUERY_KEY);
      queryClient.setQueryData([QUERY_KEY, data.id], data);
    },
  });
};

export const useUpdateCheatsheet = (study: Study, grade: number, id: string): UseMutationResult<Cheatsheet, RequestResponse, Cheatsheet, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedCheatsheet: Cheatsheet) => API.putCheatsheet(updatedCheatsheet, study, grade, id), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(QUERY_KEY);
      queryClient.setQueryData([QUERY_KEY, id], data);
    },
  });
};

export const useDeleteCheatsheet = (study: Study, grade: number, id: string): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => API.deleteCheatsheet(id, study, grade), {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY);
    },
  });
};
