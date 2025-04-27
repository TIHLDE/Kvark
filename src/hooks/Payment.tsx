import { useMutation, type UseMutationResult, useQueryClient } from '@tanstack/react-query';
import API from '~/api/api';
import type { Order, RequestResponse } from '~/types';

export const ORDER_QUERY_KEYS = 'payment';

export const useCreatePaymentOrder = (): UseMutationResult<Partial<Order>, RequestResponse, Partial<Order>, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item) => API.createPaymentOrder(item),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ORDER_QUERY_KEYS],
      });
    },
  });
};
