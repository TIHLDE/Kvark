import { useInfiniteQuery } from '@tanstack/react-query';
import API from '~/api/api';
import type { Cheatsheet, PaginationResponse, RequestResponse } from '~/types';
import { CheatsheetStudy } from '~/types/Enums';

export const CHEATSHEET_QUERY_KEY = 'cheatsheet';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useCheatsheet = (study: CheatsheetStudy, grade: number, filters?: any) => {
  return useInfiniteQuery<PaginationResponse<Cheatsheet>, RequestResponse>({
    queryKey: [CHEATSHEET_QUERY_KEY, study, grade, filters],
    queryFn: ({ pageParam }) => API.getCheatsheets(study, grade, { ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });
};
