import { useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';
import API from 'api/api';
import { Membership, RequestResponse } from 'types/Types';
import { MembershipType } from 'types/Enums';
import { GROUPS_QUERY_KEY } from 'api/hooks/Group';

export const QUERY_KEY = 'membership';
export const useMemberships = (slug: string) => {
  return useQuery<Membership[]>([QUERY_KEY, slug], () => API.getMemberships(slug));
};

export const useCreateMembership = (): UseMutationResult<Membership, RequestResponse, { groupSlug: string; userId: string }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(({ groupSlug, userId }) => API.createMembership(groupSlug, userId), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEY, data.group.slug]);
      queryClient.setQueryData([QUERY_KEY, data.group.slug], (cache) => [...Array(cache), data]);
    },
  });
};

export const useDeleteMembership = (slug: string, user_id: string): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();

  return useMutation(() => API.deleteMembership(slug, user_id), {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY, slug]);
    },
  });
};

export const useUpdateMembership = (slug: string, user_id: string): UseMutationResult<Membership, RequestResponse, MembershipType, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((membership_type) => API.updateMembership(slug, user_id, { membership_type }), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEY, slug]);
      queryClient.setQueryData([GROUPS_QUERY_KEY, slug], data.group);
    },
  });
};
