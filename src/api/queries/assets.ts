import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { apiClient } from '~/api/api-client';

const AssetQueryKeys = {
  detail: ['assets', 'detail'] as const,
  metadata: ['assets', 'metadata'] as const,
} as const;

export const getAssetQuery = (key: string) =>
  queryOptions({
    queryKey: [...AssetQueryKeys.detail, key],
    queryFn: () =>
      apiClient.get('/api/assets/{key}', {
        params: { key },
      }),
  });

export const getAssetMetadataQuery = (key: string) =>
  queryOptions({
    queryKey: [...AssetQueryKeys.metadata, key],
    queryFn: () =>
      apiClient.get('/api/assets/metadata/{key}', {
        params: { key },
      }),
  });

export const uploadAssetMutation = mutationOptions({
  mutationFn: ({ formData }: { formData: FormData }) =>
    apiClient.post('/api/assets', {
      body: formData,
    } as never),
});
