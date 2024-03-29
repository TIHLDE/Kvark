import { useInfiniteQuery } from 'react-query';

import { Cheatsheet, PaginationResponse, RequestResponse } from 'types';
import { CheatsheetStudy } from 'types/Enums';

import API from 'api/api';

export const CHEATSHEET_QUERY_KEY = 'cheatsheet';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useCheatsheet = (study: CheatsheetStudy, grade: number, filters?: any) => {
  return useInfiniteQuery<PaginationResponse<Cheatsheet>, RequestResponse>(
    [CHEATSHEET_QUERY_KEY, study, grade, filters],
    ({ pageParam = 1 }) => API.getCheatsheets(study, grade, { ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};
