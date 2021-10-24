import { EventCompact } from 'types/Event';
import { UserBase } from 'types/User';
import { StrikeReason } from 'types/Enums';

export type Strike = {
  id: string;
  description: string;
  strike_size: number;
  expires_at: string;
  created_at: string;
  creator?: UserBase | null;
  event: EventCompact;
};

export type StrikeList = Strike & {
  user: UserBase;
};

export type StrikeCreate = Pick<Strike, 'description' | 'strike_size'> & {
  user_id: UserBase['user_id'];
  event_id?: EventCompact['id'];
  enum?: StrikeReason;
};
