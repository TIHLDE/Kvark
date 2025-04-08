import { type UseMutationResult, useMutation, useQueryClient } from 'react-query';
import API from '~/api/api';
import type { Order, RequestResponse } from '~/types';

export const ORDER_QUERY_KEYS = 'payment';

export const useCreatePaymentOrder = (): UseMutationResult<Partial<Order>, RequestResponse, Partial<Order>, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((item) => API.createPaymentOrder(item), {
    onSuccess: () => {
      queryClient.invalidateQueries(ORDER_QUERY_KEYS);
    },
  });
};
