import { useMemo } from 'react';
import { useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';
import API from 'api/api';
import { Group, RequestResponse } from 'types';
import { GroupType } from 'types/Enums';

export const GROUPS_QUERY_KEY = 'groups';

export const useGroup = (slug: string) => {
  return useQuery<Group, RequestResponse>([GROUPS_QUERY_KEY, slug], () => API.getGroup(slug));
};
export const useUpdateGroup = (): UseMutationResult<Group, RequestResponse, Group, unknown> => {
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
