/* eslint-disable @typescript-eslint/no-explicit-any */

import { queryOptions, useInfiniteQuery, useMutation, useQuery, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import API from '~/api/api';
import type {
  Group,
  GroupCreate,
  GroupFine,
  GroupFineBatchMutate,
  GroupFineCreate,
  GroupFineDefenseMutate,
  GroupFineMutate,
  GroupLaw,
  GroupLawMutate,
  GroupMutate,
  GroupUserFine,
  PaginationResponse,
  RequestResponse,
  User,
} from '~/types';
import { GroupType } from '~/types/Enums';
import { useMemo } from 'react';

export const GROUPS_QUERY_KEYS = {
  all: ['groups'],
  list: (filters?: any) => [...GROUPS_QUERY_KEYS.all, 'list', ...(filters ? [filters] : [])],
  detail: (slug: Group['slug']) => [...GROUPS_QUERY_KEYS.all, slug],
  laws: (slug: Group['slug']) => [...GROUPS_QUERY_KEYS.detail(slug), 'laws'],
  statistics: (slug: Group['slug']) => [...GROUPS_QUERY_KEYS.detail(slug), 'statistics'],
  fines: {
    all: (slug: Group['slug']) => [...GROUPS_QUERY_KEYS.detail(slug), 'fines'],
    statistics: (slug: Group['slug']) => [...GROUPS_QUERY_KEYS.fines.all(slug), 'statistics'],
    list: (slug: Group['slug'], filters?: any) => [...GROUPS_QUERY_KEYS.fines.all(slug), ...(filters ? [filters] : [])],
    usersFines: (slug: Group['slug'], filters?: any) => [...GROUPS_QUERY_KEYS.fines.all(slug), 'user-fines', ...(filters ? [filters] : [])],
    userFines: (slug: Group['slug'], userId: User['user_id'], filters?: any) => [
      ...GROUPS_QUERY_KEYS.fines.usersFines(slug),
      userId,
      ...(filters ? [filters] : []),
    ],
  },
  forms: {
    all: (slug: Group['slug']) => [...GROUPS_QUERY_KEYS.detail(slug), 'forms'],
  },
} as const;

export function getGroupQueryOptions(slug: Group['slug']) {
  return queryOptions({
    queryKey: GROUPS_QUERY_KEYS.detail(slug),
    queryFn: () => API.getGroup(slug),
  });
}

export function getGroupsQueryOptions(filters?: any) {
  return queryOptions({
    queryKey: GROUPS_QUERY_KEYS.list(filters),
    queryFn: () => API.getGroups({ ...(filters ?? {}) }),
  });
}

export const useGroup = (slug: Group['slug']) => useQuery(getGroupQueryOptions(slug));

export const useUpdateGroup = (): UseMutationResult<Group, RequestResponse, GroupMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (group) => API.updateGroup(group.slug, group),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.all });
      queryClient.setQueryData(getGroupQueryOptions(data.slug).queryKey, data);
    },
  });
};

export const useGroups = (filters?: any) => useQuery(getGroupsQueryOptions(filters));
export const useStudyGroups = (filters?: any) => useGroups({ ...filters, type: GroupType.STUDY });
export const useStudyyearGroups = (filters?: any) => useGroups({ ...filters, type: GroupType.STUDYYEAR });

export const useGroupsByType = (filters?: any) => {
  const { data: groups, ...response } = useGroups(filters);
  const BOARD_GROUPS = useMemo(() => groups?.filter((group) => group.type === GroupType.BOARD) || [], [groups]);
  const SUB_GROUPS = useMemo(() => groups?.filter((group) => group.type === GroupType.SUBGROUP) || [], [groups]);
  const COMMITTEES = useMemo(() => groups?.filter((group) => group.type === GroupType.COMMITTEE) || [], [groups]);
  const INTERESTGROUPS = useMemo(() => groups?.filter((group) => group.type === GroupType.INTERESTGROUP) || [], [groups]);
  const STUDYGROUPS = useMemo(() => groups?.filter((group) => group.type === GroupType.STUDY) || [], [groups]);
  const STUDYYEARGROUPS = useMemo(() => groups?.filter((group) => group.type === GroupType.STUDYYEAR) || [], [groups]);
  const OTHER_GROUPS = useMemo(
    () =>
      groups?.filter(
        (group) => ![...BOARD_GROUPS, ...SUB_GROUPS, ...COMMITTEES, ...INTERESTGROUPS, ...STUDYGROUPS, ...STUDYYEARGROUPS].some((g) => group.slug === g.slug),
      ) || [],
    [groups, BOARD_GROUPS, SUB_GROUPS, COMMITTEES, STUDYGROUPS, STUDYYEARGROUPS],
  );
  return { BOARD_GROUPS, SUB_GROUPS, COMMITTEES, INTERESTGROUPS, STUDYGROUPS, STUDYYEARGROUPS, OTHER_GROUPS, data: groups, ...response };
};

export const useGroupLaws = (groupSlug: Group['slug'], options: { enabled?: boolean } = {}) =>
  useQuery({
    queryKey: GROUPS_QUERY_KEYS.laws(groupSlug),
    queryFn: () => API.getGroupLaws(groupSlug),
    ...options,
  });

export const useCreateGroupLaw = (groupSlug: Group['slug']): UseMutationResult<GroupLaw, RequestResponse, GroupLawMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => API.createGroupLaw(groupSlug, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.laws(groupSlug) }),
  });
};

export const useUpdateGroupLaw = (groupSlug: Group['slug'], lawId: GroupLaw['id']): UseMutationResult<GroupLaw, RequestResponse, GroupLawMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => API.updateGroupLaw(groupSlug, lawId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.laws(groupSlug) }),
  });
};

export const useDeleteGroupLaw = (groupSlug: Group['slug'], lawId: GroupLaw['id']): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => API.deleteGroupLaw(groupSlug, lawId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.laws(groupSlug) }),
  });
};

export const useGroupFines = (groupSlug: Group['slug'], filters?: any, options: { enabled?: boolean } = {}) =>
  useInfiniteQuery<PaginationResponse<GroupFine>, RequestResponse>({
    queryKey: GROUPS_QUERY_KEYS.fines.list(groupSlug, filters),
    queryFn: ({ pageParam }) => API.getGroupFines(groupSlug, { ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
    ...options,
  });

export const useGroupFinesStatistics = (slug: Group['slug']) =>
  useQuery({
    queryKey: GROUPS_QUERY_KEYS.fines.statistics(slug),
    queryFn: () => API.getGroupFinesStatistics(slug),
  });

export const useGroupUserFines = (groupSlug: Group['slug'], userId: User['user_id'], filters?: any, options: { enabled?: boolean } = {}) =>
  useInfiniteQuery<PaginationResponse<GroupFine>, RequestResponse>({
    queryKey: GROUPS_QUERY_KEYS.fines.userFines(groupSlug, userId, filters),
    queryFn: ({ pageParam }) => API.getGroupUserFines(groupSlug, userId, { ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
    ...options,
  });

export const useGroupUsersFines = (groupSlug: Group['slug'], filters?: any, options: { enabled?: boolean } = {}) =>
  useInfiniteQuery<PaginationResponse<GroupUserFine>, RequestResponse>({
    queryKey: GROUPS_QUERY_KEYS.fines.usersFines(groupSlug, filters),
    queryFn: ({ pageParam }) => API.getGroupUsersFines(groupSlug, { ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
    ...options,
  });

export const useCreateGroupFine = (groupSlug: Group['slug']): UseMutationResult<GroupFine, RequestResponse, GroupFineCreate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => API.createGroupFine(groupSlug, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.fines.all(groupSlug) }),
  });
};

export const useUpdateGroupFine = (
  groupSlug: Group['slug'],
  fineId: GroupFine['id'],
): UseMutationResult<GroupFine, RequestResponse, GroupFineMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => API.updateGroupFine(groupSlug, fineId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.fines.all(groupSlug) }),
  });
};

export const useUpdateGroupFineDefense = (
  groupSlug: Group['slug'],
  fineId: GroupFine['id'],
): UseMutationResult<GroupFine, RequestResponse, GroupFineDefenseMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => API.updateGroupFineDefense(groupSlug, fineId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.fines.all(groupSlug) }),
  });
};

export const useBatchUpdateGroupFine = (groupSlug: Group['slug']): UseMutationResult<RequestResponse, RequestResponse, GroupFineBatchMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => API.batchUpdateGroupFine(groupSlug, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.fines.all(groupSlug) }),
  });
};

export const useBatchUpdateUserGroupFines = (
  groupSlug: Group['slug'],
  userId: User['user_id'],
): UseMutationResult<RequestResponse, RequestResponse, GroupFineMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => API.batchUpdateUserGroupFines(groupSlug, userId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.fines.all(groupSlug) }),
  });
};

export const useDeleteGroupFine = (
  groupSlug: Group['slug'],
  fineId: GroupFine['id'],
): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => API.deleteGroupFine(groupSlug, fineId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.fines.all(groupSlug) }),
  });
};

export const useGroupForms = (groupSlug: string, enabled?: boolean) =>
  useQuery({
    queryKey: GROUPS_QUERY_KEYS.forms.all(groupSlug),
    queryFn: () => API.getGroupForms(groupSlug),
    enabled,
  });

export const useGroupStatistics = (groupSlug: string) =>
  useQuery({
    queryKey: GROUPS_QUERY_KEYS.statistics(groupSlug),
    queryFn: () => API.getGroupStatistics(groupSlug),
  });

export const useCreateGroup = (): UseMutationResult<Group, RequestResponse, GroupCreate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (group) => API.createGroup(group),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.all });
      queryClient.setQueryData(GROUPS_QUERY_KEYS.detail(data.slug), data);
    },
  });
};
