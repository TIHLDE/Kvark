import { type QueryKey, useInfiniteQuery, type UseInfiniteQueryOptions, useMutation, type UseMutationResult, useQueryClient } from '@tanstack/react-query';
import API from '~/api/api';
import { GROUPS_QUERY_KEYS } from '~/hooks/Group';
import type { Group, Membership, MembershipHistory, MembershipHistoryMutate, PaginationResponse, RequestResponse, User } from '~/types';
import { MembershipType } from '~/types/Enums';

export const MEMBERSHIP_QUERY_KEY = 'membership';
export const MEMBERSHIP_HISTORY_QUERY_KEY = 'membership-history';

export const useMemberships = (
  groupSlug: Group['slug'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters?: any,
  options?: UseInfiniteQueryOptions<PaginationResponse<Membership>, RequestResponse, PaginationResponse<Membership>, PaginationResponse<Membership>, QueryKey>,
) => {
  return useInfiniteQuery<PaginationResponse<Membership>, RequestResponse>(
    [MEMBERSHIP_QUERY_KEY, groupSlug],
    ({ pageParam = 1 }) => API.getMemberships(groupSlug, { ...filters, page: pageParam }),
    {
      ...options,
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useMembershipHistories = (groupSlug: Group['slug'], filters?: any) => {
  return useInfiniteQuery<PaginationResponse<MembershipHistory>, RequestResponse>(
    [MEMBERSHIP_QUERY_KEY, groupSlug, MEMBERSHIP_HISTORY_QUERY_KEY],
    ({ pageParam = 1 }) => API.getMembershipsHistories(groupSlug, { ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};

export const useCreateMembership = (): UseMutationResult<Membership, RequestResponse, { groupSlug: Group['slug']; userId: User['user_id'] }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupSlug, userId }) => API.createMembership(groupSlug, userId),
    onSuccess: (_, { groupSlug }) => queryClient.invalidateQueries([MEMBERSHIP_QUERY_KEY, groupSlug]),
  });
};

export const useDeleteMembership = (
  groupSlug: Group['slug'],
  userId: User['user_id'],
): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => API.deleteMembership(groupSlug, userId),
    onSuccess: () => queryClient.invalidateQueries([MEMBERSHIP_QUERY_KEY, groupSlug]),
  });
};

export const useUpdateMembership = (
  groupSlug: Group['slug'],
  userId: User['user_id'],
): UseMutationResult<Membership, RequestResponse, MembershipType, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (membership_type) => API.updateMembership(groupSlug, userId, { membership_type }),
    onSuccess: () => {
      queryClient.invalidateQueries(GROUPS_QUERY_KEYS.detail(groupSlug));
      queryClient.invalidateQueries([MEMBERSHIP_QUERY_KEY, groupSlug]);
    },
  });
};

export const useDeleteMembershipHistory = (
  groupSlug: Group['slug'],
  id: MembershipHistory['id'],
): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => API.deleteMembershipHistory(groupSlug, id),
    onSuccess: () => queryClient.invalidateQueries([MEMBERSHIP_QUERY_KEY, groupSlug, MEMBERSHIP_HISTORY_QUERY_KEY]),
  });
};

export const useUpdateMembershipHistory = (
  groupSlug: Group['slug'],
  id: MembershipHistory['id'],
): UseMutationResult<MembershipHistory, RequestResponse, MembershipHistoryMutate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => API.updateMembershipHistory(groupSlug, id, data),
    onSuccess: () => queryClient.invalidateQueries([MEMBERSHIP_QUERY_KEY, groupSlug, MEMBERSHIP_HISTORY_QUERY_KEY]),
  });
};
