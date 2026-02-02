import { queryOptions } from '@tanstack/react-query';
import { linkOptions, redirect } from '@tanstack/react-router';
import { ACCESS_TOKEN } from '~/constant';
import { getQueryClient } from '~/integrations/tanstack-query';
import { Permissions, RequestResponse, User } from '~/types';
import { PermissionApp } from '~/types/Enums';
import { z } from 'zod';

import API from './api';
import { getCookie, setCookie } from './cookie';
import { ExtendedSession, photonAuthClient } from './photon';

export const AuthObjectSchema = z.object({
  user: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    image: z.string().nullish(),
    groups: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        isLeader: z.boolean(),
      }),
    ),
  }),
  permissions: z.array(z.string()),
  tihldeUser: z.custom<User>(),
});

export type AuthObject = z.infer<typeof AuthObjectSchema>;

export const authQueryOptions = queryOptions({
  queryKey: ['auth'],
  staleTime: 1000 * 60 * 2, // 2 minutes we want to check this frequently
  async queryFn() {
    try {
      getQueryClient().cancelQueries({ queryKey: ['user', null] });
      const sessionResponse = (await photonAuthClient.getSession()).data;

      if (sessionResponse === null) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch user data from Photon');
        // eslint-disable-next-line no-console
        console.error({ profile: sessionResponse });
        return null;
      }

      const session = sessionResponse as typeof sessionResponse & ExtendedSession;

      getQueryClient().setQueryData(['user', null], session);
      return session;
    } catch {
      // If we get an error, we want to invalidate the cache
      return null;
    }
  },
});

/**
 * Gets tha authenticated user and their permissions
 * @returns auth object with user and permissions
 */
export async function authClient() {
  const token = getCookie(ACCESS_TOKEN);
  if (!token) {
    return undefined;
  }
  // Try to fetch the auth object
  try {
    const authObject = await getQueryClient().ensureQueryData(authQueryOptions);
    if (!authObject) {
      // Invalidate the cache if we get an error
      invalidateAuth();
      return undefined;
    }
    return authObject;
  } catch {
    // If we get an error, we want to invalidate the cache
    invalidateAuth();
    return undefined;
  }
}

/**
 * Authenticates the user with the given username and password, and fetches the auth object
 * @param username the username of the user
 * @param password the password of the user
 * @throws {RequestResponse} if the authentication fails or the auth object is not fetched correctly
 */
export async function loginUser(username: string, password: string) {
  const { token } = await API.authenticate(username, password);
  if (!token) {
    throw { detail: 'Noe er galt' } satisfies RequestResponse;
  }

  setCookie(ACCESS_TOKEN, token);
  getQueryClient().removeQueries();
  const auth = await authClient();
  if (!auth) {
    throw { detail: 'Kunne ikke finne brukerinformasjonen din' } satisfies RequestResponse;
  }
  return auth;
}

/**
 * Invalidates the auth used by authClient for the specified token
 */
export function invalidateAuth() {
  getQueryClient().invalidateQueries(authQueryOptions);
}

/**
 * Checks if the user has write permission for the given app(s)
 * @param permissions the user permissions
 * @param app the app(s) to check agains
 * @param some if true, the user must only have write permission for one of the apps
 * @returns if the user has write or write_all permission
 */
export function userHasWritePermission(permissions: Record<string, Permissions>, app: PermissionApp | PermissionApp[], some: boolean = false): boolean {
  if (!Array.isArray(app)) {
    const perm = permissions[app];
    if (!perm) {
      return false;
    }
    return Boolean(perm.write) || Boolean(perm.write_all);
  }
  if (some) {
    return app.some((p) => userHasWritePermission(permissions, p));
  }
  return app.every((p) => userHasWritePermission(permissions, p));
}

/**
 * Attempts to authenticate the user and redirects to the login page if not authenticated
 * @param request the request object from the loader
 * @returns auth object if authenticated
 * @throws redirect to login page if not authenticated
 */
export async function authClientWithRedirect(url: string) {
  const auth = await authClient();
  if (!auth) {
    throw redirect(createLoginRedirectUrl(url));
  }
  return auth;
}

/**
 * Returns the URL to redirect to the login page with the current URL as the redirect target
 * @param request the current request object
 * @returns URL string to redirect to the login page
 */
export function createLoginRedirectUrl(url: string) {
  return linkOptions({
    to: '/logg-inn',
    search: {
      redirectTo: url,
    },
  });
}
