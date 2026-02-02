import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { CreateApiKeyData, DeleteApiKeyData, RegenerateApiKeyData, UpdateApiKeyData } from '~/gen-client/types.gen';

import { photon } from '../photon';
import type { PathParams, Payload } from './helper';

export const apiKeyKeys = {
  all: ['api-keys'],
  lists: ['api-keys', 'list'],
  details: ['api-keys', 'detail'],
} as const;

export const listApiKeysQuery = () =>
  queryOptions({
    queryKey: apiKeyKeys.lists,
    queryFn: () => photon.listApiKeys(),
  });

export const getApiKeyQuery = (id: string) =>
  queryOptions({
    queryKey: [...apiKeyKeys.details, id],
    queryFn: () => photon.getApiKey({ path: { id } }),
  });

export const createApiKeyMutation = mutationOptions({
  mutationFn: (body: Payload<CreateApiKeyData>) => photon.createApiKey({ body }),
  onMutate: async (_, ctx) => {
    await ctx.client.cancelQueries({ queryKey: apiKeyKeys.lists });
  },
  onSuccess: (_, __, ___, ctx) => {
    ctx.client.invalidateQueries({ queryKey: apiKeyKeys.lists });
  },
});

export const updateApiKeyMutation = (id: PathParams<UpdateApiKeyData>['id']) =>
  mutationOptions({
    mutationFn: (body: Payload<UpdateApiKeyData>) => photon.updateApiKey({ path: { id }, body }),
    onMutate: async (_, ctx) => {
      await ctx.client.cancelQueries({ queryKey: apiKeyKeys.all });
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: apiKeyKeys.all });
    },
  });

export const deleteApiKeyMutation = (id: PathParams<DeleteApiKeyData>['id']) =>
  mutationOptions({
    mutationFn: () => photon.deleteApiKey({ path: { id } }),
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: apiKeyKeys.all });
    },
  });

export const regenerateApiKeyMutation = (id: PathParams<RegenerateApiKeyData>['id']) =>
  mutationOptions({
    mutationFn: () => photon.regenerateApiKey({ path: { id } }),
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: apiKeyKeys.all });
    },
  });
