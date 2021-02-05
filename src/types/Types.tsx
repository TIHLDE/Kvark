import { Groups, WarningType, Study, CheatsheetType, UserClass, UserStudy } from 'types/Enums';

export interface Warning {
  created_at: string;
  id: number;
  text: string;
  type: WarningType;
  updated_at: string;
}

export interface RequestResponse {
  detail: string;
}

export interface LoginRequestResponse {
  token: string;
}

export interface PaginationResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<T>;
}

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  cell: number;
  home_busstop?: string;
  gender: number;
  user_class: number;
  user_study: number;
  allergy: string;
  tool: string;
  app_token: string;
  is_TIHLDE_member: boolean;
  events: Array<EventCompact>;
  groups: Array<Groups>;
  unread_notifications: number;
  notifications: Array<Notification>;
  badges: Array<Badge>;
}
export type UserCreate = Pick<User, 'email' | 'first_name' | 'last_name' | 'user_class' | 'user_id' | 'user_study'> & {
  password: string;
};

export type NewsRequired = Partial<News> & Pick<News, 'title' | 'header' | 'body'>;

export interface Badge {
  title: string;
  description: string;
  total_completion_percentage: number;
  image?: string;
  image_alt?: string;
  id: string;
}

export interface Notification {
  id: number;
  read: boolean;
  message: string;
}

export interface News {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  header: string;
  body: string;
  image?: string;
  image_alt?: string;
}

export type JobPostRequired = Partial<JobPost> & Pick<JobPost, 'body' | 'company' | 'ingress' | 'location' | 'title'>;

export interface JobPost {
  body: string;
  company: string;
  created_at: string;
  deadline: string;
  email: string;
  expired: boolean;
  id: number;
  ingress: string;
  image: string;
  image_alt: string;
  link: string;
  location: string;
  title: string;
  updated_at: string;
}

export interface Event {
  closed: boolean;
  category: number;
  description: string;
  end_date: string;
  end_registration_at: string;
  evaluate_link: string;
  expired: boolean;
  id: number;
  image?: string;
  image_alt?: string;
  limit: number;
  list_count: number;
  location: string;
  priority: number;
  registration_priorities: Array<RegistrationPriority>;
  sign_off_deadline: string;
  sign_up: boolean;
  start_date: string;
  start_registration_at: string;
  title: string;
  updated_at: string;
  waiting_list_count: number;
}
export type EventRequired = Partial<Event> & Pick<Event, 'end_date' | 'title' | 'start_date'>;
export type EventCompact = Pick<Event, 'end_date' | 'expired' | 'id' | 'image' | 'image_alt' | 'location' | 'title' | 'start_date' | 'updated_at'>;

export interface RegistrationPriority {
  user_class: UserClass;
  user_study: UserStudy;
}

export interface Registration {
  allow_photo: boolean;
  has_attended: boolean;
  is_on_wait: boolean;
  registration_id: number;
  user_info: Pick<User, 'allergy' | 'email' | 'first_name' | 'last_name' | 'user_class' | 'user_id' | 'user_study'>;
}

export interface Registration {
  allow_photo: boolean;
  has_attended: boolean;
  is_on_wait: boolean;
  registration_id: number;
  user_info: Pick<User, 'allergy' | 'email' | 'first_name' | 'last_name' | 'user_class' | 'user_id' | 'user_study'>;
}

export interface CompaniesEmail {
  info: {
    bedrift: string;
    kontaktperson: string;
    epost: string;
  };
  time: Array<string>;
  type: Array<string>;
  comment: string;
}

export interface Cheatsheet {
  course: string;
  creator: string;
  grade: number;
  id: string;
  official: boolean;
  study: Study;
  title: string;
  type: CheatsheetType;
  url: string;
}

export interface Category {
  created_at: string;
  id: number;
  text: string;
  updated_at: string;
}

export type PageRequired = Partial<Page> & Pick<Page, 'title' | 'slug' | 'path'>;

export interface Page {
  children: Array<{
    title: string;
    slug: string;
  }>;
  content: string;
  created_at: string;
  image?: string;
  image_alt?: string;
  path: string;
  slug: string;
  title: string;
  updated_at: string;
}

export interface PageTree {
  slug: string;
  title: string;
  children: Array<PageTree>;
}
