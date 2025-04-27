import API from '~/api/api';
import type { Order, OrderList, PaginationResponse, RequestResponse } from '~/types';
import { useInfiniteQuery, useMutation, type UseMutationResult, useQueryClient } from 'react-query';

export const ORDER_QUERY_KEYS = {
  all: ['order'] as const,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: (filters?: any) => [...ORDER_QUERY_KEYS.all, 'list', ...(filters ? [filters] : [])] as const,
};

export const useCreatePaymentOrder = (): UseMutationResult<Partial<Order>, RequestResponse, Partial<Order>, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((item) => API.createPaymentOrder(item), {
    onSuccess: () => {
      queryClient.invalidateQueries(ORDER_QUERY_KEYS.all);
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const usePaymentOrders = (filters?: any) =>
  useInfiniteQuery<PaginationResponse<OrderList>, RequestResponse>(
    ORDER_QUERY_KEYS.list(filters),
    ({ pageParam = 1 }) => API.getPaymentOrders({ ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
