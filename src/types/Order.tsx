import { Event } from 'types/Event';
import { User } from 'types/User';

export type Order = {
  access: string[];
  order_id: string;
  user_id: User['user_id'];
  event: Event;
  status: string;
  expire_date: Date;
  payment_link: string;
};

export type OrderList = Pick<Order, 'order_id' | 'event' | 'status' | 'payment_link'>;
