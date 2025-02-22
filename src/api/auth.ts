import { ACCESS_TOKEN } from '~/constant';
import { MembershipType } from '~/types/Enums';
import { z } from 'zod';

import API from './api';
import { cachified } from './cache';
import { getCookie } from './cookie';

export async function authClient() {
  const token = getCookie(ACCESS_TOKEN);
  if (!token) {
    return undefined;
  }

  const authObject = await cachified({
    key: `auth:${token}`,
    ttl: 5 * 60 * 1000, // 5 minutes
    getFreshValue: async () => {
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
      return { user: authUser, permissions: permission.permissions };
    },
    checkValue: z.object({
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
    }),
  });

  return authObject;
}
