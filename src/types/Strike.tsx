import type { StrikeReason } from '~/types/Enums';
import type { EventList } from '~/types/Event';
import type { UserBase } from '~/types/User';

export type Strike = {
  id: string;
  description: string;
  strike_size: number;
  expires_at: string;
  created_at: string;
  creator?: UserBase | null;
  event: EventList;
};

export type StrikeList = Strike & {
  user: UserBase;
};

export type StrikeCreate = Pick<Strike, 'description' | 'strike_size'> & {
  user_id: UserBase['user_id'];
  event_id?: EventList['id'];
  enum?: StrikeReason;
};
