import {
  Group,
  GroupFine,
  GroupFineBatchMutate,
  GroupFineCreate,
  GroupFineDefenseMutate,
  GroupFineMutate,
  GroupFineStatistics,
  GroupForm,
  GroupLaw,
  GroupLawMutate,
  GroupList,
  GroupMutate,
  GroupUserFine,
  PaginationResponse,
  RequestResponse,
  User,
} from 'types';

import { IFetch } from 'api/fetch';

import { FORMS_ENDPOINT, GROUP_FINES_ENDPOINT, GROUP_LAWS_ENDPOINT, GROUPS_ENDPOINT, USERS_ENDPOINT } from './api';

export const GROUP_API = {
  // Group
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getGroups: (filters?: any) => IFetch<GroupList[]>({ method: 'GET', url: `${GROUPS_ENDPOINT}/`, data: filters || {} }),
  getGroup: (slug: Group['slug']) => IFetch<Group>({ method: 'GET', url: `${GROUPS_ENDPOINT}/${slug}/` }),
  updateGroup: (slug: Group['slug'], data: GroupMutate) => IFetch<Group>({ method: 'PUT', url: `${GROUPS_ENDPOINT}/${slug}/`, data }),

  // Group laws
  getGroupLaws: (groupSlug: Group['slug']) => IFetch<Array<GroupLaw>>({ method: 'GET', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_LAWS_ENDPOINT}/` }),
  createGroupLaw: (groupSlug: Group['slug'], data: GroupLawMutate) =>
    IFetch<GroupLaw>({ method: 'POST', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_LAWS_ENDPOINT}/`, data }),
  updateGroupLaw: (groupSlug: Group['slug'], lawId: GroupLaw['id'], data: GroupLawMutate) =>
    IFetch<GroupLaw>({ method: 'PUT', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_LAWS_ENDPOINT}/${lawId}/`, data }),
  deleteGroupLaw: (groupSlug: Group['slug'], lawId: GroupLaw['id']) =>
    IFetch<RequestResponse>({ method: 'DELETE', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_LAWS_ENDPOINT}/${lawId}/` }),

  // Group fines
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getGroupFines: (groupSlug: Group['slug'], filters?: any) =>
    IFetch<PaginationResponse<GroupFine>>({ method: 'GET', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/`, data: filters || {} }),
  getGroupFinesStatistics: (groupSlug: Group['slug']) =>
    IFetch<GroupFineStatistics>({ method: 'GET', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/statistics/` }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getGroupUsersFines: (groupSlug: Group['slug'], filters?: any) =>
    IFetch<PaginationResponse<GroupUserFine>>({
      method: 'GET',
      url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/${USERS_ENDPOINT}/`,
      data: filters || {},
    }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getGroupUserFines: (groupSlug: Group['slug'], userId: User['user_id'], filters?: any) =>
    IFetch<PaginationResponse<GroupFine>>({
      method: 'GET',
      url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/${USERS_ENDPOINT}/${userId}/`,
      data: filters || {},
    }),
  createGroupFine: (groupSlug: Group['slug'], data: GroupFineCreate) =>
    IFetch<GroupFine>({ method: 'POST', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/`, data }),
  updateGroupFine: (groupSlug: Group['slug'], fineId: GroupFine['id'], data: GroupFineMutate) =>
    IFetch<GroupFine>({ method: 'PUT', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/${fineId}/`, data }),
  updateGroupFineDefense: (groupSlug: Group['slug'], fineId: GroupFine['id'], data: GroupFineDefenseMutate) =>
    IFetch<GroupFine>({ method: 'PUT', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/${fineId}/defense/`, data }),
  batchUpdateGroupFine: (groupSlug: Group['slug'], data: GroupFineBatchMutate) =>
    IFetch<RequestResponse>({ method: 'PUT', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/batch-update/`, data }),
  batchUpdateUserGroupFines: (groupSlug: Group['slug'], userId: User['user_id'], data: GroupFineMutate) =>
    IFetch<RequestResponse>({ method: 'PUT', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/batch-update/${userId}/`, data }),
  deleteGroupFine: (groupSlug: Group['slug'], fineId: GroupFine['id']) =>
    IFetch<RequestResponse>({ method: 'DELETE', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/${fineId}/` }),

  // Group forms
  getGroupForms: (slug: string) => IFetch<Array<GroupForm>>({ method: 'GET', url: `${GROUPS_ENDPOINT}/${slug}/${FORMS_ENDPOINT}/` }),
};
