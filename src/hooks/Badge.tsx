import { QueryKey, useInfiniteQuery, UseInfiniteQueryOptions, useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryOptions } from 'react-query';

import { Badge, BadgeCategory, BadgesOverallLeaderboard, PaginationResponse, RequestResponse } from 'types';

import API from 'api/api';

import { USER_BADGES_QUERY_KEY } from 'hooks/User';

export const BADGES_QUERY_KEYS = {
  self: ['badges'] as const,
  categories: () => [...BADGES_QUERY_KEYS.self, 'categories'] as const,
  overallLeaderboard: () => [...BADGES_QUERY_KEYS.self, 'overall_leaderboard'] as const,
};

export const useBadge = (badgeId: Badge['id'], options?: UseQueryOptions<Badge, RequestResponse, Badge, QueryKey>) =>
  useQuery<Badge, RequestResponse>(BADGES_QUERY_KEYS.self, () => API.getBadge(badgeId), options);

export const useBadges = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters?: any,
  options?: UseInfiniteQueryOptions<PaginationResponse<Badge>, RequestResponse, PaginationResponse<Badge>, PaginationResponse<Badge>, QueryKey>,
) =>
  useInfiniteQuery<PaginationResponse<Badge>, RequestResponse>(BADGES_QUERY_KEYS.self, ({ pageParam = 1 }) => API.getBadges({ ...filters, page: pageParam }), {
    ...options,
    getNextPageParam: (lastPage) => lastPage.next,
  });

export const useCreateBadge = (): UseMutationResult<RequestResponse, RequestResponse, string, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((flag) => API.createUserBadge({ flag }), {
    onSuccess: () => {
      queryClient.invalidateQueries([USER_BADGES_QUERY_KEY]);
    },
  });
};

export const useBadgeCategories = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters?: any,
  options?: UseInfiniteQueryOptions<
    PaginationResponse<BadgeCategory>,
    RequestResponse,
    PaginationResponse<BadgeCategory>,
    PaginationResponse<BadgeCategory>,
    QueryKey
  >,
) =>
  useInfiniteQuery<PaginationResponse<BadgeCategory>, RequestResponse>(
    BADGES_QUERY_KEYS.categories(),
    ({ pageParam = 1 }) => API.getBadgeCategories({ ...filters, page: pageParam }),
    {
      ...options,
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );

export const useBadgesOverallLeaderboard = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters?: any,
  options?: UseInfiniteQueryOptions<
    PaginationResponse<BadgesOverallLeaderboard>,
    RequestResponse,
    PaginationResponse<BadgesOverallLeaderboard>,
    PaginationResponse<BadgesOverallLeaderboard>,
    QueryKey
  >,
) =>
  useInfiniteQuery<PaginationResponse<BadgesOverallLeaderboard>, RequestResponse>(
    BADGES_QUERY_KEYS.overallLeaderboard(),
    ({ pageParam = 1 }) => API.getOverallBadgesLeaderboard({ ...filters, page: pageParam }),
    {
      ...options,
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
