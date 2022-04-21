import { useInfiniteQuery, useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';

import { Banner, PaginationResponse, RequestResponse } from 'types';

import API from 'api/api';

export const BANNER_QUERY_KEY = 'banners';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useBanners = (filters?: any) => {
  return useInfiniteQuery<PaginationResponse<Banner>, RequestResponse>(
    [BANNER_QUERY_KEY, filters],
    ({ pageParam = 1 }) => API.getBanners({ ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useVisibleBanners = (filters?: any) => {
  return useQuery<Array<Banner>>([BANNER_QUERY_KEY, filters], () => API.getVisibleBanners(), {});
};

export const useDeleteBanner = (bannerId: Banner['id']): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => API.deleteBanner(bannerId), {
    onSuccess: () => {
      queryClient.invalidateQueries(BANNER_QUERY_KEY);
    },
  });
};

export const useUpdateBanner = (bannerId: Banner['id']): UseMutationResult<Banner, RequestResponse, Banner, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedBanner: Banner) => API.updateBanner(bannerId, updatedBanner), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(BANNER_QUERY_KEY);
      queryClient.setQueryData([BANNER_QUERY_KEY, bannerId], data);
    },
  });
};

export const useCreateBanner = (): UseMutationResult<Banner, RequestResponse, Banner, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newBanner: Banner) => API.createBanner(newBanner), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(BANNER_QUERY_KEY);
      queryClient.setQueryData([BANNER_QUERY_KEY, data.id], data);
    },
  });
};
