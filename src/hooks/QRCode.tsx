import { useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';

import { RequestResponse, QRCode } from 'types';

import API from 'api/api';


export const QR_CODE_QUERY_KEY = 'qr-code';

export const useQRCodes = () => {
    return useQuery<Array<QRCode>, RequestResponse>([QR_CODE_QUERY_KEY], () => API.getQRCodes());
}

export const useCreateQRCode = (): UseMutationResult<QRCode, RequestResponse, QRCode, unknown> => {
    const queryClient = useQueryClient();
    return useMutation((item) => API.createQRCode(item), {
        onSuccess: () => {
            queryClient.invalidateQueries(QR_CODE_QUERY_KEY);
        },
    });
}

export const useDeleteQRCode = (): UseMutationResult<RequestResponse, RequestResponse, number, unknown> => {
    const queryClient = useQueryClient();
    return useMutation((id) => API.deleteQRCode(id), {
        onSuccess: () => {
            queryClient.invalidateQueries(QR_CODE_QUERY_KEY);
        },
    });
}