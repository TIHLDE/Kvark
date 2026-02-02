import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { OnboardUserData, UpdateUserSettingsData } from '~/gen-client/types.gen';

import { photon } from '../photon';
import type { Payload } from './helper';

export const userKeys = {
  all: ['user'],
  settings: ['user', 'settings'],
  allergies: ['user', 'allergies'],
} as const;

export const getUserSettingsQuery = () =>
  queryOptions({
    queryKey: userKeys.settings,
    queryFn: () => photon.getUserSettings(),
  });

export const listAllergiesQuery = () =>
  queryOptions({
    queryKey: userKeys.allergies,
    queryFn: () => photon.listAllergies(),
  });

export const updateUserSettingsMutation = mutationOptions({
  mutationFn: (body: Payload<UpdateUserSettingsData>) => photon.updateUserSettings({ body }),
  onMutate: async (_, ctx) => {
    await ctx.client.cancelQueries({ queryKey: userKeys.settings });
  },
  onSuccess: (_, __, ___, ctx) => {
    ctx.client.invalidateQueries({ queryKey: userKeys.settings });
  },
});

export const onboardUserMutation = mutationOptions({
  mutationFn: (body: Payload<OnboardUserData>) => photon.onboardUser({ body }),
  onMutate: async (_, ctx) => {
    await ctx.client.cancelQueries({ queryKey: userKeys.settings });
  },
  onSuccess: (_, __, ___, ctx) => {
    ctx.client.invalidateQueries({ queryKey: userKeys.settings });
  },
});
