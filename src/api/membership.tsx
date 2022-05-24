import { Group, Membership, MembershipHistory, MembershipHistoryMutate, PaginationResponse, RequestResponse, User } from 'types';
import { MembershipType } from 'types/Enums';

import { IFetch } from 'api/fetch';

import { GROUPS_ENDPOINT, MEMBERSHIP_HISTORIES_ENDPOINT, MEMBERSHIPS_ENDPOINT } from './api';

export const MEMBERSHIP_API = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMemberships: (groupSlug: Group['slug'], filters?: any) =>
    IFetch<PaginationResponse<Membership>>({ method: 'GET', url: `${GROUPS_ENDPOINT}/${groupSlug}/${MEMBERSHIPS_ENDPOINT}/`, data: filters || {} }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMembershipsHistories: (groupSlug: Group['slug'], filters?: any) =>
    IFetch<PaginationResponse<MembershipHistory>>({
      method: 'GET',
      url: `${GROUPS_ENDPOINT}/${groupSlug}/${MEMBERSHIP_HISTORIES_ENDPOINT}/`,
      data: filters || {},
    }),
  createMembership: (groupSlug: Group['slug'], userId: User['user_id']) =>
    IFetch<Membership>({ method: 'POST', url: `${GROUPS_ENDPOINT}/${groupSlug}/${MEMBERSHIPS_ENDPOINT}/`, data: { user: { user_id: userId } } }),
  deleteMembership: (groupSlug: Group['slug'], userId: User['user_id']) =>
    IFetch<RequestResponse>({ method: 'DELETE', url: `${GROUPS_ENDPOINT}/${groupSlug}/${MEMBERSHIPS_ENDPOINT}/${userId}/` }),
  updateMembership: (groupSlug: Group['slug'], userId: User['user_id'], data: { membership_type: MembershipType }) =>
    IFetch<Membership>({ method: 'PUT', url: `${GROUPS_ENDPOINT}/${groupSlug}/${MEMBERSHIPS_ENDPOINT}/${userId}/`, data }),
  deleteMembershipHistory: (groupSlug: Group['slug'], id: MembershipHistory['id']) =>
    IFetch<RequestResponse>({ method: 'DELETE', url: `${GROUPS_ENDPOINT}/${groupSlug}/${MEMBERSHIP_HISTORIES_ENDPOINT}/${id}/` }),
  updateMembershipHistory: (groupSlug: Group['slug'], id: MembershipHistory['id'], data: MembershipHistoryMutate) =>
    IFetch<MembershipHistory>({ method: 'PUT', url: `${GROUPS_ENDPOINT}/${groupSlug}/${MEMBERSHIP_HISTORIES_ENDPOINT}/${id}/`, data }),
};
