import { useMemo } from 'react';
import { useMutation, UseMutationResult, useQuery, useQueryClient, useInfiniteQuery, UseQueryOptions, UseInfiniteQueryOptions, QueryKey } from 'react-query';
import API from 'api/api';
import {
  Group,
  GroupMutate,
  GroupLaw,
  RequestResponse,
  PaginationResponse,
  GroupLawMutate,
  GroupFine,
  GroupFineCreate,
  GroupFineMutate,
  GroupFineBatchMutate,
  GroupUserFine,
  User,
} from 'types';
import { GroupType } from 'types/Enums';

export const GROUPS_QUERY_KEY = 'groups';
export const LAWS_QUERY_KEY = 'laws';
export const FINES_QUERY_KEY = 'fines';
export const USER_FINES_QUERY_KEY = 'user-fines';

export const useGroup = (slug: Group['slug']) => {
  return useQuery<Group, RequestResponse>([GROUPS_QUERY_KEY, slug], () => API.getGroup(slug));
};

export const useUpdateGroup = (): UseMutationResult<Group, RequestResponse, GroupMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation((group) => API.updateGroup(group.slug, group), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([GROUPS_QUERY_KEY, data.slug]);
      queryClient.setQueryData([GROUPS_QUERY_KEY, data.slug], data);
    },
  });
};

export const useGroups = () => {
  return useQuery<Group[], RequestResponse>([GROUPS_QUERY_KEY], () => API.getGroups());
};

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
  useQuery<Array<GroupLaw>, RequestResponse>([GROUPS_QUERY_KEY, groupSlug, LAWS_QUERY_KEY], () => API.getGroupLaws(groupSlug), options);

export const useCreateGroupLaw = (groupSlug: Group['slug']): UseMutationResult<GroupLaw, RequestResponse, GroupLawMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation((data) => API.createGroupLaw(groupSlug, data), {
    onSuccess: () => queryClient.invalidateQueries([GROUPS_QUERY_KEY, groupSlug, LAWS_QUERY_KEY]),
  });
};

export const useUpdateGroupLaw = (groupSlug: Group['slug'], lawId: GroupLaw['id']): UseMutationResult<GroupLaw, RequestResponse, GroupLawMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation((data) => API.updateGroupLaw(groupSlug, lawId, data), {
    onSuccess: () => queryClient.invalidateQueries([GROUPS_QUERY_KEY, groupSlug, LAWS_QUERY_KEY]),
  });
};

export const useDeleteGroupLaw = (groupSlug: Group['slug'], lawId: GroupLaw['id']): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();

  return useMutation(() => API.deleteGroupLaw(groupSlug, lawId), {
    onSuccess: () => queryClient.invalidateQueries([GROUPS_QUERY_KEY, groupSlug, LAWS_QUERY_KEY]),
  });
};

export const useGroupFines = (
  groupSlug: Group['slug'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters?: any,
  options?: UseInfiniteQueryOptions<PaginationResponse<GroupFine>, RequestResponse, PaginationResponse<GroupFine>, PaginationResponse<GroupFine>, QueryKey>,
) =>
  useInfiniteQuery<PaginationResponse<GroupFine>, RequestResponse>(
    [GROUPS_QUERY_KEY, groupSlug, FINES_QUERY_KEY, filters],
    ({ pageParam = 1 }) => API.getGroupFines(groupSlug, { ...filters, page: pageParam }),
    {
      ...options,
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );

export const useGroupUserFines = (
  groupSlug: Group['slug'],
  userId: User['user_id'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters?: any,
  options?: UseInfiniteQueryOptions<PaginationResponse<GroupFine>, RequestResponse, PaginationResponse<GroupFine>, PaginationResponse<GroupFine>, QueryKey>,
) =>
  useInfiniteQuery<PaginationResponse<GroupFine>, RequestResponse>(
    [GROUPS_QUERY_KEY, groupSlug, FINES_QUERY_KEY, USER_FINES_QUERY_KEY, userId, filters],
    ({ pageParam = 1 }) => API.getGroupUserFines(groupSlug, userId, { ...filters, page: pageParam }),
    {
      ...options,
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );

export const useGroupUsersFines = (
  groupSlug: Group['slug'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    [GROUPS_QUERY_KEY, groupSlug, FINES_QUERY_KEY, USER_FINES_QUERY_KEY, filters],
    ({ pageParam = 1 }) => API.getGroupUsersFines(groupSlug, { ...filters, page: pageParam }),
    {
      ...options,
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );

export const useCreateGroupFine = (groupSlug: Group['slug']): UseMutationResult<GroupFine, RequestResponse, GroupFineCreate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation((data) => API.createGroupFine(groupSlug, data), {
    onSuccess: () => queryClient.invalidateQueries([GROUPS_QUERY_KEY, groupSlug, FINES_QUERY_KEY]),
  });
};

export const useUpdateGroupFine = (
  groupSlug: Group['slug'],
  fineId: GroupFine['id'],
): UseMutationResult<GroupFine, RequestResponse, GroupFineMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation((data) => API.updateGroupFine(groupSlug, fineId, data), {
    onSuccess: () => queryClient.invalidateQueries([GROUPS_QUERY_KEY, groupSlug, FINES_QUERY_KEY]),
  });
};

export const useBatchUpdateGroupFine = (groupSlug: Group['slug']): UseMutationResult<RequestResponse, RequestResponse, GroupFineBatchMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation((data) => API.batchUpdateGroupFine(groupSlug, data), {
    onSuccess: () => queryClient.invalidateQueries([GROUPS_QUERY_KEY, groupSlug, FINES_QUERY_KEY]),
  });
};

export const useBatchUpdateUserGroupFines = (
  groupSlug: Group['slug'],
  userId: User['user_id'],
): UseMutationResult<RequestResponse, RequestResponse, GroupFineMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation((data) => API.batchUpdateUserGroupFines(groupSlug, userId, data), {
    onSuccess: () => queryClient.invalidateQueries([GROUPS_QUERY_KEY, groupSlug, FINES_QUERY_KEY]),
  });
};

export const useDeleteGroupFine = (
  groupSlug: Group['slug'],
  fineId: GroupFine['id'],
): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();

  return useMutation(() => API.deleteGroupFine(groupSlug, fineId), {
    onSuccess: () => queryClient.invalidateQueries([GROUPS_QUERY_KEY, groupSlug, FINES_QUERY_KEY]),
  });
};
