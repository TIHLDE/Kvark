/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFetch } from 'api/fetch';
import { MembershipType, Study } from 'types/Enums';
import {
  Badge,
  Category,
  Cheatsheet,
  CompaniesEmail,
  Event,
  EventCompact,
  EventFormCreate,
  EventRequired,
  FileUploadResponse,
  Form,
  FormCreate,
  FormStatistics,
  FormUpdate,
  Group,
  GroupFine,
  GroupFineCreate,
  GroupFineBatchMutate,
  GroupFineMutate,
  GroupLaw,
  GroupLawMutate,
  GroupMutate,
  GroupUserFine,
  JobPost,
  JobPostRequired,
  LoginRequestResponse,
  Membership,
  MembershipHistory,
  News,
  NewsRequired,
  Notification,
  Page,
  PageChildren,
  PageTree,
  PageRequired,
  PaginationResponse,
  Registration,
  RequestResponse,
  ShortLink,
  Strike,
  StrikeCreate,
  StrikeList,
  Submission,
  User,
  UserCreate,
  UserSubmission,
  Warning,
<<<<<<< HEAD
  StrikeList,
  Gallery,
  GalleryRequired,
  Picture,
  PictureRequired,
=======
>>>>>>> d9222db95c2b201b0edaa019bc320d1a0aeefb33
} from 'types';

export const AUTH_ENDPOINT = 'auth';
export const BADGES_ENDPOINT = 'badges';
export const CATEGORIES_ENDPOINT = 'categories';
export const CHEATSHEETS_ENDPOINT = 'cheatsheets';
export const EVENTS_ENDPOINT = 'events';
export const EVENT_REGISTRATIONS_ENDPOINT = 'users';
export const FORMS_ENDPOINT = 'forms';
<<<<<<< HEAD
export const GALLERY_ENDPOINT = 'gallery';
export const GROUPS_ENDPOINT = 'group';
export const JOBPOSTS_ENDPOINT = 'jobpost';
=======
export const GROUPS_ENDPOINT = 'groups';
export const GROUP_LAWS_ENDPOINT = 'laws';
export const GROUP_FINES_ENDPOINT = 'fines';
export const JOBPOSTS_ENDPOINT = 'jobposts';
>>>>>>> d9222db95c2b201b0edaa019bc320d1a0aeefb33
export const ME_ENDPOINT = 'me';
export const MEMBERSHIPS_ENDPOINT = 'memberships';
export const MEMBERSHIP_HISTORIES_ENDPOINT = 'membership-histories';
export const NEWS_ENDPOINT = 'news';
<<<<<<< HEAD
export const NOTIFICATIONS_ENDPOINT = 'notification';
export const PAGES_ENDPOINT = 'page';
export const PICTURE_ENDPOINT = 'pictures';
export const SHORT_LINKS_ENDPOINT = 'short-link';
=======
export const NOTIFICATIONS_ENDPOINT = 'notifications';
export const PAGES_ENDPOINT = 'pages';
export const SHORT_LINKS_ENDPOINT = 'short-links';
>>>>>>> d9222db95c2b201b0edaa019bc320d1a0aeefb33
export const STRIKES_ENDPOINT = 'strikes';
export const SUBMISSIONS_ENDPOINT = 'submissions';
export const USERS_ENDPOINT = 'users';
export const WARNINGS_ENDPOINT = 'warnings';

export default {
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

  // Events
  getEvent: (eventId: number) => IFetch<Event>({ method: 'GET', url: `${EVENTS_ENDPOINT}/${String(eventId)}/` }),
  getEvents: (filters?: any) => IFetch<PaginationResponse<EventCompact>>({ method: 'GET', url: `${EVENTS_ENDPOINT}/`, data: filters || {} }),
  getEventsWhereIsAdmin: (filters?: any) => IFetch<PaginationResponse<EventCompact>>({ method: 'GET', url: `${EVENTS_ENDPOINT}/admin/`, data: filters || {} }),
  createEvent: (item: EventRequired) => IFetch<Event>({ method: 'POST', url: `${EVENTS_ENDPOINT}/`, data: item }),
  updateEvent: (eventId: number, item: Partial<Event>) => IFetch<Event>({ method: 'PUT', url: `${EVENTS_ENDPOINT}/${String(eventId)}/`, data: item }),
  deleteEvent: (eventId: number) => IFetch<RequestResponse>({ method: 'DELETE', url: `${EVENTS_ENDPOINT}/${String(eventId)}/` }),
  notifyEventRegistrations: (eventId: number, title: string, message: string) =>
    IFetch<RequestResponse>({ method: 'POST', url: `${EVENTS_ENDPOINT}/${String(eventId)}/notify/`, data: { title, message } }),

  // Event registrations
  getRegistration: (eventId: number, userId: string) =>
    IFetch<Registration>({ method: 'GET', url: `${EVENTS_ENDPOINT}/${String(eventId)}/${EVENT_REGISTRATIONS_ENDPOINT}/${userId}/` }),
  getEventRegistrations: (eventId: number) =>
    IFetch<Array<Registration>>({ method: 'GET', url: `${EVENTS_ENDPOINT}/${String(eventId)}/${EVENT_REGISTRATIONS_ENDPOINT}/` }),
  createRegistration: (eventId: number, item: Partial<Registration>) =>
    IFetch<Registration>({ method: 'POST', url: `${EVENTS_ENDPOINT}/${String(eventId)}/${EVENT_REGISTRATIONS_ENDPOINT}/`, data: item }),
  updateRegistration: (eventId: number, item: Partial<Registration>, userId: string) =>
    IFetch<Registration>({ method: 'PUT', url: `${EVENTS_ENDPOINT}/${String(eventId)}/${EVENT_REGISTRATIONS_ENDPOINT}/${userId}/`, data: item }),
  deleteRegistration: (eventId: number, userId: string) =>
    IFetch<RequestResponse>({ method: 'DELETE', url: `${EVENTS_ENDPOINT}/${String(eventId)}/${EVENT_REGISTRATIONS_ENDPOINT}/${userId}/` }),

  // Forms
  getForm: (formId: string) => IFetch<Form>({ method: 'GET', url: `${FORMS_ENDPOINT}/${formId}/` }),
  getFormStatistics: (formId: string) => IFetch<FormStatistics>({ method: 'GET', url: `${FORMS_ENDPOINT}/${formId}/statistics/` }),
  createForm: (item: FormCreate | EventFormCreate) => IFetch<Form>({ method: 'POST', url: `${FORMS_ENDPOINT}/`, data: item }),
  updateForm: (formId: string, item: FormUpdate) => IFetch<Form>({ method: 'PUT', url: `${FORMS_ENDPOINT}/${formId}/`, data: item }),
  deleteForm: (formId: string) => IFetch<RequestResponse>({ method: 'DELETE', url: `${FORMS_ENDPOINT}/${formId}/` }),

  // Submissions
  getSubmissions: (formId: string, filters?: any) =>
    IFetch<PaginationResponse<UserSubmission>>({ method: 'GET', url: `${FORMS_ENDPOINT}/${formId}/${SUBMISSIONS_ENDPOINT}/`, data: filters || {} }),
  createSubmission: (formId: string, submission: Submission) =>
    IFetch<Submission>({ method: 'POST', url: `${FORMS_ENDPOINT}/${formId}/${SUBMISSIONS_ENDPOINT}/`, data: submission }),

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
  getUserData: () => IFetch<User>({ method: 'GET', url: `${USERS_ENDPOINT}/${ME_ENDPOINT}/` }),
  getUserBadges: (filters?: any) =>
    IFetch<PaginationResponse<Badge>>({ method: 'GET', url: `${USERS_ENDPOINT}/${ME_ENDPOINT}/${BADGES_ENDPOINT}/`, data: filters || {} }),
  getUserEvents: (filters?: any) =>
    IFetch<PaginationResponse<EventCompact>>({ method: 'GET', url: `${USERS_ENDPOINT}/${ME_ENDPOINT}/${EVENTS_ENDPOINT}/`, data: filters || {} }),
  getUserForms: (filters?: any) =>
    IFetch<PaginationResponse<Form>>({ method: 'GET', url: `${USERS_ENDPOINT}/${ME_ENDPOINT}/${FORMS_ENDPOINT}/`, data: filters || {} }),
  getUserGroups: () => IFetch<Array<Group>>({ method: 'GET', url: `${USERS_ENDPOINT}/${ME_ENDPOINT}/${GROUPS_ENDPOINT}/` }),
  getUsers: (filters?: any) => IFetch<PaginationResponse<User>>({ method: 'GET', url: `${USERS_ENDPOINT}/`, data: filters || {} }),
  updateUserData: (userName: string, item: Partial<User>) => IFetch<User>({ method: 'PUT', url: `${USERS_ENDPOINT}/${userName}/`, data: item }),
  activateUser: (userName: string) => IFetch<RequestResponse>({ method: 'POST', url: `${USERS_ENDPOINT}/activate/`, data: { user_id: userName } }),
  declineUser: (userName: string, reason: string) =>
    IFetch<RequestResponse>({ method: 'POST', url: `${USERS_ENDPOINT}/decline/`, data: { user_id: userName, reason } }),
  getUserStrikes: (userId?: string) => IFetch<Array<Strike>>({ method: 'GET', url: `${USERS_ENDPOINT}/${userId || ME_ENDPOINT}/${STRIKES_ENDPOINT}/` }),

  // Notifications
  getNotifications: (filters?: any) => IFetch<PaginationResponse<Notification>>({ method: 'GET', url: `${NOTIFICATIONS_ENDPOINT}/`, data: filters || {} }),
  updateNotification: (id: number, item: { read: boolean }) =>
    IFetch<Notification>({ method: 'PUT', url: `${NOTIFICATIONS_ENDPOINT}/${String(id)}/`, data: item }),

  // Short links
  getShortLinks: (filters?: any) => IFetch<Array<ShortLink>>({ method: 'GET', url: `${SHORT_LINKS_ENDPOINT}/`, data: filters || {} }),
  createShortLink: (item: ShortLink) => IFetch<ShortLink>({ method: 'POST', url: `${SHORT_LINKS_ENDPOINT}/`, data: item }),
  deleteShortLink: (slug: string) => IFetch<RequestResponse>({ method: 'DELETE', url: `${SHORT_LINKS_ENDPOINT}/${slug}/` }),

  // Album
  getAlbum: (slug: string) => IFetch<Gallery>({ method: 'GET', url: `${GALLERY_ENDPOINT}/${slug}/` }),
  getAlbums: (filters?: any) => IFetch<PaginationResponse<Gallery>>({ method: 'GET', url: `${GALLERY_ENDPOINT}/`, data: filters || {} }),
  createAlbum: (item: GalleryRequired) => IFetch<Gallery>({ method: 'POST', url: `${GALLERY_ENDPOINT}/`, data: item }),
  updateAlbum: (slug: string, item: Partial<Gallery>) => IFetch<Gallery>({ method: 'PUT', url: `${GALLERY_ENDPOINT}/${slug}/`, data: item }),
  deleteAlbum: (slug: string) => IFetch<RequestResponse>({ method: 'DELETE', url: `${GALLERY_ENDPOINT}/${slug}/` }),

  // Picture
  getAlbumPictures: (albumSlug: string, filters?: any) =>
    IFetch<PaginationResponse<Picture>>({ method: 'GET', url: `${GALLERY_ENDPOINT}/${albumSlug}/${PICTURE_ENDPOINT}/`, data: filters || {} }),
  createPicture: (item: PictureRequired) => IFetch<Picture>({ method: 'POST', url: `${PICTURE_ENDPOINT}/`, data: item }),
  updatePicture: (id: string, item: Partial<Picture>) => IFetch<Picture>({ method: 'PUT', url: `${PICTURE_ENDPOINT}/${id}/`, data: item }),
  deletePicture: (id: string) => IFetch<RequestResponse>({ method: 'DELETE', url: `${PICTURE_ENDPOINT}/${id}` }),

  // Strikes
  createStrike: (item: StrikeCreate) => IFetch<Strike>({ method: 'POST', url: `${STRIKES_ENDPOINT}/`, data: item }),
  deleteStrike: (id: string) => IFetch<RequestResponse>({ method: 'DELETE', url: `${STRIKES_ENDPOINT}/${id}/` }),
  getStrikes: (filters?: any) => IFetch<PaginationResponse<StrikeList>>({ method: 'GET', url: `${STRIKES_ENDPOINT}/`, data: filters || {} }),
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
  getWarnings: () => IFetch<Array<Warning>>({ method: 'GET', url: `${WARNINGS_ENDPOINT}/` }),

  // Categories
  getCategories: () => IFetch<Array<Category>>({ method: 'GET', url: `${CATEGORIES_ENDPOINT}/` }),

  // Company form
  emailForm: (data: CompaniesEmail) => IFetch<RequestResponse>({ method: 'POST', url: `accept-form/`, data, withAuth: false }),

  // Badges
  createUserBadge: (data: { badge_id: string }) => IFetch<RequestResponse>({ method: 'POST', url: `${BADGES_ENDPOINT}/`, data }),

  // Membership
  getMemberships: (slug: string, filters?: any) =>
    IFetch<PaginationResponse<Membership>>({ method: 'GET', url: `${GROUPS_ENDPOINT}/${slug}/${MEMBERSHIPS_ENDPOINT}/`, data: filters || {} }),
  getMembershipsHistories: (slug: string, filters?: any) =>
    IFetch<PaginationResponse<MembershipHistory>>({ method: 'GET', url: `${GROUPS_ENDPOINT}/${slug}/${MEMBERSHIP_HISTORIES_ENDPOINT}/`, data: filters || {} }),
  createMembership: (slug: string, userId: string) =>
    IFetch<Membership>({ method: 'POST', url: `${GROUPS_ENDPOINT}/${slug}/${MEMBERSHIPS_ENDPOINT}/`, data: { user: { user_id: userId } } }),
  deleteMembership: (slug: string, userId: string) =>
    IFetch<RequestResponse>({ method: 'DELETE', url: `${GROUPS_ENDPOINT}/${slug}/${MEMBERSHIPS_ENDPOINT}/${userId}/` }),
  updateMembership: (slug: string, userId: string, data: { membership_type: MembershipType }) =>
    IFetch<Membership>({ method: 'PUT', url: `${GROUPS_ENDPOINT}/${slug}/${MEMBERSHIPS_ENDPOINT}/${userId}/`, data }),

  // Group
  getGroups: () => IFetch<Group[]>({ method: 'GET', url: `${GROUPS_ENDPOINT}/` }),
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
  getGroupFines: (groupSlug: Group['slug'], filters?: any) =>
    IFetch<PaginationResponse<GroupFine>>({ method: 'GET', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/`, data: filters || {} }),
  getGroupUsersFines: (groupSlug: Group['slug'], filters?: any) =>
    IFetch<PaginationResponse<GroupUserFine>>({
      method: 'GET',
      url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/${USERS_ENDPOINT}/`,
      data: filters || {},
    }),
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
  batchUpdateGroupFine: (groupSlug: Group['slug'], data: GroupFineBatchMutate) =>
    IFetch<RequestResponse>({ method: 'PUT', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/batch-update/`, data }),
  batchUpdateUserGroupFines: (groupSlug: Group['slug'], userId: User['user_id'], data: GroupFineMutate) =>
    IFetch<RequestResponse>({ method: 'PUT', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/batch-update/${userId}/`, data }),
  deleteGroupFine: (groupSlug: Group['slug'], fineId: GroupFine['id']) =>
    IFetch<RequestResponse>({ method: 'DELETE', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/${fineId}/` }),

  // Pages
  getPageTree: () => IFetch<PageTree>({ method: 'GET', url: `${PAGES_ENDPOINT}/tree/` }),
  getPage: (path: string) => IFetch<Page>({ method: 'GET', url: `${PAGES_ENDPOINT}/${path}` }),
  getPages: (filters: any) => IFetch<PaginationResponse<PageChildren>>({ method: 'GET', url: `${PAGES_ENDPOINT}/`, data: filters }),
  createPage: (data: PageRequired) => IFetch<Page>({ method: 'POST', url: `${PAGES_ENDPOINT}/`, data }),
  updatePage: (path: string, data: Partial<Page>) => IFetch<Page>({ method: 'PUT', url: `${PAGES_ENDPOINT}/${path}`, data }),
  deletePage: (path: string) => IFetch<RequestResponse>({ method: 'DELETE', url: `${PAGES_ENDPOINT}/${path}` }),

  // File-upload
  uploadFile: (file: File | Blob) => IFetch<FileUploadResponse>({ method: 'POST', url: 'upload/', file }),
};
