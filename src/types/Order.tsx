import { Event } from '~/types/Event';
import { User } from '~/types/User';

export type Order = {
  order_id: string;
  user_id: User['user_id'];
  event: Event['id'];
  status: string;
  payment_link: string;
};

export type OrderList = {
  order_id: string;
  user: Pick<User, 'first_name' | 'last_name' | 'email' | 'image' | 'user_id'>;
  event: Pick<Event, 'title' | 'start_date' | 'image' | 'id' | 'end_date'>;
  status: string;
  created_at: string;
};
