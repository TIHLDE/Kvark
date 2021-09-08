import { UserClass, UserStudy } from 'types/Enums';
import { User } from 'types/User';

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
  evaluate_link: string;
  evaluation: string;
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
  survey: string | null;
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
  created_at: string;
  has_attended: boolean;
  is_on_wait: boolean;
  registration_id: number;
  user_info: Pick<User, 'allergy' | 'email' | 'first_name' | 'last_name' | 'image' | 'user_class' | 'user_id' | 'user_study'>;
}
