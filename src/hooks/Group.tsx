import { useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';
import API from 'api/api';
import { Group, RequestResponse } from 'types';

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
