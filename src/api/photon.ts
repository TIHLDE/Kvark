import { customSessionClient, genericOAuthClient, usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { createConfig } from '../gen-client/client';
import { client } from '../gen-client/client.gen';
import * as sdk from '../gen-client/sdk.gen';
import { ClientOptions } from '../gen-client/types.gen';
import { unwrapSdk } from './queries/helper';

// User settings type
type UserSettings = {
  userId: string;
  gender: 'male' | 'female' | 'other';
  allowsPhotosByDefault: boolean;
  acceptsEventRules: boolean;
  imageUrl: string | null;
  bioDescription: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  receiveMailCommunication: boolean;
  isOnboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
  allergies: string[];
};

/**
 * Custom session fields from the backend using the customSession better-auth plugin
 */
export type ExtendedSession = {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    username: string | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    settings: UserSettings | null;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
  };
  permissions: string[];
  groups: {
    slug: string;
    name: string;
    type: string;
    role: 'member' | 'leader';
  }[];
};

/**
 * Better-Auth client for Photon
 */
export const photonAuthClient = createAuthClient({
  baseURL: import.meta.env.VITE_PHOTON_API_URL,
  plugins: [genericOAuthClient(), usernameClient(), customSessionClient()],
});

// Configure the Photon API client (via the auto-generated global client)
client.setConfig(
  createConfig<ClientOptions>({
    baseUrl: import.meta.env.VITE_PHOTON_API_URL,
    credentials: 'include',
  }),
);

/**
 * Type-safe Photon API client that returns data directly
 *
 * @example
 * const apiKeys = await photon.listApiKeys();
 * const event = await photon.createEvent({ body: { ... } });
 */
export const photon = unwrapSdk(sdk);
