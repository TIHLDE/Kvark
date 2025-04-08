import type { Event } from '~/types/Event';
import type { User } from '~/types/User';

export type Order = {
  order_id: string;
  user_id: User['user_id'];
  event: Event['id'];
  status: string;
  payment_link: string;
};
