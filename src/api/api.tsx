/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRequest } from 'api/httphandler';
import { IFetch } from 'api/fetch';
import { RequestMethodType } from 'types/Enums';
import { User, Warning, RequestResponse, CompaniesEmail } from 'types/Types';

export default {
  // Events
  getEventItem: (id: string) => {
    return new IRequest(RequestMethodType.GET, 'events/'.concat(String(id), '/'), undefined);
  },
  getEventItems: (filters: any) => {
    return new IRequest(RequestMethodType.GET, 'events/', filters || {});
  },
  getExpiredEvents: () => {
    return new IRequest(RequestMethodType.GET, 'events/', { expired: true });
  },
  getEventLists: () => {
    return new IRequest(RequestMethodType.GET, 'eventlist/', undefined);
  },
  createEventItem: (item: any) => {
    return new IRequest(RequestMethodType.POST, 'events/', item, true);
  },
  putEventItem: (id: string, item: any) => {
    return new IRequest(RequestMethodType.PUT, 'events/'.concat(id, '/'), item, true);
  },
  deleteEventItem: (id: string) => {
    return new IRequest(RequestMethodType.DELETE, 'events/'.concat(id, '/'), undefined, true);
  },
  putAttended: (id: string, item: any, username: string) => {
    return new IRequest(RequestMethodType.PUT, 'events/'.concat(id, '/users/'.concat(username, '/')), item, true);
  },
  getEventParticipants: (id: string) => {
    return new IRequest(RequestMethodType.GET, 'events/'.concat(id, '/users/'), undefined, true);
  },
  putUserOnEventList: (id: string, item: any) => {
    return new IRequest(RequestMethodType.POST, 'events/'.concat(id, '/users/'), item, true);
  },
  deleteUserFromEventList: (id: string, item: any) => {
    return new IRequest(RequestMethodType.DELETE, 'events/'.concat(id, '/users/', item.user_id, '/'), undefined, true);
  },
  updateUserEvent: (id: string, item: any) => {
    return new IRequest(RequestMethodType.PUT, 'events/'.concat(id, '/users/', item.user_id, '/'), item, true);
  },
  getUserEventObject: (id: string, item: any) => {
    return new IRequest(RequestMethodType.GET, 'events/'.concat(id, '/users/', item.user_id, '/'), undefined, true);
  },

  // Job posts
  getJobPosts: (filters: any) => {
    return new IRequest(RequestMethodType.GET, 'jobpost/', filters || { newest: true });
  },
  getJobPost: (id: string) => {
    return new IRequest(RequestMethodType.GET, 'jobpost/'.concat(id, '/'), undefined);
  },
  getExpiredJobPosts: () => {
    return new IRequest(RequestMethodType.GET, 'jobpost/', { expired: true });
  },
  createJobPost: (item: any) => {
    return new IRequest(RequestMethodType.POST, 'jobpost/', item, true);
  },
  putJobPost: (id: string, item: any) => {
    return new IRequest(RequestMethodType.PUT, 'jobpost/'.concat(id, '/'), item, true);
  },
  deleteJobPost: (id: string) => {
    return new IRequest(RequestMethodType.DELETE, 'jobpost/'.concat(id, '/'), undefined, true);
  },

  // News
  getNewsItem: (id: string) => {
    return new IRequest(RequestMethodType.GET, 'news/'.concat(id, '/'), undefined);
  },
  getNewsItems: (filters: any) => {
    return new IRequest(RequestMethodType.GET, 'news/', filters || {});
  },
  createNewsItem: (item: any) => {
    return new IRequest(RequestMethodType.POST, 'news/', item, true);
  },
  putNewsItem: (id: string, item: any) => {
    return new IRequest(RequestMethodType.PUT, 'news/'.concat(id, '/'), item, true);
  },
  deleteNewsItem: (id: string) => {
    return new IRequest(RequestMethodType.DELETE, 'news/'.concat(id, '/'), undefined, true);
  },

  // User
  getUserData: () => {
    return IFetch<User>(RequestMethodType.GET, 'user/userdata/', undefined, true);
  },
  getUsers: (filters: any) => {
    return IFetch<Array<User>>(RequestMethodType.GET, 'user/', filters || {}, true);
  },
  updateUserData: (userName: string, item: Partial<User>) => {
    return IFetch<RequestResponse>(RequestMethodType.PUT, 'user/'.concat(userName, '/'), item, true);
  },

  // Notifications
  updateNotification: (id: string, item: any) => {
    return new IRequest(RequestMethodType.PUT, 'notification/'.concat(id, '/'), item, true);
  },

  // Cheatsheet
  getCheatsheets: (filters: any, study: any, grade: any) => {
    return new IRequest(RequestMethodType.GET, 'cheatsheet/'.concat('study/', study, '/grade/', grade, '/file/'), filters || {}, true);
  },

  // Warning
  getWarning: () => {
    return IFetch<Array<Warning>>(RequestMethodType.GET, 'warning/');
  },
  getCategories: () => {
    return new IRequest(RequestMethodType.GET, 'category/');
  },

  // Company form
  emailForm: (data: CompaniesEmail) => {
    return IFetch<RequestResponse>(RequestMethodType.POST, 'accept-form/', data, false);
  },

  // Badges
  createUserBadge: (data: any) => {
    return new IRequest(RequestMethodType.POST, 'badge/', data, true);
  },
};
