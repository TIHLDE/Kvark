import type {
  Badge,
  BadgeCategory,
  BadgeLeaderboard,
  BadgesOverallLeaderboard,
  Category,
  Cheatsheet,
  Event,
  EventFavorite,
  EventList,
  EventStatistics,
  Feedback,
  Form,
  FormStatistics,
  Gallery,
  GroupForm,
  GroupMemberStatistics,
  InfoBanner,
  JobPost,
  MembershipHistory,
  News,
  Notification,
  Order,
  Picture,
  Reaction,
  Registration,
  ShortLink,
  Strike,
  StrikeList,
  Submission,
  UserNotificationSetting,
  UserNotificationSettingChoice,
  UserSubmission,
  WikiPage,
  WikiTree,
} from '~/types';
import { CheatsheetStudy, CheatsheetType, FormFieldType, FormResourceType, GroupType, JobPostType, MembershipType, WarningType } from '~/types/Enums';
import { userBase, users } from './data';

const baseGroup = { name: 'Kvark', slug: 'kvark', type: GroupType.BOARD, image: null, image_alt: null, viewer_is_member: true };

// --- Events ---
export const eventList: EventList[] = [
  {
    id: 1,
    title: 'Mock-bedpres med Sensuro',
    location: 'Realfagsbygget',
    start_date: '2025-12-01T17:00:00.000Z',
    end_date: '2025-12-01T20:00:00.000Z',
    expired: false,
    organizer: baseGroup,
    updated_at: '2025-11-01T10:00:00.000Z',
    category: { id: 1, text: 'Bedpres' },
  },
  {
    id: 2,
    title: 'Mock-LAN',
    location: 'Spaces',
    start_date: '2025-12-10T16:00:00.000Z',
    end_date: '2025-12-11T08:00:00.000Z',
    expired: false,
    organizer: baseGroup,
    updated_at: '2025-11-05T10:00:00.000Z',
    category: { id: 2, text: 'Sosialt' },
  },
];

export const event: Event = {
  ...eventList[0],
  closed: false,
  category: 1,
  is_paid_event: false,
  description: 'Dette er en mock-bedpres. Kom og test bøter-siden i stedet.',
  end_registration_at: '2025-11-30T12:00:00.000Z',
  start_registration_at: '2025-11-20T12:00:00.000Z',
  evaluation: null,
  limit: 30,
  list_count: 12,
  permissions: { write: true, read: true },
  priority_pools: [{ groups: [baseGroup] }],
  sign_off_deadline: '2025-11-29T12:00:00.000Z',
  sign_up: true,
  survey: null,
  waiting_list_count: 0,
  can_cause_strikes: true,
  enforces_previous_strikes: true,
  only_allow_prioritized: false,
  contact_person: null,
  emojis_allowed: true,
  reactions: [],
};

export const eventStatistics: EventStatistics = {
  has_attended_count: 10,
  list_count: 12,
  waiting_list_count: 0,
  studyyears: [{ studyyear: 'Kvark', amount: 12 }],
  studies: [{ study: 'Dataingeniør', amount: 12 }],
  has_allergy_count: 2,
  has_not_paid_count: 0,
  allow_photo_count: 11,
  suspicious_payment_count: 0,
};

export const eventFavorite: EventFavorite = { is_favorite: false };

export const userSubmission: UserSubmission = {
  created_at: '2025-11-21T09:00:00.000Z',
  updated_at: '2025-11-21T09:00:00.000Z',
  user: userBase('index'),
  form: 'form-1',
  answers: [{ field: { id: 'field-1' }, answer_text: 'Mock-svar', type: 'text-field' }],
};

export const registration: Registration = {
  allow_photo: true,
  created_at: '2025-11-21T09:00:00.000Z',
  has_attended: false,
  is_on_wait: false,
  registration_id: 1,
  survey_submission: userSubmission,
  has_unanswered_evaluation: false,
  user_info: { ...users[2] },
  payment_expiredate: new Date('2025-12-01T12:00:00.000Z'),
};

// --- Forms ---
export const form: Form = {
  id: 'form-1',
  title: 'Mock-undersøkelse',
  description: 'En mock-form for testing.',
  fields: [
    { id: 'field-1', title: 'Hva synes du?', order: 1, required: true, options: [], type: FormFieldType.TEXT_ANSWER },
    {
      id: 'field-2',
      title: 'Hvor ofte?',
      order: 2,
      required: false,
      type: FormFieldType.SINGLE_SELECT,
      options: [
        { id: 'opt-1', title: 'Aldri' },
        { id: 'opt-2', title: 'Av og til' },
      ],
    },
  ],
  viewer_has_answered: false,
  template: true,
  resource_type: FormResourceType.FORM,
};

export const groupForm: GroupForm = {
  ...form,
  template: false,
  resource_type: FormResourceType.GROUP_FORM,
  group: baseGroup,
  can_submit_multiple: true,
  only_for_group_members: false,
  is_open_for_submissions: true,
  email_receiver_on_submit: null,
};

export const formStatistics: FormStatistics = {
  ...form,
  statistics: [
    {
      id: 'field-2',
      title: 'Hvor ofte?',
      order: 2,
      required: false,
      type: FormFieldType.SINGLE_SELECT,
      options: [
        { id: 'opt-1', title: 'Aldri', answer_amount: 3, answer_percentage: 30 },
        { id: 'opt-2', title: 'Av og til', answer_amount: 7, answer_percentage: 70 },
      ],
    },
  ],
};

export const submission: Submission = { answers: userSubmission.answers };

// --- Job posts / News ---
export const jobPost: JobPost = {
  id: 1,
  title: 'Mock-utvikler hos Sensuro',
  ingress: 'Vi ser etter en mock-utvikler.',
  body: 'Lange mock-beskrivelse om en spennende stilling i et mock-firma.',
  company: 'Sensuro',
  location: 'Trondheim',
  deadline: '2025-12-15T23:59:00.000Z',
  email: 'jobs@sensuro.mock',
  expired: false,
  image: '',
  image_alt: '',
  link: 'https://sensuro.mock/jobs',
  created_at: '2025-11-01T10:00:00.000Z',
  updated_at: '2025-11-01T10:00:00.000Z',
  is_continuously_hiring: false,
  job_type: JobPostType.PART_TIME,
  class_start: 3,
  class_end: 5,
};

export const news: News = {
  id: 1,
  title: 'Mock-nyhet: Bøter-siden eråpen',
  header: 'Bøter-siden er åpen',
  body: 'Nå kan du se bøter med mockedata.',
  creator: userBase('index'),
  created_at: '2025-11-10T10:00:00.000Z',
  updated_at: '2025-11-10T10:00:00.000Z',
  emojis_allowed: true,
  reactions: [],
};

export const reaction: Reaction = {
  content_type: 'news',
  emoji: '👍',
  object_id: 1,
  reaction_id: 'reaction-1',
  user: userBase('index'),
};

// --- Strikes ---
export const strike: Strike = {
  id: 'strike-1',
  description: 'Møtte ikke på mock-arrangement',
  strike_size: 1,
  expires_at: '2026-01-01T00:00:00.000Z',
  created_at: '2025-11-15T10:00:00.000Z',
  creator: userBase('index'),
  event: eventList[0],
};

export const strikeList: StrikeList = { ...strike, user: userBase('per_h') };

// --- Banners ---
export const banner: InfoBanner = {
  id: 'banner-1',
  title: 'Mock-banner',
  description: 'Dette er et mock-info-banner.',
  visible_from: '2025-01-01T00:00:00.000Z',
  visible_until: '2026-01-01T00:00:00.000Z',
  is_visible: true,
  is_expired: false,
};

// --- Notifications / Short links ---
export const notification: Notification = {
  id: 1,
  read: false,
  title: 'Mock-varsling',
  description: 'Du har fått en mock-bot.',
  link: '/grupper/kvark/boter',
  created_at: '2025-11-20T12:00:00.000Z',
};

export const shortLink: ShortLink = { name: 'mock-link', url: 'https://tihlde.org/grupper/kvark/boter' };

// --- Gallery ---
export const gallery: Gallery = {
  id: 'gallery-1',
  title: 'Mock-galleri',
  image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
  slug: 'mock-galleri',
  image_alt: 'Mock-bilde',
  description: 'Mock-bilder fra et mock-arrangement.',
  event: eventList[0],
};

export const picture: Picture = {
  id: 'picture-1',
  image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
  title: 'Mock-bilde',
  image_alt: 'Mock-bilde',
  description: '',
  created_at: '2025-11-01T10:00:00.000Z',
  updated_at: '2025-11-01T10:00:00.000Z',
};

// --- Badges ---
export const badge: Badge = {
  id: 'badge-1',
  title: 'Mock-ervert',
  description: 'Gitt til deg for å teste bøter-siden.',
  total_completion_percentage: 100,
  badge_category: 'badge-cat-1',
  active_from: '2025-01-01T00:00:00.000Z',
  active_to: '2026-01-01T00:00:00.000Z',
  image: null,
  image_alt: null,
};

export const badgeCategory: BadgeCategory = {
  id: 'badge-cat-1',
  name: 'Mock-kategori',
  description: 'Mock-kategori for erverv.',
  image: null,
  image_alt: null,
};

export const badgeLeaderboard: BadgeLeaderboard = { user: userBase('index'), created_at: '2025-11-01T10:00:00.000Z' };

export const badgesOverallLeaderboard: BadgesOverallLeaderboard = { user: userBase('index'), number_of_badges: 3 };

// --- Cheatsheets / Categories / Wiki ---
export const cheatsheet: Cheatsheet = {
  id: 'cheat-1',
  course: 'Mock-kurs',
  creator: 'index',
  grade: 3,
  official: true,
  study: CheatsheetStudy.DATAING,
  title: 'Mock-kokebok',
  type: CheatsheetType.LINK,
  url: 'https://github.com/tihlde',
};

export const category: Category = {
  id: 1,
  text: 'Bedpres',
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-01T00:00:00.000Z',
};

export const wikiTree: WikiTree = {
  slug: 'hovedside',
  title: 'Hovedside',
  children: [
    { slug: 'boter', title: 'Bøter', children: [] },
    { slug: 'lovverk', title: 'Lovverk', children: [] },
  ],
};

export const wikiPage: WikiPage = {
  title: 'Bøter',
  slug: 'boter',
  path: 'boter/',
  content: '# Bøter\n\nMock-wikiside om bøter.',
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-01T00:00:00.000Z',
  children: [],
};

// --- Misc ---
export const order: Order = { order_id: 'order-1', user_id: 'index', event: 1, status: 'PAID', payment_link: 'https://pay.mock/order-1' };

export const membershipHistory: MembershipHistory = {
  group: baseGroup,
  user: userBase('index'),
  membership_type: MembershipType.LEADER,
  id: 'mh-1',
  start_date: '2024-01-01',
  end_date: '2025-12-31',
};

export const userNotificationSetting: UserNotificationSetting = { notification_type: 'EVENT', email: true, website: true, slack: false };

export const userNotificationSettingChoice: UserNotificationSettingChoice = { notification_type: 'EVENT', label: 'Arrangementer' };

export const feedback: Feedback = {
  id: 1,
  feedback_type: 'Idea',
  title: 'Mock-tilbakemelding',
  created_at: '2025-11-01T10:00:00.000Z',
  status: 'OPEN',
  author: { first_name: 'Bortherman', last_name: 'Testern', image: '', user_id: 'index' },
  description: 'Dette er en mock-tilbakemelding.',
  reactions: [],
  upvotes: 1,
  downvotes: 0,
};

export const groupMemberStatistics: GroupMemberStatistics = {
  studyyears: [{ studyyear: 'Kvark', amount: 3 }],
  studies: [{ study: 'Dataingeniør', amount: 3 }],
};

export const warning = {
  id: 1,
  text: 'Mock-advarsel',
  type: WarningType.MESSAGE,
  created_at: '2025-11-01T10:00:00.000Z',
  updated_at: '2025-11-01T10:00:00.000Z',
};
