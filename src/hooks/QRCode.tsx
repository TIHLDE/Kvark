import { useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';

import { QRCode, RequestResponse } from 'types';

import API from 'api/api';

export const QR_CODE_QUERY_KEY = 'qr-code';

export const useQRCodes = () => {
  return useQuery<Array<QRCode>, RequestResponse>([QR_CODE_QUERY_KEY], () => API.getQRCodes());
};

export const useCreateQRCode = (): UseMutationResult<QRCode, RequestResponse, QRCode, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((item) => API.createQRCode(item), {
    onSuccess: () => {
      queryClient.invalidateQueries(QR_CODE_QUERY_KEY);
    },
  });
};

export const useDeleteQRCode = (id: number): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => API.deleteQRCode(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(QR_CODE_QUERY_KEY);
    },
  });
};
