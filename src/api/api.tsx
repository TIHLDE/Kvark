/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFetch } from 'api/fetch';
import { RequestMethodType, CheatsheetGrade, CheatsheetStudy } from 'types/Enums';
import {
  User,
  Event,
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
  Cheatsheet,
} from 'types/Types';

export default {
  // Events
  getEvent: (eventId: number) => {
    return IFetch<Event>(RequestMethodType.GET, `events/${String(eventId)}/`, undefined);
  },
  getEvents: (filters?: any) => {
    return IFetch<PaginationResponse<Event>>(RequestMethodType.GET, `events/`, filters || {});
  },
  getExpiredEvents: () => {
    return IFetch<PaginationResponse<Event>>(RequestMethodType.GET, `events/`, { expired: true });
  },
  createEvent: (item: EventRequired) => {
    return IFetch<Event>(RequestMethodType.POST, `events/`, item, true);
  },
  updateEvent: (eventId: number, item: Partial<Event>) => {
    return IFetch<Event>(RequestMethodType.PUT, `events/${String(eventId)}/`, item, true);
  },
  deleteEvent: (eventId: number) => {
    return IFetch<RequestResponse>(RequestMethodType.DELETE, `events/${String(eventId)}/`, undefined, true);
  },
  putAttended: (eventId: number, item: { has_attended: boolean }, userId: string) => {
    return IFetch<RequestResponse>(RequestMethodType.PUT, `events/${String(eventId)}/users/${userId}/`, item, true);
  },
  getRegistration: (eventId: number, userId: string) => {
    return IFetch<Registration>(RequestMethodType.GET, `events/${String(eventId)}/users/${userId}/`, undefined, true);
  },
  getEventRegistrations: (eventId: number) => {
    return IFetch<Array<Registration>>(RequestMethodType.GET, `events/${String(eventId)}/users/`, undefined, true);
  },
  createRegistration: (eventId: number, item: Partial<Registration>) => {
    return IFetch<Registration>(RequestMethodType.POST, `events/${String(eventId)}/users/`, item, true);
  },
  updateRegistration: (eventId: number, item: Partial<Registration>, userId: string) => {
    return IFetch<Registration>(RequestMethodType.PUT, `events/${String(eventId)}/users/${userId}/`, item, true);
  },
  deleteRegistration: (eventId: number, userId: string) => {
    return IFetch<RequestResponse>(RequestMethodType.DELETE, `events/${String(eventId)}/users/${userId}/`, undefined, true);
  },

  // Job posts
  getJobPosts: (filters?: any) => {
    return IFetch<PaginationResponse<JobPost>>(RequestMethodType.GET, `jobpost/`, filters || { newest: true });
  },
  getJobPost: (id: number) => {
    return IFetch<JobPost>(RequestMethodType.GET, `jobpost/${String(id)}/`, undefined);
  },
  getExpiredJobPosts: () => {
    return IFetch<PaginationResponse<JobPost>>(RequestMethodType.GET, `jobpost/`, { expired: true });
  },
  createJobPost: (item: JobPostRequired) => {
    return IFetch<JobPost>(RequestMethodType.POST, `jobpost/`, item, true);
  },
  putJobPost: (id: number, item: JobPostRequired) => {
    return IFetch<JobPost>(RequestMethodType.PUT, `jobpost/${String(id)}/`, item, true);
  },
  deleteJobPost: (id: number) => {
    return IFetch<RequestResponse>(RequestMethodType.DELETE, `jobpost/${String(id)}/`, undefined, true);
  },

  // News
  getNewsItem: (id: number) => {
    return IFetch<News>(RequestMethodType.GET, `news/${String(id)}/`, undefined);
  },
  getNewsItems: (filters?: any) => {
    return IFetch<Array<News>>(RequestMethodType.GET, `news/`, filters || {});
  },
  createNewsItem: (item: NewsRequired) => {
    return IFetch<News>(RequestMethodType.POST, `news/`, item, true);
  },
  putNewsItem: (id: number, item: NewsRequired) => {
    return IFetch<News>(RequestMethodType.PUT, `news/${String(id)}/`, item, true);
  },
  deleteNewsItem: (id: number) => {
    return IFetch<RequestResponse>(RequestMethodType.DELETE, `news/${String(id)}/`, undefined, true);
  },

  // User
  getUserData: () => {
    return IFetch<User>(RequestMethodType.GET, `user/userdata/`, undefined, true);
  },
  getUsers: (filters?: any) => {
    return IFetch<Array<User>>(RequestMethodType.GET, `user/`, filters || {}, true);
  },
  updateUserData: (userName: string, item: Partial<User>) => {
    return IFetch<RequestResponse>(RequestMethodType.PUT, `user/${userName}/`, item, true);
  },

  // Notifications
  updateNotification: (id: number, item: { read: boolean }) => {
    return IFetch<RequestResponse>(RequestMethodType.PUT, `notification/${String(id)}/`, item, true);
  },

  // Cheatsheet
  getCheatsheets: (study: CheatsheetStudy, grade: CheatsheetGrade, filters?: any) => {
    return IFetch<PaginationResponse<Cheatsheet>>(RequestMethodType.GET, `cheatsheet/study/${study}/grade/${grade}/file/`, filters || {}, true);
  },

  // Warning
  getWarning: () => {
    return IFetch<Array<Warning>>(RequestMethodType.GET, `warning/`);
  },

  // Categories
  getCategories: () => {
    return IFetch<Array<Category>>(RequestMethodType.GET, `category/`);
  },

  // Company form
  emailForm: (data: CompaniesEmail) => {
    return IFetch<RequestResponse>(RequestMethodType.POST, `accept-form/`, data, false);
  },

  // Badges
  createUserBadge: (data: { badge_id: string }) => {
    return IFetch<RequestResponse>(RequestMethodType.POST, `badge/`, data, true);
  },
};
