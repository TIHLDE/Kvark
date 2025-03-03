import { ACCESS_TOKEN } from '~/constant';
import { Permissions, User } from '~/types';
import { MembershipType, PermissionApp } from '~/types/Enums';
import { createPath, createSearchParams, href, redirect } from 'react-router';
import { z } from 'zod';

import API from './api';
import { cache, cachified } from './cache';
import { getCookie } from './cookie';

/**
 * Gets tha authenticated user and their permissions
 * @returns auth object with user and permissions
 */
export async function authClient() {
  const token = getCookie(ACCESS_TOKEN);
  if (!token) {
    return undefined;
  }

  const authObject = await cachified({
    key: `auth:${token}`,
    ttl: 5 * 60 * 1000, // 5 minutes
    getFreshValue: async (context) => {
      try {
        const [user, permission] = await Promise.all([API.getUserData(), API.getUserPermissions()]);
        // TODO: Check if we need to handle pagination here
        // Pagination on the backend returns 25 objects. I dont we have to worry about that here
        const memberships = (await API.getUserMemberships(user.user_id)).results;

        const authUser = {
          id: user.user_id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          image: user.image,
          groups: memberships.map((m) => ({
            id: m.group.slug,
            name: m.group.name,
            isLeader: m.membership_type === MembershipType.LEADER,
          })),
          //TODO: Check if more fields are needed
        };
        return { user: authUser, permissions: permission.permissions, tihldeUser: user };
      } catch {
        context.metadata.ttl = 0;
        return undefined;
      }
    },
    checkValue: z
      .object({
        user: z.object({
          id: z.string(),
          firstName: z.string(),
          lastName: z.string(),
          email: z.string(),
          image: z.string(),
          groups: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              isLeader: z.boolean(),
            }),
          ),
        }),
        permissions: z.record(
          z.string(),
          z.object({
            write: z.boolean(),
            read: z.boolean(),
            write_all: z.boolean().optional(),
            destroy: z.boolean().optional(),
          }),
        ),
        tihldeUser: z.custom<User>(),
      })
      .optional(),
  });

  return authObject;
}

/**
 * Invalidates the auth used by authClient for the specified token
 * @param token The token to invalidate
 */
export function invalidateAuth(token: string) {
  const cached = cache.get(`auth:${token}`);
  if (cached) {
    cached.metadata.ttl = 0;
  }
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
 * Checks if the user has write_all permission for the given app(s)
 * @param permissions the user permissions
 * @param app the app(s) to check agains
 * @param some if true, the user must only have write permission for one of the apps
 * @returns if the user has write_all permission
 */
export function userHasWriteAllPermission(permissions: Record<string, Permissions>, app: PermissionApp | PermissionApp[], some: boolean = false): boolean {
  if (!Array.isArray(app)) {
    const perm = permissions[app];
    if (!perm) {
      return false;
    }
    return Boolean(perm.write_all);
  }
  if (some) {
    return app.some((p) => userHasWriteAllPermission(permissions, p));
  }
  return app.every((p) => userHasWriteAllPermission(permissions, p));
}

/**
 * Attempts to authenticate the user and redirects to the login page if not authenticated
 * @param request the request object from the loader
 * @returns auth object if authenticated
 * @throws redirect to login page if not authenticated
 */
export async function authClientWithRedirect(request: Request) {
  const auth = await authClient();
  if (!auth) {
    const path = createLoginRedirectUrl(request);
    throw redirect(path);
  }
  return auth;
}

/**
 * Returns the URL to redirect to the login page with the current URL as the redirect target
 * @param request the current request object
 * @returns URL string to redirect to the login page
 */
export function createLoginRedirectUrl(request: Request) {
  return createPath({
    pathname: href('/logg-inn'),
    search: createSearchParams({
      redirectTo: new URL(request.url).pathname,
    }).toString(),
  }).toString();
}
