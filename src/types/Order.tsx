import { Event } from 'types/Event';
import { User } from 'types/User';

export type Order = {
  order_id: string;
  user_id: User['user_id'];
  event: Event['id'];
  status: string;
  payment_link: string;
};
