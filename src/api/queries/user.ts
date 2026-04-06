import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { apiClient } from '~/api/api-client';
import { UpdateUserSettingsInput, OnboardUserInput } from '@tihlde/sdk';

const UserQueryKeys = {
  settings: ['user', 'settings'] as const,
  allergies: ['user', 'allergies'] as const,
} as const;

export const getUserSettingsQuery = () =>
  queryOptions({
    queryKey: [...UserQueryKeys.settings],
    queryFn: () => apiClient.get('/api/user/me/settings'),
  });

export const createUserSettingsMutation = mutationOptions({
  mutationFn: ({ data }: { data: OnboardUserInput }) =>
    apiClient.post('/api/user/me/settings', {
      json: data,
    }),
  onSuccess(_, __, ___, ctx) {
    ctx.client.invalidateQueries({
      queryKey: [...UserQueryKeys.settings],
      exact: false,
    });
  },
});

export const updateUserSettingsMutation = mutationOptions({
  mutationFn: ({ data }: { data: UpdateUserSettingsInput }) =>
    apiClient.patch('/api/user/me/settings', {
      json: data,
    }),
  onSuccess(_, __, ___, ctx) {
    ctx.client.invalidateQueries({
      queryKey: [...UserQueryKeys.settings],
      exact: false,
    });
  },
});

export const getAllergiesQuery = () =>
  queryOptions({
    queryKey: [...UserQueryKeys.allergies],
    queryFn: () => apiClient.get('/api/user/allergy'),
  });
