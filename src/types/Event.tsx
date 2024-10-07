import { UserSubmission } from 'types/Form';
import { BaseGroup, Group } from 'types/Group';
import { Permissions } from 'types/Misc';
import { User, UserList } from 'types/User';

import { Reaction } from './News';

export type Category = {
  created_at: string;
  id: number;
  text: string;
  updated_at: string;
};

export type PaidInformation = {
  price: number;
  paytime: string;
};

export type Event = {
  closed: boolean;
  category: number;
  price?: number;
  paytime?: string | Date;
  is_paid_event: boolean;
  paid_information?: PaidInformation;
  description: string;
  end_date: string;
  end_registration_at: string;
  evaluation: string | null;
  expired: boolean;
  organizer: BaseGroup | null;
  id: number;
  image?: string;
  image_alt?: string;
  limit: number;
  list_count: number;
  location: string;
  permissions: Permissions;
  priority_pools: Array<PriorityPool>;
  sign_off_deadline: string;
  sign_up: boolean;
  start_date: string;
  start_registration_at: string;
  survey: string | null;
  title: string;
  updated_at: string;
  waiting_list_count: number;
  can_cause_strikes: boolean;
  enforces_previous_strikes: boolean;
  only_allow_prioritized: boolean;
  contact_person: User | null;
  emojis_allowed: boolean;
  reactions: Reaction[];
};

export type EventMutate = Partial<Omit<Event, 'organizer' | 'priority_pools'>> &
  Pick<Event, 'end_date' | 'title' | 'start_date'> & {
    organizer: BaseGroup['slug'] | null;
    priority_pools: Array<PriorityPoolMutate>;
  };

export type EventList = {
  end_date: string;
  expired: boolean;
  organizer: BaseGroup | null;
  id: number;
  image?: string;
  image_alt?: string;
  location: string;
  title: string;
  start_date: string;
  updated_at: string;
  category: Pick<Category, 'id' | 'text'>;
};

export type EventFavorite = {
  is_favorite: boolean;
};

export type PriorityPool = {
  groups: Array<BaseGroup>;
};

export type PriorityPoolMutate = {
  groups: Array<BaseGroup['slug']>;
};

export type Registration = {
  allow_photo: boolean;
  created_at: string;
  has_attended: boolean;
  is_on_wait: boolean;
  registration_id: number;
  survey_submission: UserSubmission;
  has_unanswered_evaluation: boolean;
  user_info: UserList;
  payment_expiredate: Date;
  has_paid_order?: boolean;
  wait_queue_number?: number;
};

export type PublicRegistration = {
  user_info: Registration['user_info'] | null;
};

export type EventStatistics = {
  has_attended_count: number;
  list_count: number;
  waiting_list_count: number;
  studyyears: Array<{ studyyear: Group['name']; amount: number }>;
  studies: Array<{ study: Group['name']; amount: number }>;
  has_allergy_count: number;
};
