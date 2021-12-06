import { useMemo } from 'react';
import { useMutation, UseMutationResult, useQuery, useQueryClient, useInfiniteQuery } from 'react-query';
import API from 'api/api';
import { Group, GroupMutate, Law, RequestResponse, PaginationResponse, LawMutate } from 'types';
import { GroupType } from 'types/Enums';

export const GROUPS_QUERY_KEY = 'groups';
export const LAWS_QUERY_KEY = 'laws';

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

export const useGroupLaws = (groupSlug: Group['slug']) =>
  useInfiniteQuery<PaginationResponse<Law>, RequestResponse>(
    [GROUPS_QUERY_KEY, groupSlug, LAWS_QUERY_KEY],
    ({ pageParam = 1 }) => API.getGroupLaws(groupSlug, { page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );

export const useCreateGroupLaw = (groupSlug: Group['slug']): UseMutationResult<Law, RequestResponse, LawMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation((data) => API.createGroupLaw(groupSlug, data), {
    onSuccess: () => {
      queryClient.invalidateQueries([GROUPS_QUERY_KEY, groupSlug, LAWS_QUERY_KEY]);
    },
  });
};

export const useUpdateGroupLaw = (groupSlug: Group['slug'], lawId: Law['id']): UseMutationResult<Law, RequestResponse, LawMutate, unknown> => {
  const queryClient = useQueryClient();

  return useMutation((data) => API.updateGroupLaw(groupSlug, lawId, data), {
    onSuccess: () => {
      queryClient.invalidateQueries([GROUPS_QUERY_KEY, groupSlug, LAWS_QUERY_KEY]);
    },
  });
};

export const useDeleteGroupLaw = (groupSlug: Group['slug'], lawId: Law['id']): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();

  return useMutation(() => API.deleteGroupLaw(groupSlug, lawId), {
    onSuccess: () => {
      queryClient.invalidateQueries([GROUPS_QUERY_KEY, groupSlug, LAWS_QUERY_KEY]);
    },
  });
};
