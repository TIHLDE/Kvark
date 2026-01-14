import { genericOAuthClient, usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { createClient, createConfig } from '../client/client';
import * as sdk from '../client/sdk.gen';
import { ClientOptions } from '../client/types.gen';

export const photonAuthClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: import.meta.env.VITE_PHOTON_API_URL,
  plugins: [genericOAuthClient(), usernameClient()],
});

const baseClient = createClient(
  createConfig<ClientOptions>({
    baseUrl: 'http://localhost:4000',
    credentials: 'include',
  }),
);

/**
 * Create a type-safe client wrapper with all SDK methods attached
 */
function createSDKWrapper<T extends typeof sdk>(sdkMethods: T, client: ReturnType<typeof createClient>) {
  const wrapper = {} as {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof T]: T[K] extends (options?: infer O) => infer R ? (O extends { client?: any } ? (options?: Omit<O, 'client'>) => R : T[K]) : T[K];
  };

  for (const key in sdkMethods) {
    const method = sdkMethods[key];
    if (typeof method === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (wrapper as any)[key] = (options?: any) => method({ ...options, client });
    }
  }

  return wrapper;
}

/**
 * Type-safe Photon API client with all SDK methods attached.
 *
 * @example
 * const { data, error } = await photonClient.listApiKeys();
 * const { data } = await photonClient.createEvent({ body: { ... } });
 */
export const photonClient = createSDKWrapper(sdk, baseClient);
