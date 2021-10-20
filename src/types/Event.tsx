import { UserClass, UserStudy } from 'types/Enums';
import { User } from 'types/User';
import { UserSubmission } from 'types/Form';
import { GroupList } from 'types/Group';

export interface Category {
  created_at: string;
  id: number;
  text: string;
  updated_at: string;
}

export interface Event {
  closed: boolean;
  category: number;
  description: string;
  end_date: string;
  end_registration_at: string;
  evaluation: string | null;
  expired: boolean;
  group: GroupList | null;
  id: number;
  image?: string;
  image_alt?: string;
  limit: number;
  list_count: number;
  location: string;
  registration_priorities: Array<RegistrationPriority>;
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
}
export type EventRequired = Partial<Event> & Pick<Event, 'end_date' | 'title' | 'start_date'> & { group: GroupList['slug'] };
export type EventCompact = Pick<Event, 'end_date' | 'expired' | 'group' | 'id' | 'image' | 'image_alt' | 'location' | 'title' | 'start_date' | 'updated_at'>;

export interface RegistrationPriority {
  user_class: UserClass;
  user_study: UserStudy;
}

export interface Registration {
  allow_photo: boolean;
  created_at: string;
  has_attended: boolean;
  is_on_wait: boolean;
  registration_id: number;
  survey_submission: UserSubmission;
  has_unanswered_evaluation: boolean;
  user_info: Pick<User, 'allergy' | 'email' | 'first_name' | 'last_name' | 'image' | 'user_class' | 'user_id' | 'user_study'>;
}
