import {
  Badge,
  EventList,
  Form,
  LoginRequestResponse,
  Membership,
  MembershipHistory,
  PaginationResponse,
  RequestResponse,
  Strike,
  User,
  UserCreate,
  UserNotificationSetting,
  UserNotificationSettingChoice,
  UserPermissions,
} from 'types';

import { IFetch } from 'api/fetch';

import {
  AUTH_ENDPOINT,
  BADGES_ENDPOINT,
  EVENTS_ENDPOINT,
  FORMS_ENDPOINT,
  ME_ENDPOINT,
  MEMBERSHIP_HISTORIES_ENDPOINT,
  MEMBERSHIPS_ENDPOINT,
  NOTIFICATION_SETTINGS_ENDPOINT,
  STRIKES_ENDPOINT,
  USERS_ENDPOINT,
} from './api';

export const USER_API = {
  // Auth
  createUser: (item: UserCreate) => IFetch<RequestResponse>({ method: 'POST', url: `${USERS_ENDPOINT}/`, data: item, withAuth: false }),
  authenticate: (username: string, password: string) =>
    IFetch<LoginRequestResponse>({
      method: 'POST',
      url: `${AUTH_ENDPOINT}/login/`,
      data: { user_id: username, password: password },
      withAuth: false,
    }),
  forgotPassword: (email: string) =>
    IFetch<RequestResponse>({ method: 'POST', url: `${AUTH_ENDPOINT}/rest-auth/password/reset/`, data: { email: email }, withAuth: false }),

  // User
  getUserData: (userId?: User['user_id']) => IFetch<User>({ method: 'GET', url: `${USERS_ENDPOINT}/${userId || ME_ENDPOINT}/` }),
  getUserPermissions: () => IFetch<UserPermissions>({ method: 'GET', url: `${USERS_ENDPOINT}/${ME_ENDPOINT}/permissions/` }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getUserBadges: (userId?: User['user_id'], filters?: any) =>
    IFetch<PaginationResponse<Badge>>({ method: 'GET', url: `${USERS_ENDPOINT}/${userId || ME_ENDPOINT}/${BADGES_ENDPOINT}/`, data: filters || {} }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getUserEvents: (userId?: User['user_id'], filters?: any) =>
    IFetch<PaginationResponse<EventList>>({ method: 'GET', url: `${USERS_ENDPOINT}/${userId || ME_ENDPOINT}/${EVENTS_ENDPOINT}/`, data: filters || {} }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getUserForms: (filters?: any) =>
    IFetch<PaginationResponse<Form>>({ method: 'GET', url: `${USERS_ENDPOINT}/${ME_ENDPOINT}/${FORMS_ENDPOINT}/`, data: filters || {} }),
  getUserMemberships: (userId?: User['user_id']) =>
    IFetch<PaginationResponse<Membership>>({ method: 'GET', url: `${USERS_ENDPOINT}/${userId || ME_ENDPOINT}/${MEMBERSHIPS_ENDPOINT}/` }),
  getUserMembershipHistories: (userId?: User['user_id']) =>
    IFetch<PaginationResponse<MembershipHistory>>({ method: 'GET', url: `${USERS_ENDPOINT}/${userId || ME_ENDPOINT}/${MEMBERSHIP_HISTORIES_ENDPOINT}/` }),
  getUserStrikes: (userId?: User['user_id']) =>
    IFetch<Array<Strike>>({ method: 'GET', url: `${USERS_ENDPOINT}/${userId || ME_ENDPOINT}/${STRIKES_ENDPOINT}/` }),
  getUsers: (filters?: any) => IFetch<PaginationResponse<User>>({ method: 'GET', url: `${USERS_ENDPOINT}/`, data: filters || {} }),
  updateUserData: (userName: User['user_id'], item: Partial<User>) => IFetch<User>({ method: 'PUT', url: `${USERS_ENDPOINT}/${userName}/`, data: item }),
  getUserNotificationSettings: () => IFetch<Array<UserNotificationSetting>>({ method: 'GET', url: `${NOTIFICATION_SETTINGS_ENDPOINT}/` }),
  updateUserNotificationSettings: (data: UserNotificationSetting) =>
    IFetch<Array<UserNotificationSetting>>({ method: 'POST', url: `${NOTIFICATION_SETTINGS_ENDPOINT}/`, data }),
  getUserNotificationSettingChoices: () => IFetch<Array<UserNotificationSettingChoice>>({ method: 'GET', url: `${NOTIFICATION_SETTINGS_ENDPOINT}/choices/` }),
  slackConnect: (slackCode: string) => IFetch<RequestResponse>({ method: 'POST', url: `${USERS_ENDPOINT}/${ME_ENDPOINT}/slack/`, data: { code: slackCode } }),
  activateUser: (userName: User['user_id']) => IFetch<RequestResponse>({ method: 'POST', url: `${USERS_ENDPOINT}/activate/`, data: { user_id: userName } }),
  declineUser: (userName: User['user_id'], reason: string) =>
    IFetch<RequestResponse>({ method: 'POST', url: `${USERS_ENDPOINT}/decline/`, data: { user_id: userName, reason } }),
  exportUserData: () => IFetch<RequestResponse>({ method: 'GET', url: `${USERS_ENDPOINT}/${ME_ENDPOINT}/data/` }),
  deleteUser: (userId?: User['user_id']) => IFetch<RequestResponse>({ method: 'DELETE', url: `${USERS_ENDPOINT}/${userId || ME_ENDPOINT}/` }),
};
