import { genericOAuthClient, usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { createConfig } from '../gen-client/client';
import { client } from '../gen-client/client.gen';
import * as sdk from '../gen-client/sdk.gen';
import { ClientOptions } from '../gen-client/types.gen';

/**
 * Better-Auth client for Photon
 */
export const photonAuthClient = createAuthClient({
  baseURL: import.meta.env.VITE_PHOTON_API_URL,
  plugins: [genericOAuthClient(), usernameClient()],
});

// Configure the Photon API client (via the auto-generated global client)
client.setConfig(
  createConfig<ClientOptions>({
    baseUrl: import.meta.env.VITE_PHOTON_API_URL,
    credentials: 'include',
  }),
);

/**
 * Type-safe Photon API client
 *
 * @example
 * const { data, error } = await photonClient.listApiKeys();
 * const { data } = await photonClient.createEvent({ body: { ... } });
 */
export const photon = sdk;
