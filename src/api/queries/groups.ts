import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type {
  AddGroupMemberData,
  CreateGroupData,
  CreateGroupFormData,
  DeleteGroupData,
  RemoveGroupMemberData,
  UpdateGroupData,
  UpdateGroupMemberRoleData,
} from '~/gen-client/types.gen';

import { photon } from '../photon';
import type { PathParams, Payload } from './helper';

export const groupKeys = {
  all: ['groups'],
  lists: ['groups', 'list'],
  details: ['groups', 'detail'],
  members: ['groups', 'members'],
  forms: ['groups', 'forms'],
} as const;

export const listGroupsQuery = () =>
  queryOptions({
    queryKey: groupKeys.lists,
    queryFn: () => photon.listGroups(),
  });

export const getGroupQuery = (slug: string) =>
  queryOptions({
    queryKey: [...groupKeys.details, slug],
    queryFn: () => photon.getGroup({ path: { slug } }),
  });

export const listGroupMembersQuery = (groupSlug: string) =>
  queryOptions({
    queryKey: [...groupKeys.members, groupSlug],
    queryFn: () => photon.listGroupMembers({ path: { groupSlug } }),
  });

export const listGroupFormsQuery = (slug: string) =>
  queryOptions({
    queryKey: [...groupKeys.forms, slug],
    queryFn: () => photon.listGroupForms({ path: { slug } }),
  });

export const createGroupMutation = mutationOptions({
  mutationFn: (body: Payload<CreateGroupData>) => photon.createGroup({ body }),
  onMutate: async (_, ctx) => {
    await ctx.client.cancelQueries({ queryKey: groupKeys.lists });
  },
  onSuccess: (_, __, ___, ctx) => {
    ctx.client.invalidateQueries({ queryKey: groupKeys.lists });
  },
});

export const updateGroupMutation = (slug: PathParams<UpdateGroupData>['slug']) =>
  mutationOptions({
    mutationFn: (body: Payload<UpdateGroupData>) => photon.updateGroup({ path: { slug }, body }),
    onMutate: async (_, ctx) => {
      await ctx.client.cancelQueries({ queryKey: groupKeys.all });
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: groupKeys.all });
    },
  });

export const deleteGroupMutation = (slug: PathParams<DeleteGroupData>['slug']) =>
  mutationOptions({
    mutationFn: () => photon.deleteGroup({ path: { slug } }),
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: groupKeys.all });
    },
  });

export const addGroupMemberMutation = (groupSlug: PathParams<AddGroupMemberData>['groupSlug']) =>
  mutationOptions({
    mutationFn: (body: Payload<AddGroupMemberData>) => photon.addGroupMember({ path: { groupSlug }, body }),
    onMutate: async (_, ctx) => {
      await ctx.client.cancelQueries({ queryKey: groupKeys.members });
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: groupKeys.members });
    },
  });

export const removeGroupMemberMutation = (groupSlug: PathParams<RemoveGroupMemberData>['groupSlug'], userId: PathParams<RemoveGroupMemberData>['userId']) =>
  mutationOptions({
    mutationFn: () => photon.removeGroupMember({ path: { groupSlug, userId } }),
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: groupKeys.members });
    },
  });

export const updateGroupMemberRoleMutation = (
  groupSlug: PathParams<UpdateGroupMemberRoleData>['groupSlug'],
  userId: PathParams<UpdateGroupMemberRoleData>['userId'],
) =>
  mutationOptions({
    mutationFn: (body: Payload<UpdateGroupMemberRoleData>) => photon.updateGroupMemberRole({ path: { groupSlug, userId }, body }),
    onMutate: async (_, ctx) => {
      await ctx.client.cancelQueries({ queryKey: groupKeys.members });
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: groupKeys.members });
    },
  });

export const createGroupFormMutation = (slug: PathParams<CreateGroupFormData>['slug']) =>
  mutationOptions({
    mutationFn: (body: Payload<CreateGroupFormData>) => photon.createGroupForm({ path: { slug }, body }),
    onMutate: async (_, ctx) => {
      await ctx.client.cancelQueries({ queryKey: groupKeys.forms });
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: groupKeys.forms });
    },
  });
