import { useInfiniteQuery, useMutation, UseMutationResult, useQueryClient } from 'react-query';
import API from 'api/api';
import { Membership, MembershipHistory, PaginationResponse, RequestResponse } from 'types';
import { MembershipType } from 'types/Enums';
import { GROUPS_QUERY_KEYS } from 'hooks/Group';

export const MEMBERSHIP_QUERY_KEY = 'membership';
export const MEMBERSHIP_HISTORY_QUERY_KEY = 'membership-history';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useMemberships = (groupSlug: string, filters?: any) => {
  return useInfiniteQuery<PaginationResponse<Membership>, RequestResponse>(
    [MEMBERSHIP_QUERY_KEY, groupSlug],
    ({ pageParam = 1 }) => API.getMemberships(groupSlug, { ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useMembershipHistories = (groupSlug: string, filters?: any) => {
  return useInfiniteQuery<PaginationResponse<MembershipHistory>, RequestResponse>(
    [MEMBERSHIP_QUERY_KEY, groupSlug, MEMBERSHIP_HISTORY_QUERY_KEY],
    ({ pageParam = 1 }) => API.getMembershipsHistories(groupSlug, { ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};

export const useCreateMembership = (): UseMutationResult<Membership, RequestResponse, { groupSlug: string; userId: string }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(({ groupSlug, userId }) => API.createMembership(groupSlug, userId), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([MEMBERSHIP_QUERY_KEY, data.group.slug]);
    },
  });
};

export const useDeleteMembership = (slug: string, userId: string): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();

  return useMutation(() => API.deleteMembership(slug, userId), {
    onSuccess: () => {
      queryClient.invalidateQueries([MEMBERSHIP_QUERY_KEY, slug]);
    },
  });
};

export const useUpdateMembership = (slug: string, userId: string): UseMutationResult<Membership, RequestResponse, MembershipType, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((membership_type) => API.updateMembership(slug, userId, { membership_type }), {
    onSuccess: () => {
      queryClient.invalidateQueries(GROUPS_QUERY_KEYS.detail(slug));
      queryClient.invalidateQueries([MEMBERSHIP_QUERY_KEY, slug]);
    },
  });
};
