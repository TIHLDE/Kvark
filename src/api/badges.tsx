import { Badge, BadgeCategory, BadgeLeaderboard, BadgesOverallLeaderboard, PaginationResponse, RequestResponse } from 'types';

import { IFetch } from 'api/fetch';

import { BADGE_CATEGORIES_ENDPOINT, BADGES_ENDPOINT, BADGES_LEADERBOARD_ENDPOINT, ME_ENDPOINT, USERS_ENDPOINT } from './api';

export const BADGES_API = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getBadge: (badgeId: Badge['id']) => IFetch<Badge>({ method: 'GET', url: `${BADGES_ENDPOINT}/${badgeId}/` }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getBadges: (filters?: any) => IFetch<PaginationResponse<Badge>>({ method: 'GET', url: `${BADGES_ENDPOINT}/`, data: filters || {} }),
  createUserBadge: (data: { flag: string }) => IFetch<RequestResponse>({ method: 'POST', url: `${USERS_ENDPOINT}/${ME_ENDPOINT}/${BADGES_ENDPOINT}/`, data }),
  getBadgeLeaderboard: (badgeId: Badge['id'], filters?: any) =>
    IFetch<PaginationResponse<BadgeLeaderboard>>({ method: 'GET', url: `${BADGES_ENDPOINT}/${badgeId}/${BADGES_LEADERBOARD_ENDPOINT}/`, data: filters || {} }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getOverallBadgesLeaderboard: (filters?: any) =>
    IFetch<PaginationResponse<BadgesOverallLeaderboard>>({ method: 'GET', url: `${BADGES_ENDPOINT}/${BADGES_LEADERBOARD_ENDPOINT}/`, data: filters || {} }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getBadgeCategories: (filters?: any) =>
    IFetch<PaginationResponse<BadgeCategory>>({ method: 'GET', url: `${BADGES_ENDPOINT}/${BADGE_CATEGORIES_ENDPOINT}/`, data: filters || {} }),
  getBadgeCategory: (badgeCategoryId: BadgeCategory['id']) =>
    IFetch<BadgeCategory>({ method: 'GET', url: `${BADGES_ENDPOINT}/${BADGE_CATEGORIES_ENDPOINT}/${badgeCategoryId}/` }),
};
