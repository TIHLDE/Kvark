import { useQuery, UseQueryResult } from 'react-query';

import { RequestResponse } from 'types';
import { WrappedStats } from 'types/Wrapped';

import API from 'api/api';

export const useFetchWrapped = (year: number): UseQueryResult<WrappedStats, RequestResponse> => {
  // const queryClient = useQueryClient();
  return useQuery({ queryKey: ['wrapped-stats', year], queryFn: () => API.getWrappedStats(year) });
};
