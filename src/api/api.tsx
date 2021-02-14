/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFetch } from 'api/fetch';
import { Study } from 'types/Enums';
import {
  User,
  UserCreate,
  Event,
  EventCompact,
  EventRequired,
  Registration,
  JobPost,
  JobPostRequired,
  News,
  NewsRequired,
  Category,
  Warning,
  RequestResponse,
  CompaniesEmail,
  PaginationResponse,
  LoginRequestResponse,
  Cheatsheet,
  Page,
  PageTree,
  PageRequired,
} from 'types/Types';

export default {
  // Auth
  createUser: (item: UserCreate) => IFetch<RequestResponse>({ method: 'POST', url: 'user/', data: item, withAuth: false }),
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
  getEvent: (eventId: number) => IFetch<Event>({ method: 'GET', url: `events/${String(eventId)}/` }),
  getEvents: (filters?: any) => IFetch<PaginationResponse<EventCompact>>({ method: 'GET', url: `events/`, data: filters || {} }),
  createEvent: (item: EventRequired) => IFetch<Event>({ method: 'POST', url: `events/`, data: item }),
  updateEvent: (eventId: number, item: Partial<Event>) => IFetch<Event>({ method: 'PUT', url: `events/${String(eventId)}/`, data: item }),
  deleteEvent: (eventId: number) => IFetch<RequestResponse>({ method: 'DELETE', url: `events/${String(eventId)}/` }),
  putAttended: (eventId: number, item: { has_attended: boolean }, userId: string) =>
    IFetch<RequestResponse>({ method: 'PUT', url: `events/${String(eventId)}/users/${userId}/`, data: item }),
  getRegistration: (eventId: number, userId: string) => IFetch<Registration>({ method: 'GET', url: `events/${String(eventId)}/users/${userId}/` }),
  getEventRegistrations: (eventId: number) => IFetch<Array<Registration>>({ method: 'GET', url: `events/${String(eventId)}/users/` }),
  createRegistration: (eventId: number, item: Partial<Registration>) =>
    IFetch<Registration>({ method: 'POST', url: `events/${String(eventId)}/users/`, data: item }),
  updateRegistration: (eventId: number, item: Partial<Registration>, userId: string) =>
    IFetch<Registration>({ method: 'PUT', url: `events/${String(eventId)}/users/${userId}/`, data: item }),
  deleteRegistration: (eventId: number, userId: string) => IFetch<RequestResponse>({ method: 'DELETE', url: `events/${String(eventId)}/users/${userId}/` }),

  // Job posts
  getJobPosts: (filters: any = {}) => IFetch<PaginationResponse<JobPost>>({ method: 'GET', url: `jobpost/`, data: filters }),
  getJobPost: (id: number) => IFetch<JobPost>({ method: 'GET', url: `jobpost/${String(id)}/` }),
  createJobPost: (item: JobPostRequired) => IFetch<JobPost>({ method: 'POST', url: `jobpost/`, data: item }),
  putJobPost: (id: number, item: JobPostRequired) => IFetch<JobPost>({ method: 'PUT', url: `jobpost/${String(id)}/`, data: item }),
  deleteJobPost: (id: number) => IFetch<RequestResponse>({ method: 'DELETE', url: `jobpost/${String(id)}/` }),

  // News
  getNewsItem: (id: number) => IFetch<News>({ method: 'GET', url: `news/${String(id)}/` }),
  getNewsItems: (filters?: any) => IFetch<PaginationResponse<News>>({ method: 'GET', url: `news/`, data: filters || {} }),
  createNewsItem: (item: NewsRequired) => IFetch<News>({ method: 'POST', url: `news/`, data: item }),
  putNewsItem: (id: number, item: NewsRequired) => IFetch<News>({ method: 'PUT', url: `news/${String(id)}/`, data: item }),
  deleteNewsItem: (id: number) => IFetch<RequestResponse>({ method: 'DELETE', url: `news/${String(id)}/` }),

  // User
  getUserData: () => IFetch<User>({ method: 'GET', url: `user/userdata/` }),
  getUsers: (filters?: any) => IFetch<PaginationResponse<User>>({ method: 'GET', url: `user/`, data: filters || {} }),
  updateUserData: (userName: string, item: Partial<User>) => IFetch<User>({ method: 'PUT', url: `user/${userName}/`, data: item }),

  // Notifications
  updateNotification: (id: number, item: { read: boolean }) => IFetch<RequestResponse>({ method: 'PUT', url: `notification/${String(id)}/`, data: item }),

  // Cheatsheet
  getCheatsheets: (study: Study, grade: number, filters?: any) => {
    const tempStudy = study === Study.DIGSEC ? 'DIGINC' : study;
    return IFetch<PaginationResponse<Cheatsheet>>({
      method: 'GET',
      url: `cheatsheet/${tempStudy.toUpperCase()}/${String(grade)}/files/`,
      data: filters || {},
      withAuth: true,
    });
  },

  // Warning
  getWarning: () => IFetch<Array<Warning>>({ method: 'GET', url: `warning/` }),

  // Categories
  getCategories: () => IFetch<Array<Category>>({ method: 'GET', url: `category/` }),

  // Company form
  emailForm: (data: CompaniesEmail) => IFetch<RequestResponse>({ method: 'POST', url: `accept-form/`, data, withAuth: false }),

  // Badges
  createUserBadge: (data: { badge_id: string }) => IFetch<RequestResponse>({ method: 'POST', url: `badge/`, data }),

  // Pages
  getPageTree: () => IFetch<PageTree>({ method: 'GET', url: `page/tree/` }),
  getPage: (path: string) => IFetch<Page>({ method: 'GET', url: `page/${path}` }),
  createPage: (data: PageRequired) => IFetch<Page>({ method: 'POST', url: `page/`, data }),
  updatePage: (path: string, data: Partial<Page>) => IFetch<Page>({ method: 'PUT', url: `page/${path}`, data }),
  deletePage: (path: string) => IFetch<RequestResponse>({ method: 'DELETE', url: `page/${path}` }),
};
