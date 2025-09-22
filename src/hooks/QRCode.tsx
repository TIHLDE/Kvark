import { useMutation, useQuery, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import API from '~/api/api';
import type { CreateQRCode, QRCode, RequestResponse } from '~/types';

export const QR_CODE_QUERY_KEY = 'qr-code';

export const useQRCodes = () => {
  return useQuery<QRCode[], RequestResponse>({
    queryKey: [QR_CODE_QUERY_KEY],
    queryFn: () => API.getQRCodes(),
  });
};

export const useCreateQRCode = (): UseMutationResult<QRCode, RequestResponse, CreateQRCode, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item) => API.createQRCode(item),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QR_CODE_QUERY_KEY],
      });
    },
  });
};

export const useDeleteQRCode = (id: number): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => API.deleteQRCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QR_CODE_QUERY_KEY],
      });
    },
  });
};
