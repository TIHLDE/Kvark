/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { useMutation, UseMutationResult, useQuery, useQueryClient, useInfiniteQuery, UseQueryOptions, UseInfiniteQueryOptions, QueryKey } from 'react-query';
import API from 'api/api';
import {
  Group,
  GroupMutate,
  GroupLaw,
  GroupLawMutate,
  GroupFine,
  GroupFineCreate,
  GroupFineMutate,
  GroupFineBatchMutate,
  GroupFineStatistics,
  GroupUserFine,
  PaginationResponse,
  RequestResponse,
  User,
} from 'types';
import { GroupType } from 'types/Enums';

export const GROUPS_QUERY_KEYS = {
  all: ['groups'] as const,
  list: (filters?: any) => [...GROUPS_QUERY_KEYS.all, 'list', ...(filters ? [filters] : [])] as const,
  detail: (slug: Group['slug']) => [...GROUPS_QUERY_KEYS.all, slug] as const,
  laws: (slug: Group['slug']) => [...GROUPS_QUERY_KEYS.detail(slug), 'laws'] as const,
  fines: {
    all: (slug: Group['slug']) => [...GROUPS_QUERY_KEYS.detail(slug), 'fines'] as const,
    statistics: (slug: Group['slug']) => [...GROUPS_QUERY_KEYS.fines.all(slug), 'statistics'] as const,
    list: (slug: Group['slug'], filters?: any) => [...GROUPS_QUERY_KEYS.fines.all(slug), ...(filters ? [filters] : [])] as const,
    usersFines: (slug: Group['slug'], filters?: any) => [...GROUPS_QUERY_KEYS.fines.all(slug), 'user-fines', ...(filters ? [filters] : [])] as const,
    userFines: (slug: Group['slug'], userId: User['user_id'], filters?: any) =>
      [...GROUPS_QUERY_KEYS.fines.usersFines(slug), userId, ...(filters ? [filters] : [])] as const,
  },
};

export const useGroup = (slug: Group['slug'], options?: UseQueryOptions<Group, RequestResponse, Group, QueryKey>) =>
  useQuery<Group, RequestResponse>(GROUPS_QUERY_KEYS.detail(slug), () => API.getGroup(slug), options);

export const useUpdateGroup = (): UseMutationResult<Group, RequestResponse, GroupMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation((group) => API.updateGroup(group.slug, group), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(GROUPS_QUERY_KEYS.all);
      queryClient.setQueryData(GROUPS_QUERY_KEYS.detail(data.slug), data);
    },
  });
};

export const useGroups = () => useQuery<Group[], RequestResponse>(GROUPS_QUERY_KEYS.list(), () => API.getGroups());

export const useGroupsByType = () => {
  const { data: groups, ...response } = useGroups();
  const BOARD_GROUPS = useMemo(() => groups?.filter((group) => group.type === GroupType.BOARD) || [], [groups]);
  const SUB_GROUPS = useMemo(() => groups?.filter((group) => group.type === GroupType.SUBGROUP) || [], [groups]);
  const COMMITTEES = useMemo(() => groups?.filter((group) => group.type === GroupType.COMMITTEE) || [], [groups]);
  const INTERESTGROUPS = useMemo(() => groups?.filter((group) => group.type === GroupType.INTERESTGROUP) || [], [groups]);
  const OTHER_GROUPS = useMemo(
    () => groups?.filter((group) => ![...BOARD_GROUPS, ...SUB_GROUPS, ...COMMITTEES, ...INTERESTGROUPS].some((g) => group.slug === g.slug)) || [],
    [groups, BOARD_GROUPS, SUB_GROUPS, COMMITTEES],
  );
  return { BOARD_GROUPS, SUB_GROUPS, COMMITTEES, INTERESTGROUPS, OTHER_GROUPS, data: groups, ...response };
};

export const useGroupLaws = (groupSlug: Group['slug'], options?: UseQueryOptions<Array<GroupLaw>, RequestResponse, Array<GroupLaw>, QueryKey>) =>
  useQuery<Array<GroupLaw>, RequestResponse>(GROUPS_QUERY_KEYS.laws(groupSlug), () => API.getGroupLaws(groupSlug), options);

export const useCreateGroupLaw = (groupSlug: Group['slug']): UseMutationResult<GroupLaw, RequestResponse, GroupLawMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation((data) => API.createGroupLaw(groupSlug, data), {
    onSuccess: () => queryClient.invalidateQueries(GROUPS_QUERY_KEYS.laws(groupSlug)),
  });
};

export const useUpdateGroupLaw = (groupSlug: Group['slug'], lawId: GroupLaw['id']): UseMutationResult<GroupLaw, RequestResponse, GroupLawMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation((data) => API.updateGroupLaw(groupSlug, lawId, data), {
    onSuccess: () => queryClient.invalidateQueries(GROUPS_QUERY_KEYS.laws(groupSlug)),
  });
};

export const useDeleteGroupLaw = (groupSlug: Group['slug'], lawId: GroupLaw['id']): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();

  return useMutation(() => API.deleteGroupLaw(groupSlug, lawId), {
    onSuccess: () => queryClient.invalidateQueries(GROUPS_QUERY_KEYS.laws(groupSlug)),
  });
};

export const useGroupFines = (
  groupSlug: Group['slug'],
  filters?: any,
  options?: UseInfiniteQueryOptions<PaginationResponse<GroupFine>, RequestResponse, PaginationResponse<GroupFine>, PaginationResponse<GroupFine>, QueryKey>,
) =>
  useInfiniteQuery<PaginationResponse<GroupFine>, RequestResponse>(
    GROUPS_QUERY_KEYS.fines.list(groupSlug, filters),
    ({ pageParam = 1 }) => API.getGroupFines(groupSlug, { ...filters, page: pageParam }),
    {
      ...options,
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );

export const useGroupFinesStatistics = (slug: Group['slug'], options?: UseQueryOptions<GroupFineStatistics, RequestResponse, GroupFineStatistics, QueryKey>) =>
  useQuery<GroupFineStatistics, RequestResponse>(GROUPS_QUERY_KEYS.fines.statistics(slug), () => API.getGroupFinesStatistics(slug), options);

export const useGroupUserFines = (
  groupSlug: Group['slug'],
  userId: User['user_id'],
  filters?: any,
  options?: UseInfiniteQueryOptions<PaginationResponse<GroupFine>, RequestResponse, PaginationResponse<GroupFine>, PaginationResponse<GroupFine>, QueryKey>,
) =>
  useInfiniteQuery<PaginationResponse<GroupFine>, RequestResponse>(
    GROUPS_QUERY_KEYS.fines.userFines(groupSlug, userId, filters),
    ({ pageParam = 1 }) => API.getGroupUserFines(groupSlug, userId, { ...filters, page: pageParam }),
    {
      ...options,
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );

export const useGroupUsersFines = (
  groupSlug: Group['slug'],
  filters?: any,
  options?: UseInfiniteQueryOptions<
    PaginationResponse<GroupUserFine>,
    RequestResponse,
    PaginationResponse<GroupUserFine>,
    PaginationResponse<GroupUserFine>,
    QueryKey
  >,
) =>
  useInfiniteQuery<PaginationResponse<GroupUserFine>, RequestResponse>(
    GROUPS_QUERY_KEYS.fines.usersFines(groupSlug, filters),
    ({ pageParam = 1 }) => API.getGroupUsersFines(groupSlug, { ...filters, page: pageParam }),
    {
      ...options,
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );

export const useCreateGroupFine = (groupSlug: Group['slug']): UseMutationResult<GroupFine, RequestResponse, GroupFineCreate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation((data) => API.createGroupFine(groupSlug, data), {
    onSuccess: () => queryClient.invalidateQueries(GROUPS_QUERY_KEYS.fines.all(groupSlug)),
  });
};

export const useUpdateGroupFine = (
  groupSlug: Group['slug'],
  fineId: GroupFine['id'],
): UseMutationResult<GroupFine, RequestResponse, GroupFineMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation((data) => API.updateGroupFine(groupSlug, fineId, data), {
    onSuccess: () => queryClient.invalidateQueries(GROUPS_QUERY_KEYS.fines.all(groupSlug)),
  });
};

export const useBatchUpdateGroupFine = (groupSlug: Group['slug']): UseMutationResult<RequestResponse, RequestResponse, GroupFineBatchMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation((data) => API.batchUpdateGroupFine(groupSlug, data), {
    onSuccess: () => queryClient.invalidateQueries(GROUPS_QUERY_KEYS.fines.all(groupSlug)),
  });
};

export const useBatchUpdateUserGroupFines = (
  groupSlug: Group['slug'],
  userId: User['user_id'],
): UseMutationResult<RequestResponse, RequestResponse, GroupFineMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation((data) => API.batchUpdateUserGroupFines(groupSlug, userId, data), {
    onSuccess: () => queryClient.invalidateQueries(GROUPS_QUERY_KEYS.fines.all(groupSlug)),
  });
};

export const useDeleteGroupFine = (
  groupSlug: Group['slug'],
  fineId: GroupFine['id'],
): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();

  return useMutation(() => API.deleteGroupFine(groupSlug, fineId), {
    onSuccess: () => queryClient.invalidateQueries(GROUPS_QUERY_KEYS.fines.all(groupSlug)),
  });
};
