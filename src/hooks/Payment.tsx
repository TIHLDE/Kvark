import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { Order, RequestResponse } from 'types';

import API from 'api/api';

export const ORDER_QUERY_KEYS = 'payment';

export const useCreatePaymentOrder = (): UseMutationResult<Partial<Order>, RequestResponse, Partial<Order>, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((item) => API.createPaymentOrder(item), {
    onSuccess: () => {
      queryClient.invalidateQueries(ORDER_QUERY_KEYS);
    },
  });
};
