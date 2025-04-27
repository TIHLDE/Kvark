import { useInfiniteQuery, useMutation, type UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';
import API from '~/api/api';
import type { InfoBanner, PaginationResponse, RequestResponse } from '~/types';

export const BANNER_QUERY_KEY = 'banners';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useInfoBanners = (filters?: any) => {
  return useInfiniteQuery<PaginationResponse<InfoBanner>, RequestResponse>(
    [BANNER_QUERY_KEY, filters],
    ({ pageParam = 1 }) => API.getInfoBanners({ ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};

export const useInfoBanner = (bannerId: InfoBanner['id']) => {
  return useQuery<InfoBanner, RequestResponse>([BANNER_QUERY_KEY, bannerId], () => API.getInfoBanner(bannerId), { enabled: bannerId !== '' });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useVisibleInfoBanners = (filters?: any) => {
  return useQuery<Array<InfoBanner>>([BANNER_QUERY_KEY, filters], () => API.getVisibleInfoBanners(), {});
};

export const useDeleteInfoBanner = (bannerId: InfoBanner['id']): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => API.deleteInfoBanner(bannerId),
    onSuccess: () => {
      queryClient.invalidateQueries([BANNER_QUERY_KEY]);
    },
  });
};

export const useUpdateInfoBanner = (bannerId: InfoBanner['id']): UseMutationResult<InfoBanner, RequestResponse, InfoBanner, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedInfoBanner: InfoBanner) => API.updateInfoBanner(bannerId, updatedInfoBanner),
    onSuccess: (data) => {
      queryClient.invalidateQueries([BANNER_QUERY_KEY]);
      queryClient.setQueryData([BANNER_QUERY_KEY, bannerId], data);
    },
  });
};

export const useCreateInfoBanner = (): UseMutationResult<InfoBanner, RequestResponse, InfoBanner, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newInfoBanner: InfoBanner) => API.createInfoBanner(newInfoBanner),
    onSuccess: (data) => {
      queryClient.invalidateQueries([BANNER_QUERY_KEY]);
      queryClient.setQueryData([BANNER_QUERY_KEY, data.id], data);
    },
  });
};
