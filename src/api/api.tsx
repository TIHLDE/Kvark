/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFetch } from 'api/fetch';
import { Study } from 'types/Enums';
import {
  User,
  UserCreate,
  Event,
  EventCompact,
  EventRequired,
  FileUploadResponse,
  Registration,
  JobPost,
  JobPostRequired,
  News,
  NewsRequired,
  Notification,
  Category,
  Warning,
  RequestResponse,
  CompaniesEmail,
  PaginationResponse,
  LoginRequestResponse,
  Cheatsheet,
  ShortLink,
  Page,
  PageTree,
  PageRequired,
  Membership,
} from 'types/Types';

export const BADGES_ENDPOINT = 'badges';
export const CATEGORIES_ENDPOINT = 'categories';
export const CHEATSHEETS_ENDPOINT = 'cheatsheets';
export const EVENTS_ENDPOINT = 'events';
export const GROUPS_ENDPOINT = 'groups';
export const JOBPOSTS_ENDPOINT = 'jobposts';
export const NEWS_ENDPOINT = 'news';
export const NOTIFICATIONS_ENDPOINT = 'notifications';
export const PAGES_ENDPOINT = 'pages';
export const SHORT_LINKS_ENDPOINT = 'short-links';
export const USERS_ENDPOINT = 'users';
export const WARNINGS_ENDPOINT = 'warnings';

export default {
  // Auth
  createUser: (item: UserCreate) => IFetch<RequestResponse>({ method: 'POST', url: `${USERS_ENDPOINT}/`, data: item, withAuth: false }),
  authenticate: (username: string, password: string) =>
    IFetch<LoginRequestResponse>({
      method: 'POST',
      url: 'auth/login/',
      data: { user_id: username, password: password },
      withAuth: false,
    }),
  forgotPassword: (email: string) =>
    IFetch<RequestResponse>({ method: 'POST', url: 'auth/rest-auth/password/reset/', data: { email: email }, withAuth: false }),

  // Events
  getEvent: (eventId: number) => IFetch<Event>({ method: 'GET', url: `${EVENTS_ENDPOINT}/${String(eventId)}/` }),
  getEvents: (filters?: any) => IFetch<PaginationResponse<EventCompact>>({ method: 'GET', url: `${EVENTS_ENDPOINT}/`, data: filters || {} }),
  createEvent: (item: EventRequired) => IFetch<Event>({ method: 'POST', url: `${EVENTS_ENDPOINT}/`, data: item }),
  updateEvent: (eventId: number, item: Partial<Event>) => IFetch<Event>({ method: 'PUT', url: `${EVENTS_ENDPOINT}/${String(eventId)}/`, data: item }),
  deleteEvent: (eventId: number) => IFetch<RequestResponse>({ method: 'DELETE', url: `${EVENTS_ENDPOINT}/${String(eventId)}/` }),
  putAttended: (eventId: number, item: { has_attended: boolean }, userId: string) =>
    IFetch<RequestResponse>({ method: 'PUT', url: `${EVENTS_ENDPOINT}/${String(eventId)}/users/${userId}/`, data: item }),
  getRegistration: (eventId: number, userId: string) => IFetch<Registration>({ method: 'GET', url: `${EVENTS_ENDPOINT}/${String(eventId)}/users/${userId}/` }),
  getEventRegistrations: (eventId: number) => IFetch<Array<Registration>>({ method: 'GET', url: `${EVENTS_ENDPOINT}/${String(eventId)}/users/` }),
  createRegistration: (eventId: number, item: Partial<Registration>) =>
    IFetch<Registration>({ method: 'POST', url: `${EVENTS_ENDPOINT}/${String(eventId)}/users/`, data: item }),
  updateRegistration: (eventId: number, item: Partial<Registration>, userId: string) =>
    IFetch<Registration>({ method: 'PUT', url: `${EVENTS_ENDPOINT}/${String(eventId)}/users/${userId}/`, data: item }),
  deleteRegistration: (eventId: number, userId: string) =>
    IFetch<RequestResponse>({ method: 'DELETE', url: `${EVENTS_ENDPOINT}/${String(eventId)}/users/${userId}/` }),

  // Job posts
  getJobPosts: (filters: any = {}) => IFetch<PaginationResponse<JobPost>>({ method: 'GET', url: `${JOBPOSTS_ENDPOINT}/`, data: filters }),
  getJobPost: (id: number) => IFetch<JobPost>({ method: 'GET', url: `${JOBPOSTS_ENDPOINT}/${String(id)}/` }),
  createJobPost: (item: JobPostRequired) => IFetch<JobPost>({ method: 'POST', url: `${JOBPOSTS_ENDPOINT}/`, data: item }),
  putJobPost: (id: number, item: JobPostRequired) => IFetch<JobPost>({ method: 'PUT', url: `${JOBPOSTS_ENDPOINT}/${String(id)}/`, data: item }),
  deleteJobPost: (id: number) => IFetch<RequestResponse>({ method: 'DELETE', url: `${JOBPOSTS_ENDPOINT}/${String(id)}/` }),

  // News
  getNewsItem: (id: number) => IFetch<News>({ method: 'GET', url: `${NEWS_ENDPOINT}/${String(id)}/` }),
  getNewsItems: (filters?: any) => IFetch<PaginationResponse<News>>({ method: 'GET', url: `${NEWS_ENDPOINT}/`, data: filters || {} }),
  createNewsItem: (item: NewsRequired) => IFetch<News>({ method: 'POST', url: `${NEWS_ENDPOINT}/`, data: item }),
  putNewsItem: (id: number, item: NewsRequired) => IFetch<News>({ method: 'PUT', url: `${NEWS_ENDPOINT}/${String(id)}/`, data: item }),
  deleteNewsItem: (id: number) => IFetch<RequestResponse>({ method: 'DELETE', url: `${NEWS_ENDPOINT}/${String(id)}/` }),

  // User
  getUserData: () => IFetch<User>({ method: 'GET', url: `${USERS_ENDPOINT}/userdata/` }),
  getUsers: (filters?: any) => IFetch<PaginationResponse<User>>({ method: 'GET', url: `${USERS_ENDPOINT}/`, data: filters || {} }),
  updateUserData: (userName: string, item: Partial<User>) => IFetch<User>({ method: 'PUT', url: `${USERS_ENDPOINT}/${userName}/`, data: item }),

  // Notifications
  getNotifications: (filters?: any) => IFetch<PaginationResponse<Notification>>({ method: 'GET', url: `${NOTIFICATIONS_ENDPOINT}/`, data: filters || {} }),
  updateNotification: (id: number, item: { read: boolean }) =>
    IFetch<Notification>({ method: 'PUT', url: `${NOTIFICATIONS_ENDPOINT}/${String(id)}/`, data: item }),

  // Short links
  getShortLinks: (filters?: any) => IFetch<Array<ShortLink>>({ method: 'GET', url: `${SHORT_LINKS_ENDPOINT}/`, data: filters || {} }),
  createShortLink: (item: ShortLink) => IFetch<ShortLink>({ method: 'POST', url: `${SHORT_LINKS_ENDPOINT}/`, data: item }),
  deleteShortLink: (slug: string) => IFetch<RequestResponse>({ method: 'DELETE', url: `${SHORT_LINKS_ENDPOINT}/${slug}/` }),

  // Cheatsheet
  getCheatsheets: (study: Study, grade: number, filters?: any) => {
    const tempStudy = study === Study.DIGSEC ? 'DIGINC' : study;
    return IFetch<PaginationResponse<Cheatsheet>>({
      method: 'GET',
      url: `${CHEATSHEETS_ENDPOINT}/${tempStudy.toUpperCase()}/${String(grade)}/files/`,
      data: filters || {},
      withAuth: true,
    });
  },

  // Warning
  getWarning: () => IFetch<Array<Warning>>({ method: 'GET', url: `${WARNINGS_ENDPOINT}/` }),

  // Categories
  getCategories: () => IFetch<Array<Category>>({ method: 'GET', url: `${CATEGORIES_ENDPOINT}/` }),

  // Badges
  createUserBadge: (data: { badge_id: string }) => IFetch<RequestResponse>({ method: 'POST', url: `${BADGES_ENDPOINT}/`, data }),

  //Membership
  getMemberships: (slug: string) => IFetch<Membership[]>({ method: 'GET', url: `${GROUPS_ENDPOINT}/${slug}/membership/` }),

  // Pages
  getPageTree: () => IFetch<PageTree>({ method: 'GET', url: `${PAGES_ENDPOINT}/tree/` }),
  getPage: (path: string) => IFetch<Page>({ method: 'GET', url: `${PAGES_ENDPOINT}/${path}` }),
  createPage: (data: PageRequired) => IFetch<Page>({ method: 'POST', url: `${PAGES_ENDPOINT}/`, data }),
  updatePage: (path: string, data: Partial<Page>) => IFetch<Page>({ method: 'PUT', url: `${PAGES_ENDPOINT}/${path}`, data }),
  deletePage: (path: string) => IFetch<RequestResponse>({ method: 'DELETE', url: `${PAGES_ENDPOINT}/${path}` }),

  // Company form
  emailForm: (data: CompaniesEmail) => IFetch<RequestResponse>({ method: 'POST', url: `accept-form/`, data, withAuth: false }),

  // File-upload
  uploadFile: (file: File | Blob) => IFetch<FileUploadResponse>({ method: 'POST', url: 'upload/', file }),
};
