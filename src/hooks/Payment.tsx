import API from '~/api/api';
import type { Order, RequestResponse } from '~/types';
import { useMutation, type UseMutationResult, useQueryClient } from 'react-query';

export const ORDER_QUERY_KEYS = 'payment';

export const useCreatePaymentOrder = (): UseMutationResult<Partial<Order>, RequestResponse, Partial<Order>, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((item) => API.createPaymentOrder(item), {
    onSuccess: () => {
      queryClient.invalidateQueries(ORDER_QUERY_KEYS);
    },
  });
};
