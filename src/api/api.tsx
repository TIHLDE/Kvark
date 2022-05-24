/* eslint-disable @typescript-eslint/no-explicit-any */
import { CompaniesEmail, FileUploadResponse, RequestResponse } from 'types';

import { IFetch } from 'api/fetch';

export const AUTH_ENDPOINT = 'auth';
export const BADGES_ENDPOINT = 'badges';
export const BADGES_LEADERBOARD_ENDPOINT = 'leaderboard';
export const BADGE_CATEGORIES_ENDPOINT = 'categories';
export const CATEGORIES_ENDPOINT = 'categories';
export const CHEATSHEETS_ENDPOINT = 'cheatsheets';
export const EVENTS_ENDPOINT = 'events';
export const EVENT_REGISTRATIONS_ENDPOINT = 'registrations';
export const FORMS_ENDPOINT = 'forms';
export const GALLERY_ENDPOINT = 'galleries';
export const PICTURE_ENDPOINT = 'pictures';
export const GROUPS_ENDPOINT = 'groups';
export const GROUP_LAWS_ENDPOINT = 'laws';
export const GROUP_FINES_ENDPOINT = 'fines';
export const JOBPOSTS_ENDPOINT = 'jobposts';
export const ME_ENDPOINT = 'me';
export const MEMBERSHIPS_ENDPOINT = 'memberships';
export const MEMBERSHIP_HISTORIES_ENDPOINT = 'membership-histories';
export const NEWS_ENDPOINT = 'news';
export const NOTIFICATIONS_ENDPOINT = 'notifications';
export const NOTIFICATION_SETTINGS_ENDPOINT = 'notification-settings';
export const WIKI_ENDPOINT = 'pages';
export const SHORT_LINKS_ENDPOINT = 'short-links';
export const STRIKES_ENDPOINT = 'strikes';
export const SUBMISSIONS_ENDPOINT = 'submissions';
export const USERS_ENDPOINT = 'users';
export const WARNINGS_ENDPOINT = 'warnings';
export const TODDEL_ENDPOINT = 'toddel';

export default {
  // Company form
  emailForm: (data: CompaniesEmail) => IFetch<RequestResponse>({ method: 'POST', url: `accept-form/`, data, withAuth: false }),

  // File-upload
  uploadFile: (file: File | Blob) => IFetch<FileUploadResponse>({ method: 'POST', url: 'upload/', file }),
};
