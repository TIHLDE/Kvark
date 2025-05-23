/* eslint-disable @typescript-eslint/no-explicit-any */

import { IFetch } from '~/api/fetch';
import type {
  Badge,
  BadgeCategory,
  BadgeLeaderboard,
  BadgesOverallLeaderboard,
  Category,
  Cheatsheet,
  CompaniesEmail,
  createFeedbackInput,
  CreateQRCode,
  Event,
  EventFavorite,
  EventList,
  EventMutate,
  EventStatistics,
  Feedback,
  FileUploadResponse,
  Form,
  FormCreate,
  FormStatistics,
  FormUpdate,
  Gallery,
  GalleryCreate,
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
  GroupMemberStatistics,
  GroupMutate,
  GroupUserFine,
  InfoBanner,
  JobPost,
  JobPostRequired,
  LoginRequestResponse,
  Membership,
  MembershipHistory,
  MembershipHistoryMutate,
  News,
  NewsRequired,
  Notification,
  Order,
  PaginationResponse,
  Picture,
  PublicRegistration,
  QRCode,
  Reaction,
  ReactionMutate,
  Registration,
  RequestResponse,
  ShortLink,
  Strike,
  StrikeCreate,
  StrikeList,
  Submission,
  User,
  UserBio,
  UserBioCreate,
  UserCreate,
  UserNotificationSetting,
  UserNotificationSettingChoice,
  UserPermissions,
  UserSubmission,
  Warning,
  WikiChildren,
  WikiPage,
  WikiRequired,
  WikiTree,
} from '~/types';
import { CheatsheetStudy, MembershipType } from '~/types/Enums';

export const AUTH_ENDPOINT = 'auth';
export const BADGES_ENDPOINT = 'badges';
export const BADGES_LEADERBOARD_ENDPOINT = 'leaderboard';
export const BADGE_CATEGORIES_ENDPOINT = 'categories';
export const BANNER_ENDPOINT = 'banners';
export const CATEGORIES_ENDPOINT = 'categories';
export const CHEATSHEETS_ENDPOINT = 'cheatsheets';
export const EVENTS_ENDPOINT = 'events';
export const ORDER_ENPOINT = 'payment/order';
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
export const QR_CODE_ENDPOINT = 'qr-codes';
export const STRIKES_ENDPOINT = 'strikes';
export const SUBMISSIONS_ENDPOINT = 'submissions';
export const USERS_ENDPOINT = 'users';
export const WARNINGS_ENDPOINT = 'warnings';
export const PAYMENT_ENDPOINT = 'payments';
export const EMOJI_ENDPOINT = 'emojis';
export const BIO_ENDPOINT = 'user-bios/';
export const FEIDE_ENDPOINT = 'feide/';
export const FEEDBACK_ENDPOINT = 'feedbacks/';

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

  // InfoBanner
  getInfoBanners: (filters?: any) => IFetch<PaginationResponse<InfoBanner>>({ method: 'GET', url: BANNER_ENDPOINT, data: filters || {} }),
  getInfoBanner: (bannerId: InfoBanner['id']) => IFetch<InfoBanner>({ method: 'GET', url: `${BANNER_ENDPOINT}/${bannerId}/` }),
  getVisibleInfoBanners: (filters?: any) => IFetch<Array<InfoBanner>>({ method: 'GET', url: `${BANNER_ENDPOINT}/visible`, data: filters || {} }),
  createInfoBanner: (item: InfoBanner) => IFetch<InfoBanner>({ method: 'POST', url: `${BANNER_ENDPOINT}/`, data: item }),
  updateInfoBanner: (bannerId: InfoBanner['id'], item: Partial<InfoBanner>) =>
    IFetch<InfoBanner>({ method: 'PUT', url: `${BANNER_ENDPOINT}/${bannerId}/`, data: item }),
  deleteInfoBanner: (bannerId: InfoBanner['id']) => IFetch<RequestResponse>({ method: 'DELETE', url: `${BANNER_ENDPOINT}/${bannerId}/` }),

  // Events
  getEvent: (eventId: Event['id']) => IFetch<Event>({ method: 'GET', url: `${EVENTS_ENDPOINT}/${String(eventId)}/` }),
  getEventStatistics: (eventId: Event['id']) => IFetch<EventStatistics>({ method: 'GET', url: `${EVENTS_ENDPOINT}/${String(eventId)}/statistics/` }),
  getEvents: (filters?: any) => IFetch<PaginationResponse<EventList>>({ method: 'GET', url: `${EVENTS_ENDPOINT}/`, data: filters || {} }),
  getEventsWhereIsAdmin: (filters?: any) => IFetch<PaginationResponse<EventList>>({ method: 'GET', url: `${EVENTS_ENDPOINT}/admin/`, data: filters || {} }),
  createEvent: (item: EventMutate) => IFetch<Event>({ method: 'POST', url: `${EVENTS_ENDPOINT}/`, data: item }),
  updateEvent: (eventId: Event['id'], item: EventMutate) => IFetch<Event>({ method: 'PUT', url: `${EVENTS_ENDPOINT}/${String(eventId)}/`, data: item }),
  deleteEvent: (eventId: Event['id']) => IFetch<RequestResponse>({ method: 'DELETE', url: `${EVENTS_ENDPOINT}/${String(eventId)}/` }),
  notifyEventRegistrations: (eventId: Event['id'], title: string, message: string) =>
    IFetch<RequestResponse>({ method: 'POST', url: `${EVENTS_ENDPOINT}/${String(eventId)}/notify/`, data: { title, message } }),
  getPublicEventRegistrations: (eventId: Event['id'], filters?: any) =>
    IFetch<PaginationResponse<PublicRegistration>>({ method: 'GET', url: `${EVENTS_ENDPOINT}/${String(eventId)}/public_registrations/`, data: filters || {} }),
  sendGiftCardsToAttendees: (eventId: Event['id'], files: File | File[] | Blob) =>
    IFetch<RequestResponse>({ method: 'POST', url: `${EVENTS_ENDPOINT}/${String(eventId)}/mail-gift-cards/`, file: files }),
  getEventIsFavorite: (eventId: Event['id']) => IFetch<EventFavorite>({ method: 'GET', url: `${EVENTS_ENDPOINT}/${String(eventId)}/favorite/` }),
  setEventIsFavorite: (eventId: Event['id'], data: EventFavorite) =>
    IFetch<EventFavorite>({ method: 'PUT', url: `${EVENTS_ENDPOINT}/${String(eventId)}/favorite/`, data }),

  // Event order
  getEventPaymentOrder: (eventId: Event['id'], userId: User['user_id']) =>
    IFetch<Order>({ method: 'GET', url: `${ORDER_ENPOINT}`, data: { user_id: userId, event: eventId } }),

  // Event registrations
  getRegistration: (eventId: Event['id'], userId: User['user_id']) =>
    IFetch<Registration>({ method: 'GET', url: `${EVENTS_ENDPOINT}/${String(eventId)}/${EVENT_REGISTRATIONS_ENDPOINT}/${userId}/` }),
  getEventRegistrations: (eventId: Event['id'], filters?: any) =>
    IFetch<PaginationResponse<Registration>>({
      method: 'GET',
      url: `${EVENTS_ENDPOINT}/${String(eventId)}/${EVENT_REGISTRATIONS_ENDPOINT}/`,
      data: filters || {},
    }),
  createRegistration: (eventId: Event['id'], item: Partial<Registration>) =>
    IFetch<Registration>({ method: 'POST', url: `${EVENTS_ENDPOINT}/${String(eventId)}/${EVENT_REGISTRATIONS_ENDPOINT}/`, data: item }),
  updateRegistration: (eventId: Event['id'], item: Partial<Registration>, userId: User['user_id']) =>
    IFetch<Registration>({ method: 'PUT', url: `${EVENTS_ENDPOINT}/${String(eventId)}/${EVENT_REGISTRATIONS_ENDPOINT}/${userId}/`, data: item }),
  deleteRegistration: (eventId: Event['id'], userId: User['user_id']) =>
    IFetch<RequestResponse>({ method: 'DELETE', url: `${EVENTS_ENDPOINT}/${String(eventId)}/${EVENT_REGISTRATIONS_ENDPOINT}/${userId}/` }),

  // Payments
  createPaymentOrder: (item: Partial<Order>) => IFetch<Order>({ method: 'POST', url: `${PAYMENT_ENDPOINT}/`, data: item }),
  // Event registrations admin
  createRegistrationAdmin: (eventId: Event['id'], userId: User['user_id']) =>
    IFetch<Registration>({ method: 'POST', url: `${EVENTS_ENDPOINT}/${eventId}/${EVENT_REGISTRATIONS_ENDPOINT}/add/`, data: { user: userId } }),

  // Forms
  getForm: (formId: string) => IFetch<Form>({ method: 'GET', url: `${FORMS_ENDPOINT}/${formId}/` }),
  getFormTemplates: () => IFetch<Array<Form>>({ method: 'GET', url: `${FORMS_ENDPOINT}/` }),
  getFormStatistics: (formId: string) => IFetch<FormStatistics>({ method: 'GET', url: `${FORMS_ENDPOINT}/${formId}/statistics/` }),
  createForm: (item: FormCreate) => IFetch<Form>({ method: 'POST', url: `${FORMS_ENDPOINT}/`, data: item }),
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

  // EmojiReactions
  createReaction: (item: ReactionMutate) => IFetch<Reaction>({ method: 'POST', url: `${EMOJI_ENDPOINT}/reactions/`, data: item }),
  deleteReaction: (reactionId: Reaction['reaction_id']) => IFetch<RequestResponse>({ method: 'DELETE', url: `${EMOJI_ENDPOINT}/reactions/${reactionId}/` }),
  updateReaction: (reactionId: Reaction['reaction_id'], item: ReactionMutate) =>
    IFetch<Reaction>({ method: 'PUT', url: `${EMOJI_ENDPOINT}/reactions/${reactionId}/`, data: item }),

  // User
  getUserData: (userId?: User['user_id']) => IFetch<User>({ method: 'GET', url: `${USERS_ENDPOINT}/${userId || ME_ENDPOINT}/` }),
  getUserPermissions: () => IFetch<UserPermissions>({ method: 'GET', url: `${USERS_ENDPOINT}/${ME_ENDPOINT}/permissions/` }),
  getUserBadges: (userId?: User['user_id'], filters?: any) =>
    IFetch<PaginationResponse<Badge>>({ method: 'GET', url: `${USERS_ENDPOINT}/${userId || ME_ENDPOINT}/${BADGES_ENDPOINT}/`, data: filters || {} }),
  getUserEvents: (userId?: User['user_id'], filters?: any) =>
    IFetch<PaginationResponse<EventList>>({ method: 'GET', url: `${USERS_ENDPOINT}/${userId || ME_ENDPOINT}/${EVENTS_ENDPOINT}/`, data: filters || {} }),
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

  // Feide
  feideAuthenticate: (code: string) => IFetch<RequestResponse>({ method: 'POST', url: FEIDE_ENDPOINT, data: { code }, withAuth: false }),

  // Notifications
  getNotifications: (filters?: any) => IFetch<PaginationResponse<Notification>>({ method: 'GET', url: `${NOTIFICATIONS_ENDPOINT}/`, data: filters || {} }),
  updateNotification: (id: number, item: { read: boolean }) =>
    IFetch<Notification>({ method: 'PUT', url: `${NOTIFICATIONS_ENDPOINT}/${String(id)}/`, data: item }),

  // Short links
  getShortLinks: (filters?: any) => IFetch<Array<ShortLink>>({ method: 'GET', url: `${SHORT_LINKS_ENDPOINT}/`, data: filters || {} }),
  createShortLink: (item: ShortLink) => IFetch<ShortLink>({ method: 'POST', url: `${SHORT_LINKS_ENDPOINT}/`, data: item }),
  deleteShortLink: (slug: string) => IFetch<RequestResponse>({ method: 'DELETE', url: `${SHORT_LINKS_ENDPOINT}/${slug}/` }),

  // QR codes
  getQRCodes: (filters?: any) => IFetch<Array<QRCode>>({ method: 'GET', url: `${QR_CODE_ENDPOINT}/`, data: filters || {} }),
  createQRCode: (item: CreateQRCode) => IFetch<QRCode>({ method: 'POST', url: `${QR_CODE_ENDPOINT}/`, data: item }),
  deleteQRCode: (id: number) => IFetch<RequestResponse>({ method: 'DELETE', url: `${QR_CODE_ENDPOINT}/${String(id)}/` }),

  // Gallery
  getGallery: (id: Gallery['id']) => IFetch<Gallery>({ method: 'GET', url: `${GALLERY_ENDPOINT}/${id}/` }),
  getGalleries: (filters?: any) => IFetch<PaginationResponse<Gallery>>({ method: 'GET', url: `${GALLERY_ENDPOINT}/`, data: filters || {} }),
  createGallery: (item: GalleryCreate) => IFetch<Gallery>({ method: 'POST', url: `${GALLERY_ENDPOINT}/`, data: item }),
  updateGallery: (id: Gallery['id'], item: Partial<Gallery>) => IFetch<Gallery>({ method: 'PUT', url: `${GALLERY_ENDPOINT}/${id}/`, data: item }),
  deleteGallery: (id: Gallery['id']) => IFetch<RequestResponse>({ method: 'DELETE', url: `${GALLERY_ENDPOINT}/${id}/` }),

  // Picture
  getGalleryPictures: (galleryId: Gallery['id'], filters?: any) =>
    IFetch<PaginationResponse<Picture>>({ method: 'GET', url: `${GALLERY_ENDPOINT}/${galleryId}/${PICTURE_ENDPOINT}/`, data: filters || {} }),
  getPicture: (galleryId: Gallery['id'], pictureId: Picture['id']) =>
    IFetch<Picture>({ method: 'GET', url: `${GALLERY_ENDPOINT}/${galleryId}/${PICTURE_ENDPOINT}/${pictureId}` }),
  createPicture: (galleryId: Gallery['id'], files: File | File[] | Blob) =>
    IFetch<RequestResponse>({ method: 'POST', url: `${GALLERY_ENDPOINT}/${galleryId}/${PICTURE_ENDPOINT}/`, file: files }),
  updatePicture: (galleryId: Gallery['id'], pictureId: Picture['id'], item: Partial<Picture>) =>
    IFetch<Picture>({ method: 'PUT', url: `${GALLERY_ENDPOINT}/${galleryId}/${PICTURE_ENDPOINT}/${pictureId}/`, data: item }),
  deletePicture: (galleryId: Gallery['id'], pictureId: Picture['id']) =>
    IFetch<RequestResponse>({ method: 'DELETE', url: `${GALLERY_ENDPOINT}/${galleryId}/${PICTURE_ENDPOINT}/${pictureId}` }),

  // Strikes
  createStrike: (item: StrikeCreate) => IFetch<Strike>({ method: 'POST', url: `${STRIKES_ENDPOINT}/`, data: item }),
  deleteStrike: (id: string) => IFetch<RequestResponse>({ method: 'DELETE', url: `${STRIKES_ENDPOINT}/${id}/` }),
  getStrikes: (filters?: any) => IFetch<PaginationResponse<StrikeList>>({ method: 'GET', url: `${STRIKES_ENDPOINT}/`, data: filters || {} }),

  // Cheatsheet
  getCheatsheets: (study: CheatsheetStudy, grade: number, filters?: any) => {
    const tempStudy = study === CheatsheetStudy.DIGSEC ? 'DIGINC' : study;
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
  getBadge: (badgeId: Badge['id']) => IFetch<Badge>({ method: 'GET', url: `${BADGES_ENDPOINT}/${badgeId}/` }),
  getBadges: (filters?: any) => IFetch<PaginationResponse<Badge>>({ method: 'GET', url: `${BADGES_ENDPOINT}/`, data: filters || {} }),
  createUserBadge: (data: { flag: string }) => IFetch<RequestResponse>({ method: 'POST', url: `${USERS_ENDPOINT}/${ME_ENDPOINT}/${BADGES_ENDPOINT}/`, data }),
  getBadgeLeaderboard: (badgeId: Badge['id'], filters?: any) =>
    IFetch<PaginationResponse<BadgeLeaderboard>>({ method: 'GET', url: `${BADGES_ENDPOINT}/${badgeId}/${BADGES_LEADERBOARD_ENDPOINT}/`, data: filters || {} }),
  getOverallBadgesLeaderboard: (filters?: any) =>
    IFetch<PaginationResponse<BadgesOverallLeaderboard>>({ method: 'GET', url: `${BADGES_ENDPOINT}/${BADGES_LEADERBOARD_ENDPOINT}/`, data: filters || {} }),
  getBadgeCategories: (filters?: any) =>
    IFetch<PaginationResponse<BadgeCategory>>({ method: 'GET', url: `${BADGES_ENDPOINT}/${BADGE_CATEGORIES_ENDPOINT}/`, data: filters || {} }),
  getBadgeCategory: (badgeCategoryId: BadgeCategory['id']) =>
    IFetch<BadgeCategory>({ method: 'GET', url: `${BADGES_ENDPOINT}/${BADGE_CATEGORIES_ENDPOINT}/${badgeCategoryId}/` }),

  // Membership
  getMemberships: (groupSlug: Group['slug'], filters?: any) =>
    IFetch<PaginationResponse<Membership>>({ method: 'GET', url: `${GROUPS_ENDPOINT}/${groupSlug}/${MEMBERSHIPS_ENDPOINT}/`, data: filters || {} }),
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

  // Group
  getGroups: (filters?: any) => IFetch<GroupList[]>({ method: 'GET', url: `${GROUPS_ENDPOINT}/`, data: filters || {} }),
  getGroup: (slug: Group['slug']) => IFetch<Group>({ method: 'GET', url: `${GROUPS_ENDPOINT}/${slug}/` }),
  getGroupStatistics: (slug: Group['slug']) => IFetch<GroupMemberStatistics>({ method: 'GET', url: `${GROUPS_ENDPOINT}/${slug}/statistics/` }),
  updateGroup: (slug: Group['slug'], data: GroupMutate) => IFetch<Group>({ method: 'PUT', url: `${GROUPS_ENDPOINT}/${slug}/`, data }),
  createGroup: (data: GroupMutate) => IFetch<Group>({ method: 'POST', url: `${GROUPS_ENDPOINT}/`, data }),

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
  getGroupFinesStatistics: (groupSlug: Group['slug']) =>
    IFetch<GroupFineStatistics>({ method: 'GET', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/statistics/` }),
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
  updateGroupFineDefense: (groupSlug: Group['slug'], fineId: GroupFine['id'], data: GroupFineDefenseMutate) =>
    IFetch<GroupFine>({ method: 'PUT', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/${fineId}/defense/`, data }),
  batchUpdateGroupFine: (groupSlug: Group['slug'], data: GroupFineBatchMutate) =>
    IFetch<RequestResponse>({ method: 'PUT', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/batch-update/`, data }),
  batchUpdateUserGroupFines: (groupSlug: Group['slug'], userId: User['user_id'], data: GroupFineMutate) =>
    IFetch<RequestResponse>({ method: 'PUT', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/batch-update/${userId}/`, data }),
  deleteGroupFine: (groupSlug: Group['slug'], fineId: GroupFine['id']) =>
    IFetch<RequestResponse>({ method: 'DELETE', url: `${GROUPS_ENDPOINT}/${groupSlug}/${GROUP_FINES_ENDPOINT}/${fineId}/` }),

  //Group forms
  getGroupForms: (slug: string) => IFetch<Array<GroupForm>>({ method: 'GET', url: `${GROUPS_ENDPOINT}/${slug}/${FORMS_ENDPOINT}/` }),

  // Wiki
  getWikiTree: () => IFetch<WikiTree>({ method: 'GET', url: `${WIKI_ENDPOINT}/tree/` }),
  getWikiPage: (path: string) => IFetch<WikiPage>({ method: 'GET', url: `${WIKI_ENDPOINT}/${path}` }),
  getWikiSearch: (filters: any) => IFetch<PaginationResponse<WikiChildren>>({ method: 'GET', url: `${WIKI_ENDPOINT}/`, data: filters }),
  createWikiPage: (data: WikiRequired) => IFetch<WikiPage>({ method: 'POST', url: `${WIKI_ENDPOINT}/`, data }),
  updateWikiPage: (path: string, data: Partial<WikiPage>) => IFetch<WikiPage>({ method: 'PUT', url: `${WIKI_ENDPOINT}/${path}`, data }),
  deleteWikiPage: (path: string) => IFetch<RequestResponse>({ method: 'DELETE', url: `${WIKI_ENDPOINT}/${path}` }),

  // File-upload
  uploadFile: (file: File | Blob) => IFetch<FileUploadResponse>({ method: 'POST', url: 'upload/', file }),

  // User bio
  createUserBio: (data: UserBioCreate) => IFetch<UserBio>({ method: 'POST', url: `${BIO_ENDPOINT}`, data }),
  updateUserBio: (id: UserBio['id'], data: Partial<UserBio>) => IFetch<UserBio>({ method: 'PUT', url: `${BIO_ENDPOINT}${id}/`, data }),
  deleteUserBio: (id: UserBio['id']) => IFetch<UserBio>({ method: 'DELETE', url: `${BIO_ENDPOINT}${id}/` }),
  getUserBio: (id: UserBio['id'] | null) => IFetch<UserBio>({ method: 'GET', url: `${BIO_ENDPOINT}${id}/` }),

  // Feedback
  getFeedbacks: (filters?: any) => IFetch<PaginationResponse<Feedback>>({ method: 'GET', url: `${FEEDBACK_ENDPOINT}`, data: filters || {} }),
  createFeedback: (data: createFeedbackInput) => IFetch<Feedback>({ method: 'POST', url: `${FEEDBACK_ENDPOINT}`, data }),
  deleteFeedback: (id: Feedback['id']) => IFetch<Feedback>({ method: 'DELETE', url: `${FEEDBACK_ENDPOINT}${id}/` }),
};
