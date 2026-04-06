import { queryOptions } from '@tanstack/react-query';
import { linkOptions, redirect } from '@tanstack/react-router';
import { getQueryClient } from '~/integrations/tanstack-query';
import { Permissions } from '~/types';
import { PermissionApp } from '~/types/Enums';

import { createAuthClient } from 'better-auth/react';
import { usernameClient, genericOAuthClient } from 'better-auth/client/plugins';
import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import type { ExtendedSession } from '@tihlde/sdk/auth';

export const clientAuthInstance = createAuthClient({
  plugins: [usernameClient(), genericOAuthClient()],
  baseURL: import.meta.env.VITE_AUTH_BASE_URL,
});

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const getAuthSession = createIsomorphicFn()
  .client(async () => {
    const session = await clientAuthInstance.getSession();
    if (session.error) {
      throw new AuthError(`Failed to get session: ${session.error}`);
    }
    return session.data as ExtendedSession;
  })
  .server(async () => {
    const session = await clientAuthInstance.getSession({
      fetchOptions: {
        headers: getRequestHeaders(),
      },
    });

    if (session.error) {
      throw new AuthError(`Failed to get session: ${session.error}`);
    }
    return session.data as ExtendedSession;
  });

export const authQueryOptions = queryOptions({
  queryKey: ['auth'],
  staleTime: 1000 * 60 * 2, // 2 minutes we want to check this frequently
  async queryFn() {
    try {
      return await getAuthSession();
    } catch (error) {
      if (error instanceof AuthError) {
        return undefined;
      }
      throw error;
    }
  },
});

/**
 * Gets tha authenticated user and their permissions
 * @returns auth object with user and permissions
 */
export async function authClient() {
  try {
    const auth = await getQueryClient().ensureQueryData(authQueryOptions);
    if (auth == null) {
      invalidateAuth();
    }
    return auth;
  } catch {
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
  const result = await clientAuthInstance.signIn.username({
    username,
    password,
  });

  if (result.error) {
    throw new Error('Kunne ikke logge inn: ' + result.error);
  }

  await getQueryClient().invalidateQueries();
  const auth = await authClient();
  if (!auth) {
    throw new Error('Kunne ikke logge inn: Kunne ikke finne brukerinformasjonen din!');
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
