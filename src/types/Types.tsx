import { WarningType, CheatsheetGrade, CheatsheetStudy } from 'types/Enums';

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
  events: Array<Event>;
  groups: Array<string>;
  unread_notifications: number;
  notifications: Array<unknown>;
}

export interface UserRegistration {
  allow_photo: boolean;
  has_attended: boolean;
  is_on_wait: boolean;
  user_event_id: number;
  user_info: {
    allergy: string;
    first_name: string;
    last_name: string;
    user_class: number;
    user_id: string;
    user_study: number;
  };
}

export interface Event {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  location: string;
  description: string;
  sign_up: boolean;
  priority: number;
  category: number;
  expired: boolean;
  image?: string;
  image_alt?: string;
}
export interface EventWithRegistration extends Event {
  closed: boolean;
  limit: number;
  registered_users_list: Array<unknown>;
  list_count: number;
  waiting_list_count: number;
  is_user_registered?: undefined;
  start_registration_at: string;
  end_registration_at: string;
  sign_off_deadline: string;
  registration_priorities: Array<RegistrationPriority>;
}

export interface RegistrationPriority {
  user_class: number;
  user_study: number;
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
  grade: CheatsheetGrade;
  id: string;
  study: CheatsheetStudy;
  title: string;
  url: string;
}
