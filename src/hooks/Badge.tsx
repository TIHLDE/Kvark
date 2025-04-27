/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInfiniteQuery, useMutation, type UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';
import API from '~/api/api';
import { USER_BADGES_QUERY_KEY } from '~/hooks/User';
import type { Badge, BadgeCategory, BadgeLeaderboard, BadgesOverallLeaderboard, PaginationResponse, RequestResponse } from '~/types';

export const BADGES_QUERY_KEYS = {
  self: ['badges'],
  list: (filters?: any) => [...BADGES_QUERY_KEYS.self, 'list', filters],
  categories: {
    list: (filters?: any) => [...BADGES_QUERY_KEYS.self, 'categories', filters],
    detail: (badgeCategoryId: BadgeCategory['id']) => [...BADGES_QUERY_KEYS.categories.list(), badgeCategoryId],
  },
  overallLeaderboard: (filters?: any) => [...BADGES_QUERY_KEYS.self, 'overall_leaderboard', filters],
  badge: {
    detail: (badgeId: Badge['id']) => [...BADGES_QUERY_KEYS.self, badgeId],
    leaderboard: (badgeId: Badge['id'], filters?: any) => [...BADGES_QUERY_KEYS.badge.detail(badgeId), 'leaderboard', filters],
  },
} as const;

export const useBadge = (badgeId: Badge['id']) =>
  useQuery({
    queryKey: BADGES_QUERY_KEYS.badge.detail(badgeId),
    queryFn: () => API.getBadge(badgeId),
  });

export const useBadges = (filters?: any) =>
  useInfiniteQuery<PaginationResponse<Badge>, RequestResponse>({
    queryKey: BADGES_QUERY_KEYS.list(filters),
    queryFn: ({ pageParam }) => API.getBadges({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });

export const useCreateBadge = (): UseMutationResult<RequestResponse, RequestResponse, string, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (flag) => API.createUserBadge({ flag }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USER_BADGES_QUERY_KEY],
      });
    },
  });
};

export const useBadgeCategories = (filters?: any) =>
  useInfiniteQuery<PaginationResponse<BadgeCategory>, RequestResponse>({
    queryKey: BADGES_QUERY_KEYS.categories.list(filters),
    queryFn: ({ pageParam }) => API.getBadgeCategories({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });

export const useBadgeLeaderboard = (badgeId: Badge['id'], filters?: any) =>
  useInfiniteQuery<PaginationResponse<BadgeLeaderboard>, RequestResponse>({
    queryKey: BADGES_QUERY_KEYS.badge.leaderboard(badgeId, filters),
    queryFn: ({ pageParam }) => API.getBadgeLeaderboard(badgeId, { ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });

export const useBadgesOverallLeaderboard = (filters?: any) =>
  useInfiniteQuery<PaginationResponse<BadgesOverallLeaderboard>, RequestResponse>({
    queryKey: BADGES_QUERY_KEYS.overallLeaderboard(filters),
    queryFn: ({ pageParam }) => API.getOverallBadgesLeaderboard({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });

export const useBadgeCategory = (badgeCategoryId: BadgeCategory['id']) =>
  useQuery({
    queryKey: BADGES_QUERY_KEYS.categories.detail(badgeCategoryId),
    queryFn: () => API.getBadgeCategory(badgeCategoryId),
  });
